import React, { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Map as LeafletMap, Marker, Popup, TileLayer } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { styled, useStyletron } from 'baseui';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Spinner } from 'baseui/spinner';
import { Paragraph2, Paragraph4, Label2 } from 'baseui/typography';
import { StyledCard } from './..';
import { StyledBody } from 'baseui/card';
import { StyledLink } from "baseui/link";
import { Marker as MarkerIcon } from './..';
import { StyledTable, StyledBody as StyledTableBody, StyledRow, StyledCell } from 'baseui/table';
import { Tabs, Tab } from 'baseui/tabs';

import { useData } from '../../contexts/DataContext';
import groupBy from 'lodash.groupby';
import useWindowDimensions from '../../hooks/window-dimensions';

const MIN_MARKER_SIZE = 32;
const MAX_MARKER_SIZE = 64;

const Centered = styled('div', ({ $theme }) => ({
  backgroundColor: $theme.colors.backgroundPrimary,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  height: '100vh',
}));

function createMarkerIcon(size, casesCount, deathsCount) {
  return divIcon({
    iconSize: [size, size],
    html: renderToStaticMarkup(
      <MarkerIcon size={size} casesCount={casesCount} deathsCount={deathsCount} />
    )
  });
}

function getMarkerSize(max, count) {
  return (count / max * (MAX_MARKER_SIZE - MIN_MARKER_SIZE)) + MIN_MARKER_SIZE;
}

export default function Map(props) {
  const position = [51.984880, 19.368896];
  const [activeCity, setActiveCity] = useState(null);
  const [activeKey, setActiveKey] = useState('0');
  const { width } = useWindowDimensions();
  const [, theme] = useStyletron();

  const { cases, deaths, isLoading } = useData();

  if (isLoading) {
    return (
      <Centered>
        <Spinner />
        <Paragraph2>Ładowanie danych</Paragraph2>
      </Centered>
    )
  }

  const groupedCases = groupBy(cases, 'city');
  const groupedDeaths = groupBy(deaths, 'city');

  let data = [];

  if (!data.length) {
    for (const city of Object.keys(groupedCases)) {
      data.push({
        city,
        cases: groupedCases[city],
        deaths: groupedDeaths[city] || []
      })
    }
  }

  const max = Math.max(...(data.map(({ cases }) => cases.length)));

  return (
    <LeafletMap center={position} zoom={width < theme.breakpoints.medium ? 6 : 7} zoomControl={false} maxZoom={11} minZoom={4} {...props}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      <MarkerClusterGroup
        showCoverageOnHover={false}
        iconCreateFunction={(cluster) => {
          const count = cluster
            .getAllChildMarkers()
            .reduce((total, marker) => marker.options.count + total, 0);

          return createMarkerIcon(getMarkerSize(max, count), count);
        }}
      >
        {data && data.map(({ city, cases, deaths }) => (
          <Marker
            key={city}
            position={[
              cases[0].location[0],
              cases[0].location[1],
            ]}
            icon={createMarkerIcon(getMarkerSize(max, cases.length), cases.length, deaths.length)}
            onClick={() => {
              setActiveKey('0');
              setActiveCity({ name: city, cases, deaths })
            }}
            count={cases.length}
          />
        ))}
      </MarkerClusterGroup>
      {activeCity && <Popup
        position={[
          activeCity.cases[0].location[0],
          activeCity.cases[0].location[1]
        ]}
        onClose={() => setActiveCity(null)}
      >
        <StyledCard width="320px">
          <StyledBody>
            <Label2>{activeCity.name}</Label2>
            <Paragraph4>
              Liczba przypadków: {activeCity.cases.length}<br />
              Liczba zgonów: {activeCity.deaths.length}
            </Paragraph4>

            <Tabs
              onChange={({ activeKey }) => {
                setActiveKey(activeKey);
              }}
              activeKey={activeKey}
              overrides={{
                TabBar: {
                  style: {
                    padding: 0
                  }
                }
              }}
            >
              <Tab title="Przypadki">
                {activeCity.cases && (
                  <StyledTable>
                    <StyledTableBody>
                      {activeCity.cases.map(({ reportedAt, source }, index) => (
                        <StyledRow key={index}>
                          <StyledCell>
                            <Paragraph4
                              margin={0}
                            >
                              {reportedAt}
                            </Paragraph4>
                          </StyledCell>
                          <StyledCell>
                            <Paragraph4
                              margin={0}
                            >
                              <StyledLink href={source} target="_blank" >Źródło</StyledLink>
                            </Paragraph4>
                          </StyledCell>
                        </StyledRow>
                      ))}
                    </StyledTableBody>
                  </StyledTable>
                )}
              </Tab>
              {activeCity.deaths.length && <Tab title="Zgony">
                {activeCity.deaths && (
                  <StyledTable>
                    <StyledTableBody>
                      {activeCity.deaths.map(({ reportedAt, source }, index) => (
                        <StyledRow key={index}>
                          <StyledCell>
                            <Paragraph4
                              margin={0}
                            >
                              {reportedAt}
                            </Paragraph4>
                          </StyledCell>
                          <StyledCell>
                            <Paragraph4
                              margin={0}
                            >
                              <StyledLink href={source} target="_blank" >Źródło</StyledLink>
                            </Paragraph4>
                          </StyledCell>
                        </StyledRow>
                      ))}
                    </StyledTableBody>
                  </StyledTable>
                )}
              </Tab>}
            </Tabs>
          </StyledBody>
        </StyledCard>
      </Popup>}
    </LeafletMap>
  );
}