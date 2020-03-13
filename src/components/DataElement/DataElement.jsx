import React, { useState } from 'react';
import { StyledBody } from 'baseui/card';
import { Tabs, Tab } from 'baseui/tabs';
import { StyledTable, StyledBody as StyledTableBody, StyledRow, StyledCell, StyledHead, StyledHeadCell } from 'baseui/table';
import { Paragraph4, Paragraph3, Label3 } from 'baseui/typography';
import { StyledLink } from 'baseui/link';
import { Block } from 'baseui/block';
import { ProgressBar } from 'baseui/progress-bar';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import ContentLoader from 'react-content-loader';
import { StyledCard } from '..';

import { useData } from '../../contexts/DataContext';
import groupBy from 'lodash.groupby';
import { useStyletron } from 'baseui';
import { sum } from '../../helpers/misc';
import moment from 'moment';

function Loader() {
  const [, theme] = useStyletron();

  return (
    <ContentLoader
      speed={0.6}
      width={300}
      height={200}
      display={'block'}
      viewBox="0 0 300 200"
      backgroundColor={theme.colors.backgroundTertiary}
      foregroundColor={theme.colors.backgroundSecondary}
    >
      <rect x="20" y="6" rx="2" ry="2" width="80" height="22" />
      <rect x="110" y="6" rx="2" ry="2" width="200" height="22" />
      <rect x="40" y="40" rx="2" ry="2" width="60" height="22" />
      <rect x="110" y="40" rx="2" ry="2" width="170" height="22" />
      <rect x="30" y="74" rx="2" ry="2" width="70" height="22" />
      <rect x="110" y="74" rx="2" ry="2" width="140" height="22" />
      <rect x="20" y="108" rx="2" ry="2" width="80" height="22" />
      <rect x="110" y="108" rx="2" ry="2" width="100" height="22" />
      <rect x="50" y="142" rx="2" ry="2" width="50" height="22" />
      <rect x="110" y="142" rx="2" ry="2" width="100" height="22" />
      <rect x="40" y="176" rx="2" ry="2" width="60" height="22" />
      <rect x="110" y="176" rx="2" ry="2" width="60" height="22" />
    </ContentLoader>
  );
}

function prepareData(cases) {
  return Object
    .entries(groupBy(cases, 'city'))
    .map(([city, data]) => ({ city, count: sum(data) }))
    .sort((a, b) => b.count - a.count);
}

export default function DataElement() {
  const { cases, deaths, isLoading } = useData();
  const [activeKey, setActiveKey] = useState('0');
  const [css, theme] = useStyletron();

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
            <Label3>Podział na miasta</Label3>
            <Block
              $style={{
                height: '196px',
                overflow: 'auto',
                margin: '12px 0 20px'
              }}
            >
              {isLoading && <Loader />}
              {cases && (data => (
                <BarChart
                  width={320}
                  height={data.length * 32}
                  data={data}
                  layout="vertical"
                >
                  <YAxis dataKey="city" type="category" tick={{ fill: theme.colors.contentPrimary }} width={100} />
                  <XAxis type="number" hide />
                  <Tooltip
                    formatter={value => [value, 'Liczba']}
                  />
                  <Bar dataKey="count" fill={theme.colors.accent} />
                </BarChart>
              ))(prepareData(cases))}
            </Block>

            <Label3>Ostatnie</Label3>
            <StyledTable
              $style={{
                borderColor: theme.colors.backgroundTertiary,
                marginTop: '12px',
                minHeight: '100px'
              }}
            >
              {isLoading && (
                <ProgressBar
                  infinite
                  overrides={{
                    Bar: {
                      style: {
                        marginBottom: 0,
                        marginLeft: 0,
                        marginRight: 0,
                        marginTop: 0,
                      },
                    },
                  }}
                />
              )}
              <StyledHead role="row">
                <StyledHeadCell role="columnheader">
                  <Paragraph3 margin={0}>Data</Paragraph3>
                </StyledHeadCell>
                <StyledHeadCell role="columnheader">
                  <Paragraph3 margin={0}>Liczba</Paragraph3>
                </StyledHeadCell>
                <StyledHeadCell role="columnheader">
                  <Paragraph3 margin={0}>Miasto</Paragraph3>
                </StyledHeadCell>
              </StyledHead>
              <StyledTableBody>
                {cases && cases.sort((a, b) => moment(b.date).format('YYYYMMDD') - moment(a.date).format('YYYYMMDD')).map(({ date, count, city, source }, index) => (
                  <StyledRow key={index}>
                    <StyledCell>
                      <Paragraph4
                        margin={0}
                      >
                        <StyledLink href={source} target="_blank">{date}</StyledLink>
                      </Paragraph4>
                    </StyledCell>
                    <StyledCell>
                      <Paragraph4
                        margin={0}
                      >
                        {count}
                      </Paragraph4>
                    </StyledCell>
                    <StyledCell>
                      <Paragraph4
                        margin={0}
                      >
                        {city}
                      </Paragraph4>
                    </StyledCell>
                  </StyledRow>
                ))}
              </StyledTableBody>
            </StyledTable>
          </Tab>
          <Tab title="Zgony">
            <Label3>Podział na miasta</Label3>
            <Block
              $style={{
                height: '196px',
                overflow: 'auto',
                margin: '12px 0 20px'
              }}
            >
              {isLoading && <Loader />}
              {deaths && (data => (
                <BarChart
                  width={320}
                  height={data.length * 32}
                  data={data}
                  layout="vertical"
                >
                  <YAxis dataKey="city" type="category" tick={{ fill: theme.colors.contentPrimary }} width={100} />
                  <XAxis type="number" hide />
                  <Tooltip
                    formatter={value => [value, 'Liczba']}
                  />
                  <Bar dataKey="count" fill={theme.colors.accent} />
                </BarChart>
              ))(prepareData(deaths))}
            </Block>

            <Label3>Ostatnie</Label3>
            <StyledTable
              $style={{
                borderColor: theme.colors.backgroundTertiary,
                marginTop: '12px',
                minHeight: '100px'
              }}
            >
              {isLoading && (
                <ProgressBar
                  infinite
                  overrides={{
                    Bar: {
                      style: {
                        marginBottom: 0,
                        marginLeft: 0,
                        marginRight: 0,
                        marginTop: 0,
                      },
                    },
                  }}
                />
              )}
              <StyledHead role="row">
                <StyledHeadCell role="columnheader">
                  <Paragraph3 margin={0}>Data</Paragraph3>
                </StyledHeadCell>
                <StyledHeadCell role="columnheader">
                  <Paragraph3 margin={0}>Liczba</Paragraph3>
                </StyledHeadCell>
                <StyledHeadCell role="columnheader">
                  <Paragraph3 margin={0}>Miasto</Paragraph3>
                </StyledHeadCell>
              </StyledHead>
              <StyledTableBody>
                {deaths && deaths.sort((a, b) => moment(b.date).format('YYYYMMDD') - moment(a.date).format('YYYYMMDD')).map(({ date, count, city, source }, index) => (
                  <StyledRow key={index}>
                    <StyledCell>
                      <Paragraph4
                        margin={0}
                      >
                        <StyledLink href={source} target="_blank">{date}</StyledLink>
                      </Paragraph4>
                    </StyledCell>
                    <StyledCell>
                      <Paragraph4
                        margin={0}
                      >
                        {count}
                      </Paragraph4>
                    </StyledCell>
                    <StyledCell>
                      <Paragraph4
                        margin={0}
                      >
                        {city}
                      </Paragraph4>
                    </StyledCell>
                  </StyledRow>
                ))}
              </StyledTableBody>
            </StyledTable>
          </Tab>
        </Tabs>
      </StyledBody>
    </StyledCard>
  );
}