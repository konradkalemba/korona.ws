import React, { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Map as LeafletMap, Marker, Popup, TileLayer } from 'react-leaflet';
import { Block } from "baseui/block";
import { divIcon } from 'leaflet';
import { useStyletron, styled } from 'baseui';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Spinner } from 'baseui/spinner';
import { Paragraph2, Paragraph4, Label2 } from 'baseui/typography';
import { ReactComponent as MapPin } from './../../assets/svg/pin.svg';
import { StyledCard } from './..';
import { StyledBody } from 'baseui/card';
import { StyledLink } from "baseui/link";

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
        {cases && cases.map((data, index) => (
          <Marker
            key={index}
            position={[
              data.location[0],
              data.location[1],
            ]}
            icon={customIconMarker}
            onClick={() => setActiveCase(data)}
          />
        ))}
      </MarkerClusterGroup>
      {activeCase && <Popup
        position={[
          activeCase.location[0],
          activeCase.location[1]
        ]}
        onClose={() => setActiveCase(null)}
      >
        <StyledCard>
          <StyledBody>
            <Label2>{activeCase.city}</Label2>
            <Paragraph4>
              Data zgłoszenia: {activeCase.reportedAt}
            </Paragraph4>
            <Paragraph4>
              Źródło: <StyledLink target={'_blank'} href={activeCase.source}>
                {activeCase.source}
              </StyledLink>
            </Paragraph4>
          </StyledBody>
        </StyledCard>
      </Popup>}
    </LeafletMap>
  );
}