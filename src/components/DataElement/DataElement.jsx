import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyledBody } from "baseui/card";
import { Tab, Tabs } from "baseui/tabs";
import { StyledCard } from "..";
import { Notification } from "baseui/notification";

import { useData } from "../../contexts/DataContext";
import groupBy from "lodash.groupby";
import { sum } from "../../helpers/misc";
import VoivodeshipsSplit from "./VoivodeshipsSplit";
import Recent from "./Recent";

function prepareData(cases, voivodeships) {
  return Object.entries(groupBy(cases, "voivodeship"))
    .map(([voivodeship, data]) => ({ voivodeship, count: sum(data) }))
    .filter(({ voivodeship }) => voivodeship !== "undefined")
    .sort((a, b) => b.count - a.count);
}

export default function DataElement() {
  const { t } = useTranslation();
  const { cases, deaths, cures, isLoading } = useData();
  const [groupedCases, setGroupedCases] = useState(null);
  const [groupedDeaths, setGroupedDeaths] = useState(null);
  const [groupedCures, setGroupedCures] = useState(null);
  const [activeKey, setActiveKey] = useState("0");

  useEffect(() => {
    setGroupedCases(prepareData(cases));
    setGroupedDeaths(prepareData(deaths));
    setGroupedCures(prepareData(cures));
  }, [cases, deaths, cures]);

  return (
    <StyledCard
      style={$theme => ({
        [$theme.mediaQuery.medium]: {
          maxHeight: "calc(100vh - 200px)",
          overflow: "auto"
        },
        [$theme.mediaQuery.large]: {
          width: "420px"
        }
      })}
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
                maxHeight: "400px",
                overflow: "auto",
                textAlign: "left",
                padding: "14px"
              }
            }
          }}
        >
          <Tab title={t("confirmedCases")}>
            <VoivodeshipsSplit data={groupedCases} isLoading={isLoading} />
            <Recent data={cases} isLoading={isLoading} />
          </Tab>
          <Tab title={t("deaths")}>
            <VoivodeshipsSplit data={groupedDeaths} isLoading={isLoading} />
            <Recent data={deaths} isLoading={isLoading} />
          </Tab>
          <Tab title={t("cured")}>
            <Notification
              overrides={{
                Body: {
                  style: {
                    width: "100%",
                    boxSizing: "border-box"
                  }
                }
              }}
            >
              {t("curedInfo")}
            </Notification>
            <VoivodeshipsSplit data={groupedCures} isLoading={isLoading} />
            <Recent data={cures} isLoading={isLoading} />
          </Tab>
        </Tabs>
      </StyledBody>
    </StyledCard>
  );
}
