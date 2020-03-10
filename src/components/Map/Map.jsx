import React, { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Map as LeafletMap, Marker, Popup, TileLayer } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { styled } from 'baseui';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Spinner } from 'baseui/spinner';
import { Paragraph2, Paragraph4, Label2 } from 'baseui/typography';
import { StyledCard } from './..';
import { StyledBody } from 'baseui/card';
import { StyledLink } from "baseui/link";
import { Marker as MarkerIcon } from './..';
import { StyledTable, StyledBody as StyledTableBody, StyledHead, StyledHeadCell, StyledRow, StyledCell } from 'baseui/table';

import { useData } from '../../contexts/DataContext';
import groupBy from 'lodash.groupby';

const MIN_MARKER_SIZE = 32;
const MAX_MARKER_SIZE = 80;

const Centered = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  height: '98vh',
});

function createMarkerIcon(size, count) {
  return divIcon({
    iconSize: [size, size],
    html: renderToStaticMarkup(
      <MarkerIcon size={size} count={count} />
    )
  });
}

function groupByCity(cases) {
  return Object.entries(groupBy(cases, 'city'));
}

function getMarkerSize(max, count) {
  return (count / max * (MAX_MARKER_SIZE - MIN_MARKER_SIZE)) + MIN_MARKER_SIZE;
}

export default function Map() {
  const position = [51.984880, 19.368896];
  const [activeCity, setActiveCity] = useState(null);
  
  const { cases, isLoading } = useData();

  if (isLoading) { 
    return (
      <Centered>
        <Spinner />
        <Paragraph2>Ładowanie danych</Paragraph2>
      </Centered>
    )
  }

  const max = Math.max(...(groupByCity(cases).map(([, data]) => data.length)));

  return (
    <LeafletMap center={position} zoom={7} zoomControl={false} maxZoom={11} minZoom={4}>
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
        {cases && groupByCity(cases).map(([name, data], index) => (
          <Marker
            key={index}
            position={[
              data[0].location[0],
              data[0].location[1],
            ]}
            icon={createMarkerIcon(getMarkerSize(max, data.length), data.length)}
            onClick={() => setActiveCity({ name, data })}
            count={data.length}
          />
        ))}
      </MarkerClusterGroup>
      {activeCity && <Popup
        position={[
          activeCity.data[0].location[0],
          activeCity.data[0].location[1]
        ]}
        onClose={() => setActiveCity(null)}
      >
        <StyledCard>
          <StyledBody>
            <Label2>{activeCity.name}</Label2>
            <Paragraph4>
              Liczba przypadków: {activeCity.data.length}
            </Paragraph4>
            
            {activeCity.data && (
              <StyledTable>  
                <StyledTableBody>
                  {activeCity.data.map(({ reportedAt, source }, index) => (
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
          </StyledBody>
        </StyledCard>
      </Popup>}
    </LeafletMap>
  );
}