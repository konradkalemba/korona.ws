import React, {useCallback, useEffect, useState} from 'react';
import {StyledBody, StyledTitle} from 'baseui/card';
import {useStyletron} from 'baseui';
import groupBy from "lodash.groupby"

import {StyledCard} from '..';
import {useData} from '../../contexts/DataContext';
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts"
import Loader from "../DataElement/Loader"
import {sum} from "../../helpers/misc"
import {Button} from "baseui/button"

const CASES_KEY = 'cases';
const DEATHS_KEY = 'deaths';
const CURES_KEY = 'cures';

function accumulateData(data) {
  let cumulativeCases = 0;
  let cumulativeDeaths = 0;
  let cumulativeCures = 0;

  return Object
    .entries(groupBy(data, 'date'))
    .map(([date, dataPerDate]) => {
      const casesDateCount = sum(dataPerDate.filter(el => el.key === CASES_KEY))
      const deathsDateCount = sum(dataPerDate.filter(el => el.key === DEATHS_KEY))
      const curesDateCount = sum(dataPerDate.filter(el => el.key === CURES_KEY))

      cumulativeCases += casesDateCount;
      cumulativeDeaths += deathsDateCount;
      cumulativeCures += curesDateCount;

      return {
        date: date.substring(5), // strip year
        [CASES_KEY]: cumulativeCases,
        [DEATHS_KEY]: cumulativeDeaths,
        [CURES_KEY]: cumulativeCures
      };
    });
}

export default function Graphs() {
  const { cases, deaths, cures, isLoading } = useData();
  const [open, setOpen] = useState(true);
  const handleHideOpenClick = useCallback(() => {
    setOpen(!open)
  }, [open]);

  const [groupedData, setGroupedData] = useState(null);
  const [css, theme] = useStyletron();
  const activeDotSettings = {r: 2};
  const dotSettings = {r: 2};

  useEffect(() => {
    const preparedCases = cases ? cases.map(el => ({...el, key: CASES_KEY})) : [];
    const preparedDeaths = deaths ? deaths.map(el => ({...el, key: DEATHS_KEY})) : [];
    const preparedCures = cures ? cures.map(el => ({...el, key: CURES_KEY})) : [];

    setGroupedData(accumulateData([...preparedCases, ...preparedDeaths, ...preparedCures]));
  }, [cases, deaths, cures]);

  return (
    <StyledCard width="380px">
      <StyledTitle>
        <div className={css({display: 'flex', justifyContent: 'space-between', lineHeight: '1.78'})}>
          <span>Historia</span>
          <Button onClick={handleHideOpenClick}>
            {open ? 'Ukryj' : 'Pokaż'}
          </Button>
        </div>
      </StyledTitle>
      {
        open &&
        <StyledBody>
          {isLoading ? <Loader/> : (
            <LineChart width={300} height={300} data={groupedData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="date"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Line name="Przypadki" type="monotone" dataKey={CASES_KEY} stroke={theme.colors.negative} dot={dotSettings}
                    activeDot={activeDotSettings}/>
              <Line name="Zgony" type="monotone" dataKey={DEATHS_KEY} stroke={theme.colors.primary} dot={dotSettings}
                    activeDot={activeDotSettings}/>
              <Line name="Wyleczenia" type="monotone" dataKey={CURES_KEY} stroke={theme.colors.positive} dot={dotSettings}
                    activeDot={activeDotSettings}/>
            </LineChart>
          )}
        </StyledBody>
      }
    </StyledCard>
  );
}
