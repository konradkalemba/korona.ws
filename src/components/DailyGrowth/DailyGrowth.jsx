import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledBody } from 'baseui/card';
import { Tabs, Tab } from 'baseui/tabs';
import { useStyletron } from 'baseui';
import groupBy from 'lodash.groupby';

import { StyledCard } from '..';
import { useData } from '../../contexts/DataContext';
import { BarChart, Bar, ResponsiveContainer, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import Loader from './Loader';
import { sum } from '../../helpers/misc';
import { Block } from 'baseui/block';
import moment from 'moment';

const CASES_KEY = 'cases';
const DAILY_CASES_KEY = 'dailyCases';
const DEATHS_KEY = 'deaths';
const CURES_KEY = 'cures';

function accumulateData(data) {
  let cumulativeCases = 0;
  let cumulativeDeaths = 0;
  let cumulativeCures = 0;

  return Object.entries(groupBy(data, 'date')).map(([date, dataPerDate]) => {
    const casesDateCount = sum(dataPerDate.filter((el) => el.key === CASES_KEY));
    const deathsDateCount = sum(dataPerDate.filter((el) => el.key === DEATHS_KEY));
    const curesDateCount = sum(dataPerDate.filter((el) => el.key === CURES_KEY));

    cumulativeCases += casesDateCount;
    cumulativeDeaths += deathsDateCount;
    cumulativeCures += curesDateCount;

    return {
      date: moment(date).format('DD/MM'),
      [CASES_KEY]: cumulativeCases,
      [DAILY_CASES_KEY]: casesDateCount,
      [DEATHS_KEY]: cumulativeDeaths,
      [CURES_KEY]: cumulativeCures,
    };
  });
}

export default function DailyGrowth() {
  const { cases, deaths, cures, isLoading } = useData();

  const { t } = useTranslation();
  const [groupedData, setGroupedData] = useState(null);
  const [activeKey, setActiveKey] = useState("0");
  const [, theme] = useStyletron();

  useEffect(() => {
    const preparedCases = cases ? cases.map((el) => ({ ...el, key: CASES_KEY })) : [];
    const preparedDeaths = deaths ? deaths.map((el) => ({ ...el, key: DEATHS_KEY })) : [];
    const preparedCures = cures ? cures.map((el) => ({ ...el, key: CURES_KEY })) : [];

    setGroupedData(accumulateData([...preparedCases, ...preparedDeaths, ...preparedCures]));
  }, [cases, deaths, cures]);

  return (
    <StyledCard
      style={($theme) => ({
        [$theme.mediaQuery.medium]: {
          maxHeight: 'calc(100vh - 80px)',
        },
      })}
    >
      {isLoading ? (
        <Loader />
      ) : (
          <Tabs
            onChange={({ activeKey }) => {
              setActiveKey(activeKey);
            }}
            activeKey={activeKey}
            overrides={{
              TabBar: {
                style: {
                  textAlign: 'center',
                  justifyContent: 'center'
                }
              }
            }}
          >
            <Tab title={t('overallGrowth')}>
              <StyledBody>
                <Block
                  $style={{
                    margin: '12px 0 20px',
                  }}
                />
                <ResponsiveContainer height={180}>
                  <LineChart data={groupedData}>
                    <XAxis dataKey='date' />
                    <YAxis hide={true} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.colors.backgroundPrimary,
                        borderColor: theme.colors.backgroundTertiary,
                      }}
                      cursor={{ fill: theme.colors.backgroundTertiary }}
                    />
                    <Line
                      name={t('confirmedCasesShort')}
                      type='monotone'
                      dataKey={CASES_KEY}
                      strokeWidth={2}
                      stroke={theme.colors.negative}
                      dot={false}
                    />
                    <Line
                      name={t('deaths')}
                      type='monotone'
                      dataKey={DEATHS_KEY}
                      strokeWidth={2}
                      stroke={theme.colors.primary}
                      dot={false}
                    />
                    <Line
                      name={t('cured')}
                      type='monotone'
                      dataKey={CURES_KEY}
                      strokeWidth={2}
                      stroke={theme.colors.positive}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </StyledBody>
            </Tab>
            <Tab title={t('dailyGrowth')}>
              <StyledBody>
                <Block
                  $style={{
                    margin: '12px 0 20px',
                  }}
                />
                <ResponsiveContainer height={180}>
                  <BarChart data={groupedData}>
                    <XAxis dataKey="date" />
                    <YAxis hide={true}/>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.colors.backgroundPrimary,
                        borderColor: theme.colors.backgroundTertiary
                      }}
                      cursor={{ fill: theme.colors.backgroundTertiary }}
                    />
                    <Bar
                      dataKey={DAILY_CASES_KEY}
                      fill={theme.colors.negative}
                      name={t('confirmedCasesDailyShort')}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </StyledBody>
            </Tab>
          </Tabs>
        )}
    </StyledCard>
  );
}
