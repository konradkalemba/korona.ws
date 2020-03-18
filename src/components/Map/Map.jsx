import React, { useState, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Map as LeafletMap, Marker, Popup, TileLayer } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { styled, useStyletron } from 'baseui';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Spinner } from 'baseui/spinner';
import { Paragraph2, Label1 } from 'baseui/typography';
import { StyledBody } from 'baseui/card';
import { Block } from 'baseui/block';
import { StyledCard } from './..';
import { Marker as MarkerIcon } from './..';
import { Figure } from '../Figures/Figures';

import { useData } from '../../contexts/DataContext';
import groupBy from 'lodash.groupby';
import useWindowDimensions from '../../hooks/window-dimensions';
import { sum } from '../../helpers/misc';

const MIN_MARKER_SIZE = 32;
const MAX_MARKER_SIZE = 64;

const Centered = styled('div', ({ $theme }) => ({
  backgroundColor: $theme.colors.backgroundPrimary,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  height: 'auto',
  width: '100vw',
  [$theme.mediaQuery.medium]: {
    height: '100vh'
  }
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

function getLocationForCity(clickedCity, data) {
  return data.filter((item) => item.city.name === clickedCity).pop().city.location;
}

export default function Map(props) {
  const [activeCity, setActiveCity] = useState(null);
  const { width } = useWindowDimensions();
  const [, theme] = useStyletron();
  const rand = useRef(Math.random());

  const { cities, cases, deaths, isLoading, clickedCity } = useData();

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
          total: sum(groupedCases[city.name]),
          data: groupedCases[city.name] || []
        },
        deaths: {
          total: sum(groupedDeaths[city.name]),
          data: groupedDeaths[city.name] || []
        }
      })
    }
  }

  const max = Math.max(...(data.map(({ cases }) => cases.total)));
  const position = clickedCity ? getLocationForCity(clickedCity, data) : [51.984880, 19.368896];

  return (
    <LeafletMap
      center={position}
      zoom={clickedCity ? 9 : width < theme.breakpoints.medium ? 6 : 7}
      zoomControl={false}
      maxZoom={10}
      minZoom={4}
      maxBounds={[[48.302684, 12.363282], [56.137388, 26.572265]]}
      {...props}
    >
      <TileLayer
        url={
          rand.current > 0.8
            ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            : 'https://osm.korona.ws/tile/{z}/{x}/{y}.png'
        }
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      <MarkerClusterGroup
        showCoverageOnHover={false}
        iconCreateFunction={(cluster) => {
          const count = cluster
            .getAllChildMarkers()
            .reduce((total, marker) => ({
              cases: marker.options.casesCount + total.cases,
              deaths: marker.options.deathsCount + total.deaths
            }), {
              cases: 0,
              deaths: 0
            });

          return createMarkerIcon(getMarkerSize(max, count.cases), count.cases, count.deaths);
        }}
      >
        {data && data.map(({ city, cases, deaths }) => (
          <Marker
            key={city.name}
            position={city.location}
            icon={createMarkerIcon(getMarkerSize(max, cases.total), cases.total, deaths.total)}
            onClick={() => {
              setActiveCity({ ...city, cases, deaths });
            }}
            casesCount={cases.total}
            deathsCount={deaths.total}
          />
        ))}
      </MarkerClusterGroup>
      {activeCity && <Popup
        position={activeCity.location}
        onClose={() => setActiveCity(null)}
      >
        <StyledCard
          style={$theme => ({
            [$theme.mediaQuery.large]: {
              width: '320px'
            }
          })}
        >
          <StyledBody>
            <Label1>{activeCity.name}</Label1>

            <Block marginTop="10px">
              <Figure
                data={activeCity.deaths.data}
                label="Zgony"
                color={theme.colors.primary}
                size="compact"
              />

              <Figure
                data={activeCity.cases.data}
                label="Potwierdzone przypadki"
                color={theme.colors.negative}
                size="compact"
              />
            </Block>
          </StyledBody>
        </StyledCard>
      </Popup>}
    </LeafletMap>
  );
}