import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Display2, Display4, Paragraph2, Paragraph3 } from 'baseui/typography';
import { StyledBody } from 'baseui/card';
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
  const [, theme] = useStyletron();

  return (
    <ContentLoader
      speed={0.6}
      width={80}
      height={44}
      display={'block'}
      viewBox='0 0 80 44'
      backgroundColor={theme.colors.backgroundTertiary}
      foregroundColor={theme.colors.backgroundSecondary}
    >
      <rect x='0' y='5' rx='2' ry='2' width='70' height='36' />
    </ContentLoader>
  );
}

export function Figure({ data, isLoading, label, color, size = 'standard' }) {
  const { t } = useTranslation();
  const total = (data && sum(data)) || 0;
  const todayGrowth =
    (data &&
      sum(data.filter(({ date }) => date === moment().format('YYYY-MM-DD')))) ||
    0;

  return (
    <div>
      {isLoading && <CountLoader />}
      {!isLoading && (
        <Block display='flex'>
          {size === 'standard' ? (
            <Display2 color={color}>{total.toLocaleString()}</Display2>
          ) : (
            <Display4 color={color}>{total.toLocaleString()}</Display4>
          )}
          {todayGrowth > 0 && (
            <StatefulTooltip
              content={() => (
                <Paragraph3 color='backgroundPrimary'>
                  {t('todaysChange')}
                </Paragraph3>
              )}
              overrides={{
                Body: {
                  style: {
                    backgroundColor: 'transparent',
                  },
                },
                Inner: {
                  style: ({ $theme }) => ({
                    borderRadius: $theme.borders.radius200,
                    boxShadow: $theme.lighting.shadow500,
                  }),
                },
              }}
              placement={PLACEMENT.top}
              returnFocus
              autoFocus
              showArrow
            >
              <span
                style={{
                  display: 'flex',
                  fontWeight: 400,
                  fontSize: size === 'standard' ? '24px' : '16px',
                  color: '#7b7b7b',
                  lineHeight: size === 'standard' ? '32px' : '24px',
                }}
              >
                <ArrowUp size={size === 'standard' ? 32 : 24} />
                {todayGrowth}
              </span>
            </StatefulTooltip>
          )}
        </Block>
      )}
      {size === 'standard' ? (
        <Paragraph2 marginTop={0}>{label}</Paragraph2>
      ) : (
        <Paragraph3 marginTop={0}>{label}</Paragraph3>
      )}
    </div>
  );
}

export default function Figures() {
  const { t } = useTranslation();
  const {
    cases,
    deaths,
    cures,
    hospitalizations,
    quarantines,
    supervisions,
    tests,
    isLoading,
  } = useData();
  const [showMore, setShowMore] = useState(false);
  const [, theme] = useStyletron();

  return (
    <StyledCard
      title={t('coronavirusInPoland')}
      style={($theme) => ({
        [$theme.mediaQuery.medium]: {
          maxHeight: 'calc(100vh - 80px)',
          overflow: 'auto',
        },
        [$theme.mediaQuery.large]: {
          width: '320px',
        },
      })}
    >
      <StyledBody>
        <Figure
          data={deaths}
          isLoading={isLoading}
          label={t('deaths')}
          color={theme.colors.primary}
          size={'compact'}
        />
        <Figure
          data={cases}
          isLoading={isLoading}
          label={t('confirmedCases')}
          color={theme.colors.negative}
          size={'compact'}
        />
        <Figure
          data={cures}
          isLoading={isLoading}
          label={t('cured')}
          color={theme.colors.positive}
          size={'compact'}
        />

        <Block
          $style={{
            marginBottom: '12px',
            textAlign: 'center',
          }}
        >
          <Button
            onClick={() => setShowMore(!showMore)}
            kind={KIND.secondary}
            size={SIZE.mini}
            startEnhancer={() =>
              !showMore ? <ChevronDown size={16} /> : <ChevronUp size={16} />
            }
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  borderRadius: $theme.borders.radius200,
                }),
              },
            }}
          >
            {!showMore ? t('showMore') : t('hide')}
          </Button>
        </Block>

        {showMore && (
          <>
            <Figure
              data={hospitalizations}
              isLoading={isLoading}
              label={t('hospitalized')}
              color={theme.colors.accent}
              size='compact'
            />
            <Figure
              data={quarantines}
              isLoading={isLoading}
              label={t('quarantined')}
              color={theme.colors.accent}
              size='compact'
            />
            <Figure
              data={supervisions}
              isLoading={isLoading}
              label={t('underSurveillance')}
              color={theme.colors.accent}
              size='compact'
            />
            <Figure
              data={tests}
              isLoading={isLoading}
              label={t('tests')}
              color={theme.colors.accent}
              size='compact'
            />
          </>
        )}
      </StyledBody>
    </StyledCard>
  );
}
