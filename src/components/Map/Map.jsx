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

const Centered = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  height: '98vh',
});

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

export default function Map() {
  const position = [51.984880, 19.368896];
  const [activeCity, setActiveCity] = useState(null);
  const [activeKey, setActiveKey] = useState('0');
  const { width } = useWindowDimensions();
  const [, theme] = useStyletron();

  const { cities, cases, deaths, isLoading } = useData();

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
    for (const city of cities) {
      data.push({
        city,
        cases: {
          total: groupedCases[city.name].reduce((total, { count }) => count + total, 0),
          data: groupedCases[city.name] || []
        },
        deaths: {
          total: groupedDeaths[city.name].reduce((total, { count }) => count + total, 0),
          data: groupedDeaths[city.name] || []
        }
      })
    }
  }

  const max = Math.max(...(data.map(({ cases }) => cases.total)));

  return (
    <LeafletMap center={position} zoom={width < theme.breakpoints.medium ? 6 : 7} zoomControl={false} maxZoom={11} minZoom={4}>
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
            key={city.name}
            position={city.location}
            icon={createMarkerIcon(getMarkerSize(max, cases.total), cases.total, deaths.total)}
            onClick={() => {
              setActiveKey('0');
              setActiveCity({ ...city, cases, deaths });
            }}
            count={cases.total}
          />
        ))}
      </MarkerClusterGroup>
      {activeCity && <Popup
        position={activeCity.location}
        onClose={() => setActiveCity(null)}
      >
        <StyledCard width="320px">
          <StyledBody>
            <Label2>{activeCity.name}</Label2>
            <Paragraph4>
              Liczba przypadków: {activeCity.cases.total}<br/>
              Liczba zgonów: {activeCity.deaths.total}
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
                      {activeCity.cases.data.map(({ date, source }, index) => (
                        <StyledRow key={index}>
                          <StyledCell>
                            <Paragraph4
                              margin={0}
                            >
                              {date}
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
              {activeCity.deaths.data.length && <Tab title="Zgony">
                {activeCity.deaths.data && (
                  <StyledTable>  
                    <StyledTableBody>
                      {activeCity.deaths.data.map(({ date, source }, index) => (
                        <StyledRow key={index}>
                          <StyledCell>
                            <Paragraph4
                              margin={0}
                            >
                              {date}
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