import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledBody } from 'baseui/card';
import { StyledCard } from '..';
import { Block } from 'baseui/block';
import {
  Bar,
  BarChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import Loader from './Loader';

import { useData } from '../../contexts/DataContext';
import groupBy from 'lodash.groupby';
import { sum } from '../../helpers/misc';
import { useStyletron } from 'baseui';

const CASES_KEY = 'cases';
const DEATHS_KEY = 'deaths';
const CURES_KEY = 'cures';

function accumulateData(data) {
  return Object.entries(groupBy(data, 'voivodeship'))
    .map(([voivodeship, dataPerVoivodeship]) => {
      const casesCount = sum(
        dataPerVoivodeship.filter((el) => el.key === CASES_KEY)
      );
      const deathsCount = sum(
        dataPerVoivodeship.filter((el) => el.key === DEATHS_KEY)
      );
      const curescount = sum(
        dataPerVoivodeship.filter((el) => el.key === CURES_KEY)
      );

      return {
        voivodeship,
        [CASES_KEY]: casesCount,
        [DEATHS_KEY]: deathsCount,
        [CURES_KEY]: curescount,
      };
    })
    .sort((a, b) => b[[CASES_KEY]] - a[[CASES_KEY]]);
}

export default function VoivodeshipsSplit() {
  const { t } = useTranslation();
  const { cases, deaths, cures, isLoading } = useData();
  const [groupedData, setGroupedData] = useState(null);
  const [css, theme] = useStyletron();
  const { setClickedVoivodeship } = useData();

  useEffect(() => {
    const preparedCases = cases
      ? cases
          .filter((el) => el.voivodeship)
          .map((el) => ({ ...el, key: CASES_KEY }))
      : [];
    const preparedDeaths = deaths
      ? deaths
          .filter((el) => el.voivodeship)
          .map((el) => ({ ...el, key: DEATHS_KEY }))
      : [];
    const preparedCures = cures
      ? cures
          .filter((el) => el.voivodeship)
          .map((el) => ({ ...el, key: CURES_KEY }))
      : [];

    setGroupedData(
      accumulateData([...preparedCases, ...preparedDeaths, ...preparedCures])
    );
  }, [cases, deaths, cures]);

  return (
    <StyledCard
      style={($theme) => ({
        [$theme.mediaQuery.medium]: {
          maxHeight: 'calc(100vh - 200px)',
          overflow: 'auto',
        },
        [$theme.mediaQuery.large]: {
          width: '320px',
        },
      })}
    >
      <StyledBody>
        <Block
          $style={{
            margin: '12px 0 20px',
            overflow: 'hidden',
          }}
        >
          {isLoading && <Loader />}
          {groupedData && (
            <ResponsiveContainer height={groupedData.length * 26} width={'99%'}>
              <BarChart
                data={groupedData}
                layout='vertical'
                className={css({
                  fontSize: '12px',
                })}
              >
                <YAxis
                  dataKey='voivodeship'
                  type='category'
                  tick={{
                    fill: theme.colors.contentPrimary,
                    cursor: 'pointer',
                  }}
                  width={130}
                  onClick={({ value }) => setClickedVoivodeship(value)}
                />
                <XAxis type='number' hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.colors.backgroundPrimary,
                    borderColor: theme.colors.backgroundTertiary,
                  }}
                  cursor={{ fill: theme.colors.backgroundTertiary }}
                />
                <Bar
                  name={t('confirmedCasesShort')}
                  stackId={'a'}
                  dataKey={CASES_KEY}
                  fill={theme.colors.negative}
                />
                <Bar
                  name={t('deaths')}
                  stackId={'a'}
                  dataKey={DEATHS_KEY}
                  fill={theme.colors.primary}
                />
                <Bar
                  name={t('cured')}
                  stackId={'a'}
                  dataKey={CURES_KEY}
                  fill={theme.colors.positive}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Block>
      </StyledBody>
    </StyledCard>
  );
}
