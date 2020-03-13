import React, { useState } from 'react';
import { Display2, Display4, Paragraph2, Paragraph3 } from 'baseui/typography';
import { StyledBody, Card } from 'baseui/card';
import { Button, KIND, SIZE } from 'baseui/button';
import ChevronDown from 'baseui/icon/chevron-down';
import ChevronUp from 'baseui/icon/chevron-up';
import ArrowUp from 'baseui/icon/arrow-up';
import { StatefulTooltip, PLACEMENT } from 'baseui/tooltip';
import { Block } from 'baseui/block';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { useStyletron } from 'baseui';

import { StyledCard } from '..';
import ContentLoader from 'react-content-loader';

import { useData } from '../../contexts/DataContext';
import moment from 'moment';
import { sum } from '../../helpers/misc';
import useWindowDimensions from '../../hooks/window-dimensions';

function CountLoader() {
  const [, theme] = useStyletron();

  return (
    <ContentLoader
      speed={0.6}
      width={50}
      height={64}
      display={'block'}
      viewBox="0 0 50 64"
      backgroundColor={theme.colors.backgroundTertiary}
      foregroundColor={theme.colors.backgroundSecondary}
    >
      <rect x="0" y="5" rx="2" ry="2" width="40" height="54" />
    </ContentLoader>
  );
}

export function Figure({ data, label, color, size = 'standard' }) {
  const total = data && sum(data);
  const todayGrowth = data && sum(data.filter(({ date }) => date === moment().format('YYYY-MM-DD')));

  return (
    <div>
      {!data &&
        <CountLoader />
      }
      {data &&
        <Block display="flex">
          {size === 'standard'
            ? <Display2 color={color}>{total.toLocaleString()}</Display2>
            : <Display4 color={color}>{total.toLocaleString()}</Display4>
          }
          {todayGrowth > 0 &&
            <StatefulTooltip
              content={() => (
                <Paragraph3 color="backgroundPrimary">Dzisiejsza zmiana</Paragraph3>
              )}
              overrides={{
                Body: {
                  style: {
                    backgroundColor: 'transparent'
                  }
                },
                Inner: {
                  style: ({ $theme }) => ({
                    borderRadius: $theme.borders.radius200,
                    boxShadow: $theme.lighting.shadow500
                  })
                }
              }}
              placement={PLACEMENT.top}
              returnFocus
              autoFocus
              showArrow
            >
              <span style={{
                display: 'flex',
                fontWeight: 400,
                fontSize: size === 'standard' ? '24px' : '16px',
                color: '#7b7b7b',
                lineHeight: size === 'standard' ? '32px' : '24px'
              }}><ArrowUp size={size === 'standard' ? 32 : 24} />{todayGrowth}</span>
            </StatefulTooltip>
          }
        </Block>
      }
      {size === 'standard'
        ? <Paragraph2 marginTop={0}>{label}</Paragraph2>
        : <Paragraph3 marginTop={0}>{label}</Paragraph3>
      }
    </div>
  );
}

export default function Figures() {
  const { cases, deaths, hospitalizations, quarantines, supervisions, tests } = useData();
  const [showMore, setShowMore] = useState(false);
  const [, theme] = useStyletron();
  const { width } = useWindowDimensions()

  return (
    <StyledCard
      title="Koronawirus w Polsce"
      width="380px"
    >
      <StyledBody>
        <Figure
          data={deaths}
          label="Zgony"
          color={theme.colors.primary}
          size={width < theme.breakpoints.medium ? 'compact' : 'standard'}
        />
        <Figure
          data={cases}
          label="Potwierdzone przypadki"
          color={theme.colors.negative}
          size={width < theme.breakpoints.medium ? 'compact' : 'standard'}
        />

        <Block
          $style={{
            marginBottom: '12px',
            textAlign: 'center'
          }}
        >
          <Button
            onClick={() => setShowMore(!showMore)}
            kind={KIND.secondary}
            size={SIZE.mini}
            startEnhancer={() => !showMore ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  borderRadius: $theme.borders.radius200
                })
              }
            }}
          >
            {!showMore ? 'Pokaż więcej' : 'Ukryj'}
          </Button>
        </Block>

        {showMore &&
          <>
            <Figure
              data={hospitalizations}
              label="Hospitalizowani"
              color={theme.colors.accent}
              size="compact"
            />
            <Figure
              data={quarantines}
              label="Poddani kwarantannie"
              color={theme.colors.accent}
              size="compact"
            />
            <Figure
              data={supervisions}
              label="Objęci nadzorem epidemiologicznym"
              color={theme.colors.accent}
              size="compact"
            />
            <Figure
              data={tests}
              label="Testy"
              color={theme.colors.accent}
              size="compact"
            />
          </>
        }
      </StyledBody>
    </StyledCard>
  );
}