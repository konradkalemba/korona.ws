import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyledBody } from "baseui/card";
import { useStyletron } from "baseui";
import groupBy from "lodash.groupby";

import { StyledCard } from "..";
import { useData } from "../../contexts/DataContext";
import {
  ResponsiveContainer,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import Loader from "./Loader";
import { sum } from "../../helpers/misc";
import { Label3 } from "baseui/typography";
import { Block } from "baseui/block";
import moment from "moment";

const CASES_KEY = "cases";
const DEATHS_KEY = "deaths";
const CURES_KEY = "cures";

function accumulateData(data) {
  let cumulativeCases = 0;
  let cumulativeDeaths = 0;
  let cumulativeCures = 0;

  return Object.entries(groupBy(data, "date")).map(([date, dataPerDate]) => {
    const casesDateCount = sum(dataPerDate.filter(el => el.key === CASES_KEY));
    const deathsDateCount = sum(
      dataPerDate.filter(el => el.key === DEATHS_KEY)
    );
    const curesDateCount = sum(dataPerDate.filter(el => el.key === CURES_KEY));

    cumulativeCases += casesDateCount;
    cumulativeDeaths += deathsDateCount;
    cumulativeCures += curesDateCount;

    return {
      date: moment(date).format("DD/MM"),
      [CASES_KEY]: cumulativeCases,
      [DEATHS_KEY]: cumulativeDeaths,
      [CURES_KEY]: cumulativeCures
    };
  });
}

export default function DailyGrowth() {
  const { cases, deaths, cures, isLoading } = useData();

  const { t } = useTranslation();
  const [groupedData, setGroupedData] = useState(null);
  const [, theme] = useStyletron();

  useEffect(() => {
    const preparedCases = cases
      ? cases.map(el => ({ ...el, key: CASES_KEY }))
      : [];
    const preparedDeaths = deaths
      ? deaths.map(el => ({ ...el, key: DEATHS_KEY }))
      : [];
    const preparedCures = cures
      ? cures.map(el => ({ ...el, key: CURES_KEY }))
      : [];

    setGroupedData(
      accumulateData([...preparedCases, ...preparedDeaths, ...preparedCures])
    );
  }, [cases, deaths, cures]);

  return (
    <StyledCard
      style={$theme => ({
        [$theme.mediaQuery.medium]: {
          maxHeight: "calc(100vh - 80px)"
        }
      })}
    >
      <StyledBody>
        <Label3>{t("dailyGrowth")}</Label3>
        <Block
          $style={{
            margin: "12px 0 20px"
          }}
        ></Block>

        {isLoading ? (
          <Loader />
        ) : (
          <ResponsiveContainer height={180}>
            <LineChart data={groupedData}>
              <XAxis dataKey="date" />
              <YAxis hide={true} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.colors.backgroundPrimary,
                  borderColor: theme.colors.backgroundTertiary
                }}
                cursor={{ fill: theme.colors.backgroundTertiary }}
              />
              <Line
                name={t("confirmedCasesShort")}
                type="monotone"
                dataKey={CASES_KEY}
                strokeWidth={2}
                stroke={theme.colors.negative}
                dot={false}
              />
              <Line
                name={t("deaths")}
                type="monotone"
                dataKey={DEATHS_KEY}
                strokeWidth={2}
                stroke={theme.colors.primary}
                dot={false}
              />
              <Line
                name={t("cured")}
                type="monotone"
                dataKey={CURES_KEY}
                strokeWidth={2}
                stroke={theme.colors.positive}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </StyledBody>
    </StyledCard>
  );
}
