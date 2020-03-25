import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    height: '100vh',
  },
}));

function createMarkerIcon(size, casesCount, deathsCount) {
  return divIcon({
    iconSize: [size, size],
    html: renderToStaticMarkup(<MarkerIcon size={size} casesCount={casesCount} deathsCount={deathsCount} />),
  });
}

function getMarkerSize(max, count) {
  return (count / max) * (MAX_MARKER_SIZE - MIN_MARKER_SIZE) + MIN_MARKER_SIZE;
}

function getLocationForVoivodeship(clickedVoivodeship, data) {
  return data.filter((item) => item.voivodeship.name === clickedVoivodeship).pop().voivodeship.location;
}

export default function Map(props) {
  const { t } = useTranslation();
  const [activeVoivodeship, setActiveVoivodeship] = useState(null);
  const { width } = useWindowDimensions();
  const [, theme] = useStyletron();

  const { voivodeships, cases, deaths, cures, isLoading, clickedVoivodeship } = useData();

  if (isLoading) {
    return (
      <Centered>
        <Spinner />
        <Paragraph2>{t('loadingData')}</Paragraph2>
      </Centered>
    );
  }

  const groupedCases = groupBy(cases, 'voivodeship');
  const groupedDeaths = groupBy(deaths, 'voivodeship');
  const groupedCures = groupBy(cures, 'voivodeship');

  let data = [];

  if (!data.length) {
    for (const voivodeship of voivodeships) {
      data.push({
        voivodeship,
        cases: {
          total: sum(groupedCases[voivodeship.name]),
          data: groupedCases[voivodeship.name] || [],
        },
        deaths: {
          total: sum(groupedDeaths[voivodeship.name]),
          data: groupedDeaths[voivodeship.name] || [],
        },
        cures: {
          total: sum(groupedCures[voivodeship.name]),
          data: groupedCures[voivodeship.name] || [],
        },
      });
    }
  }

  const max = Math.max(...data.map(({ cases }) => cases.total));
  const position = clickedVoivodeship ? getLocationForVoivodeship(clickedVoivodeship, data) : [51.98488, 19.368896];

  return (
    <LeafletMap
      center={position}
      zoom={clickedVoivodeship ? 9 : width < theme.breakpoints.medium ? 6 : 7}
      zoomControl={false}
      maxZoom={10}
      minZoom={4}
      maxBounds={[
        [42.509902, 4.150977],
        [60.079457, 33.587441],
      ]}
      {...props}
    >
      <TileLayer
        url='https://osm.korona.ws/tile/{z}/{x}/{y}.png'
        attribution='&copy; Autorzy <a href="http://osm.org/copyright">OpenStreetMap</a>'
      />
      <MarkerClusterGroup
        showCoverageOnHover={false}
        iconCreateFunction={(cluster) => {
          const count = cluster.getAllChildMarkers().reduce(
            (total, marker) => ({
              cases: marker.options.casesCount + total.cases,
              deaths: marker.options.deathsCount + total.deaths,
            }),
            {
              cases: 0,
              deaths: 0,
            }
          );

          return createMarkerIcon(getMarkerSize(max, count.cases), count.cases, count.deaths);
        }}
      >
        {data &&
          data.map(({ voivodeship, cases, deaths, cures }) => (
            <Marker
              key={voivodeship.name}
              position={voivodeship.location}
              icon={createMarkerIcon(getMarkerSize(max, cases.total), cases.total, deaths.total)}
              onClick={() => {
                setActiveVoivodeship({ ...voivodeship, cases, deaths, cures });
              }}
              casesCount={cases.total}
              deathsCount={deaths.total}
            />
          ))}
      </MarkerClusterGroup>
      {activeVoivodeship && (
        <Popup position={activeVoivodeship.location} onClose={() => setActiveVoivodeship(null)}>
          <StyledCard
            style={($theme) => ({
              [$theme.mediaQuery.large]: {
                width: '320px',
              },
            })}
          >
            <StyledBody>
              <Label1>{activeVoivodeship.name}</Label1>

              <Block marginTop='10px'>
                <Figure
                  data={activeVoivodeship.deaths.data}
                  label={t('deaths')}
                  color={theme.colors.primary}
                  size='compact'
                />

                <Figure
                  data={activeVoivodeship.cases.data}
                  label={t('confirmedCases')}
                  color={theme.colors.negative}
                  size='compact'
                />

                <Figure
                  data={activeVoivodeship.cures.data}
                  label={t('cured')}
                  color={theme.colors.positive}
                  size='compact'
                />
              </Block>
            </StyledBody>
          </StyledCard>
        </Popup>
      )}
    </LeafletMap>
  );
}
