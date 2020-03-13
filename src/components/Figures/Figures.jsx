import React, { useState } from 'react';
import { Display2, Display4, Paragraph2, Paragraph3 } from 'baseui/typography';
import { Button, KIND, SIZE } from 'baseui/button';
import ChevronDown from 'baseui/icon/chevron-down';
import ChevronUp from 'baseui/icon/chevron-up';
import ArrowUp from 'baseui/icon/arrow-up';
import { StatefulTooltip, PLACEMENT } from 'baseui/tooltip';
import { Block } from 'baseui/block';
import { useStyletron } from 'baseui';

import { StyledCard } from '..';
import ContentLoader from 'react-content-loader';

import { useData } from '../../contexts/DataContext';
import moment from 'moment';
import { sum } from '../../helpers/misc';

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
            ? <Display2 color={color}>{total}</Display2>
            : <Display4 color={color}>{total}</Display4>
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

  return (
    <StyledCard
      title="Koronawirus w Polsce"
      width="320px"
    >
      <StyledBody>
        <Figure
          data={deaths}
          label="Zgonów"
          color={theme.colors.primary}
        />
        <Figure
          data={cases}
          label="Potwierdzonych przypadków"
          color={theme.colors.negative}
        />

        {showMore &&
          <>
            <Figure
              data={hospitalizations}
              label="Hospitalizowanych"
              color={theme.colors.negative300}
            />
            <Figure
              data={quarantines}
              label="Poddanych kwarantannie"
              color={theme.colors.negative300}
            />
            <Figure
              data={supervisions}
              label="Objętych nadzorem epidemiologicznym"
              color={theme.colors.negative300}
            />
            <Figure
              data={tests}
              label="Testów"
              color={theme.colors.accent}
            />
          </>
        }

        <Block
          $style={{
            marginTop: '12px',
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
      </StyledBody>
    </StyledCard>
  );
}