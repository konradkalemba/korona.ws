import React from 'react';
import { Display2 } from 'baseui/typography';
import { StyledBody } from 'baseui/card';
import { StyledCard } from './..';
import ContentLoader from 'react-content-loader';

import { useData } from '../../contexts/DataContext';

function CountLoader() {
  return (
    <ContentLoader 
      speed={0.6}
      width={50}
      height={64}
      display={'block'}
      viewBox="0 0 50 64"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="5" rx="2" ry="2" width="40" height="54" />
    </ContentLoader>
  );
}

export default function DetailsElement() {
  const { cases, deaths, isLoading } = useData();

  return (
    <StyledCard
      title="Koronawirus w Polsce"
      width={'100%'}
    >
      <StyledBody>
        {isLoading && <CountLoader />}
        {deaths && !isLoading && <Display2 color={'primary'}>{deaths.reduce((total, {count}) => count + total, 0)}</Display2>}

        Zgony
        {isLoading && <CountLoader />}
        {cases && !isLoading && <Display2 color={'negative'}>{cases.reduce((total, {count}) => count + total, 0)}</Display2>}

        Potwierdzonych przypadków
      </StyledBody>
    </StyledCard>
  );
}