import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Map, DataElement, Contributors } from '../../components';

import { useStyletron } from 'baseui';
import { Layer } from 'baseui/layer';
import { Button, SIZE, KIND } from 'baseui/button';
import { Block } from 'baseui/block';
import { Modal, ModalHeader, ModalBody, ROLE } from 'baseui/modal';
import { Paragraph3, Label2, HeadingSmall } from 'baseui/typography';

import { switchLanguage } from '../../helpers/switchLanguage';

import { useTheme } from '../../contexts/ThemeContext';
import { StyledLink } from 'baseui/link';
import { Tabs, Tab } from 'baseui/tabs';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Figure } from '../Figures/Figures';
import { useData } from '../../contexts/DataContext';
import DailyGrowth from '../DailyGrowth/DailyGrowth';

function CustomTab(props) {
  return (
    <Tab
      overrides={{
        Tab: {
          style: {
            flexGrow: 1,
            textAlign: 'center',
            padding: '10px 0',
          },
        },
      }}
      {...props}
    />
  );
}

const FlexGridItemCenterd = ({ children }) => {
  const [css] = useStyletron();

  return (
    <div
      className={css({
        display: 'flex',
        width: '100%',
        padding: '10px',
        justifyContent: 'center'
      })}
    >
      {children}
    </div>
  );
};

export default function Mobile() {
  const { cases, cures, deaths, hospitalizations, quarantines, supervisions, tests, isLoading } = useData();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { useDarkTheme, setUseDarkTheme } = useTheme();
  const [activeKey, setActiveKey] = useState('0');
  const [css, theme] = useStyletron();

  return (
    <>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100vw',
        })}
      >
        <div
          className={css({
            backgroundColor: theme.colors.backgroundPrimary,
            padding: theme.sizing.scale600,
            paddingBottom: 0,
          })}
        >
          <HeadingSmall margin={0}>{t('coronavirusInPoland')}</HeadingSmall>
          <div
            className={css({
              display: 'flex',
              justifyContent: 'space-arount'
            })}
          >
            <FlexGridItemCenterd>
              <Figure
                data={deaths}
                isLoading={isLoading}
                label={t('deaths')}
                color={theme.colors.primary}
                size='compact'
              />
            </FlexGridItemCenterd>
            <FlexGridItemCenterd>
              <Figure
                data={cases}
                isLoading={isLoading}
                label={t('confirmedCasesShort')}
                color={theme.colors.negative}
                size='compact'
              />
            </FlexGridItemCenterd>
            <FlexGridItemCenterd>
              <Figure
                data={cures}
                isLoading={isLoading}
                label={t('cured')}
                color={theme.colors.positive}
                size='compact'
              />
            </FlexGridItemCenterd>
          </div>
        </div>

        <Tabs
          onChange={({ activeKey }) => {
            setActiveKey(activeKey);
          }}
          activeKey={activeKey}
          overrides={{
            Root: {
              style: {
                flexGrow: 1,
                display: 'flex',
              },
            },
            TabBar: {
              style: {
                display: 'flex',
              },
            },
            TabContent: {
              style: ({ $active }) => {
                return {
                  backgroundColor: theme.colors.backgroundPrimary,
                  padding: 0,
                  flexGrow: 1,
                  display: $active ? 'flex' : 'none',
                  width: '100vw',
                };
              },
            },
          }}
        >
          <CustomTab title={t('map')}>
            <Map className={useDarkTheme ? 'dark-theme' : ''} style={{ height: 'auto' }} />
          </CustomTab>
          <CustomTab title={t('statistics')}>
            <div
              className={css({
                padding: theme.sizing.scale600,
                height: 'auto',
              })}
            >
              <FlexGrid flexGridColumnCount={2}>
                <FlexGridItem>
                  <Figure
                    data={hospitalizations}
                    isLoading={isLoading}
                    label={t('hospitalized')}
                    color={theme.colors.accent}
                    size='compact'
                  />
                </FlexGridItem>
                <FlexGridItem>
                  <Figure
                    data={quarantines}
                    isLoading={isLoading}
                    label={t('quarantined')}
                    color={theme.colors.accent}
                    size='compact'
                  />
                </FlexGridItem>
                <FlexGridItem>
                  <Figure
                    data={supervisions}
                    isLoading={isLoading}
                    label={t('underSurveillance')}
                    color={theme.colors.accent}
                    size='compact'
                  />
                </FlexGridItem>
                <FlexGridItem>
                  <Figure
                    data={tests}
                    isLoading={isLoading}
                    label={t('tests')}
                    color={theme.colors.accent}
                    size='compact'
                  />
                </FlexGridItem>
              </FlexGrid>
              <DailyGrowth />
              <br />
              <DataElement />
            </div>
          </CustomTab>
        </Tabs>
      </div>
      <Layer>
        <Block position={'fixed'} bottom={'16px'} left={'0px'} display='flex'>
          <Button
            size={SIZE.mini}
            onClick={() => setIsOpen(true)}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  borderRadius: $theme.borders.radius200,
                  boxShadow: $theme.lighting.shadow500,
                  marginLeft: '10px',
                }),
              },
            }}
          >
            {t('information')}
          </Button>
          <Button
            size={SIZE.mini}
            onClick={() => setUseDarkTheme(!useDarkTheme)}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  borderRadius: $theme.borders.radius200,
                  boxShadow: $theme.lighting.shadow500,
                  marginLeft: '10px',
                }),
              },
            }}
          >
            {useDarkTheme ? t('turnOff') : t('turnOn')} {t('darkMode')}
          </Button>
          <Button
            size={SIZE.mini}
            kind={KIND.secondary}
            onClick={() => switchLanguage({ i18n })}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  borderRadius: $theme.borders.radius200,
                  boxShadow: $theme.lighting.shadow500,
                  marginLeft: '10px',
                }),
              },
            }}
          >
            {t('switchLang')}
          </Button>
          <Modal
            onClose={() => setIsOpen(false)}
            closeable
            isOpen={isOpen}
            animate
            role={ROLE.dialog}
            overrides={{
              Dialog: {
                style: ({ $theme }) => ({
                  borderRadius: $theme.borders.radius200,
                }),
              },
            }}
          >
            <ModalHeader>{t('information')}</ModalHeader>
            <ModalBody>
              <Paragraph3>{t('relevanceInfo')}</Paragraph3>
              <Paragraph3>
                {t('author')}
                <br />
                {t('contact')}:{' '}
                <StyledLink target='_blank' href='mailto:admin@korona.ws'>
                  admin@korona.ws
                </StyledLink>
              </Paragraph3>
              <Paragraph3>{t('openSourceApp')}</Paragraph3>
              <StyledLink target='_blank' href='https://github.com/konradkalemba/korona.ws'>
                https://github.com/konradkalemba/korona.ws
              </StyledLink>

              <Label2 margin='20px 0 10px'>{t('contributors')}</Label2>
              <Contributors />
            </ModalBody>
          </Modal>
        </Block>
      </Layer>
    </>
  );
}
