import React, { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Map as LeafletMap, Marker, Popup, TileLayer } from 'react-leaflet';
import { Block } from "baseui/block";
import { divIcon } from 'leaflet';
import { useStyletron, styled } from 'baseui';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Spinner } from 'baseui/spinner';
import { Paragraph2 } from 'baseui/typography';
import { ReactComponent as MapPin } from './../../assets/svg/pin.svg';

import { useData } from '../../contexts/DataContext';

const Centered = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  height: '98vh',
});

export default function Map() {
  const position = [51.984880, 19.368896];
  const [activeCase, setActiveCase] = useState(null);
  
  const [, theme] = useStyletron();

  const { cases, isLoading } = useData();

  const customIconMarker = divIcon({
    iconSize: [32, 32],
    html: renderToStaticMarkup(
      <MapPin fill={theme.colors.negative} width={'32px'} height={'32px'} />
    )
  });

  if (isLoading) { 
    return (
      <Centered>
        <Spinner />
        <Paragraph2>Ładowanie danych</Paragraph2>
      </Centered>
    )
  }

  return (
    <LeafletMap center={position} zoom={7} zoomControl={false} maxZoom={11}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      <MarkerClusterGroup>
        {cases && cases.map((_case, index) => (
          <Marker
            key={index}
            position={[
              _case.geometry.coordinates[0],
              _case.geometry.coordinates[1],
            ]}
            icon={customIconMarker}
            onClick={() => setActiveCase(_case)}
          />
        ))}
      </MarkerClusterGroup>
      {activeCase && <Popup
        position={[
          activeCase.geometry.coordinates[0],
          activeCase.geometry.coordinates[1]
        ]}
        onClose={() => setActiveCase(null)}
      >
        <Block padding={"20px"} backgroundColor={'backgroundPrimary'}>
          {activeCase.properties.date}
        </Block>
      </Popup>}
    </LeafletMap>
  );
}