import React, {useEffect, useState} from 'react';
import {StyledBody} from 'baseui/card';
import {Tab, Tabs} from 'baseui/tabs';
import {StyledCard} from '..';
import { Notification } from 'baseui/notification';

import {useData} from '../../contexts/DataContext';
import groupBy from 'lodash.groupby';
import {sum} from '../../helpers/misc';
import CitiesSplit from './CitiesSplit';
import Recent from './Recent';

function prepareData(cases) {
  return Object
    .entries(groupBy(cases, 'city'))
    .map(([city, data]) => ({ city, count: sum(data) }))
    .sort((a, b) => b.count - a.count)
    .filter(({ city }) => city !== 'undefined');
}

export default function DataElement() {
  const { cases, deaths, cures, isLoading } = useData();
  const [groupedCases, setGroupedCases] = useState(null);
  const [groupedDeaths, setGroupedDeaths] = useState(null);
  const [groupedCures, setGroupedCures] = useState(null);
  const [activeKey, setActiveKey] = useState('0');

  useEffect(() => {
    setGroupedCases(prepareData(cases));
    setGroupedDeaths(prepareData(deaths));
    setGroupedCures(prepareData(cures));
  }, [cases, deaths, cures])

  return (
    <StyledCard
      width="420px"
    >
      <StyledBody>
        <Tabs
          onChange={({ activeKey }) => {
            setActiveKey(activeKey);
          }}
          activeKey={activeKey}
          overrides={{
            TabContent: {
              style: {
                maxHeight: '400px',
                overflow: 'auto',
                textAlign: 'left',
                padding: '14px'
              }
            }
          }}
        >
          <Tab title="Potwierdzone przypadki">
            <CitiesSplit data={groupedCases} isLoading={isLoading} />
            <Recent data={cases} isLoading={isLoading} />
          </Tab>
          <Tab title="Zgony">
            <CitiesSplit data={groupedDeaths} isLoading={isLoading} />
            <Recent data={deaths} isLoading={isLoading} />
          </Tab>
          <Tab title="Wyleczenia">       
            <Notification>
              Liczba wyleczonych została skorygowana po błędnej interpretacji komunikatu GIS-u, który mówił o 13 ozdrowiałych.
            </Notification>
            <CitiesSplit data={groupedCures} isLoading={isLoading} />
            <Recent data={cures} isLoading={isLoading} />
          </Tab>
        </Tabs>
      </StyledBody>
    </StyledCard>
  );
}
