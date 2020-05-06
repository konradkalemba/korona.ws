import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledBody } from 'baseui/card';
import { Tabs } from 'baseui/tabs';
import { useStyletron } from 'baseui';
import { Checkbox, LABEL_PLACEMENT } from 'baseui/checkbox';
import groupBy from 'lodash.groupby';

import { StyledCard } from '..';
import { useData } from '../../contexts/DataContext';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Loader from './Loader';
import { sum } from '../../helpers/misc';
import moment from 'moment';
import ResponsiveTab from '../Common/ResponsiveTab';

const CASES_KEY = 'cases';
const DAILY_CASES_KEY = 'dailyCases';
const DEATHS_KEY = 'deaths';
const DAILY_DEATH_KEY = 'dailyDeaths';
const CURES_KEY = 'cures';
const DAILY_CURES_KEY = 'dailyCures';

const STACK_PER_DATE_ID = 'stackPerDate';

function accumulateData(data) {
  const DATE_FORMAT = 'DD.MM';
  let cumulativeCases = 0;
  let cumulativeDeaths = 0;
  let cumulativeCures = 0;

  const accumulatedData = Object.entries(groupBy(data, 'date'))
    .sort(([a], [b]) => moment(a).diff(b))
    .map(([date, dataPerDate]) => {
      const casesDateCount = sum(
        dataPerDate.filter((el) => el.key === CASES_KEY)
      );
      const deathsDateCount = sum(
        dataPerDate.filter((el) => el.key === DEATHS_KEY)
      );
      const curesDateCount = sum(
        dataPerDate.filter((el) => el.key === CURES_KEY)
      );

      cumulativeCases += casesDateCount;
      cumulativeDeaths += deathsDateCount;
      cumulativeCures += curesDateCount;

      return {
        date: moment(date).format(DATE_FORMAT),
        [CASES_KEY]: cumulativeCases,
        [DAILY_CASES_KEY]: casesDateCount,
        [DEATHS_KEY]: cumulativeDeaths,
        [DAILY_DEATH_KEY]: deathsDateCount,
        [CURES_KEY]: cumulativeCures,
        [DAILY_CURES_KEY]: curesDateCount,
      };
    });

  return accumulatedData.filter(
    (caseElement) => caseElement.date !== moment().format(DATE_FORMAT)
  );
}

export default function DailyGrowth() {
  const { cases, deaths, cures, isLoading } = useData();

  const { t } = useTranslation();
  const [groupedData, setGroupedData] = useState(null);
  const [activeKey, setActiveKey] = useState('0');
  const [css, theme] = useStyletron();

  const [graphFilter, setGraphFilter] = useState([
    {
      key: t('confirmedCasesShort'),
      group: [CASES_KEY, DAILY_CASES_KEY],
      selected: true,
    },
    {
      key: t('deaths'),
      group: [DEATHS_KEY, DAILY_DEATH_KEY],
      selected: true,
    },
    {
      key: t('cured'),
      group: [DAILY_CURES_KEY, CURES_KEY],
      selected: true,
    },
  ]);

  const lineGraph = [
    {
      name: t('confirmedCasesShort'),
      key: CASES_KEY,
      color: theme.colors.negative,
    },
    {
      name: t('deaths'),
      key: DEATHS_KEY,
      color: theme.colors.primary,
    },
    {
      name: t('cured'),
      key: CURES_KEY,
      color: theme.colors.positive,
    },
  ];

  const barGraph = [
    {
      name: t('confirmedCasesShort'),
      key: DAILY_CASES_KEY,
      color: theme.colors.negative,
    },
    {
      name: t('deaths'),
      key: DAILY_DEATH_KEY,
      color: theme.colors.primary,
    },
    {
      name: t('cured'),
      key: DAILY_CURES_KEY,
      color: theme.colors.positive,
    },
  ];

  function filterGroups(item) {
    return graphFilter.find(
      ({ group, selected }) => group.includes(item.key) && selected
    );
  }

  useEffect(() => {
    const preparedCases = cases
      ? cases.filter((el) => el.date).map((el) => ({ ...el, key: CASES_KEY }))
      : [];
    const preparedDeaths = deaths
      ? deaths.filter((el) => el.date).map((el) => ({ ...el, key: DEATHS_KEY }))
      : [];
    const preparedCures = cures
      ? cures.filter((el) => el.date).map((el) => ({ ...el, key: CURES_KEY }))
      : [];

    setGroupedData(
      accumulateData([...preparedCases, ...preparedDeaths, ...preparedCures])
    );
  }, [cases, deaths, cures]);

  function handleInputChange(item, index) {
    graphFilter[index].selected = !item.selected;

    setGraphFilter([...graphFilter]);
  }

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
            TabContent: {
              style: {
                padding: '10px 0 0 0',
              },
            },
          }}
        >
          <ResponsiveTab title={t('casesOverall')}>
            <StyledBody>
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
                  {lineGraph.filter(filterGroups).map((item) => (
                    <Line
                      name={item.name}
                      type='monotone'
                      dataKey={item.key}
                      strokeWidth={2}
                      stroke={item.color}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </StyledBody>
          </ResponsiveTab>
          <ResponsiveTab title={t('casesDaily')}>
            <StyledBody>
              <ResponsiveContainer height={180}>
                <BarChart data={groupedData}>
                  <XAxis dataKey='date' />
                  <YAxis hide={true} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.colors.backgroundPrimary,
                      borderColor: theme.colors.backgroundTertiary,
                    }}
                    cursor={{ fill: theme.colors.backgroundTertiary }}
                  />

                  {barGraph.filter(filterGroups).map((item) => (
                    <Bar
                      name={item.name}
                      stackId={STACK_PER_DATE_ID}
                      dataKey={item.key}
                      fill={item.color}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </StyledBody>
          </ResponsiveTab>
        </Tabs>
      )}
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-evenly',
        })}
      >
        {graphFilter.map((item, index) => (
          <Checkbox
            checked={item.selected}
            onChange={() => handleInputChange(item, index)}
            labelPlacement={LABEL_PLACEMENT.right}
          >
            {item.key}
          </Checkbox>
        ))}
      </div>
    </StyledCard>
  );
}
