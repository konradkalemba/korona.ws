import React, { useState } from 'react';
import { Map, DataElement, Contributors } from '../../components';

import { useStyletron } from 'baseui';
import { Layer } from 'baseui/layer';
import { Button, SIZE } from 'baseui/button';
import { Block } from 'baseui/block';
import { Modal, ModalHeader, ModalBody, ROLE } from 'baseui/modal';
import { Paragraph3, Label2, HeadingSmall } from 'baseui/typography';

import { useTheme } from '../../contexts/ThemeContext';
import { StyledLink } from 'baseui/link';
import { Tabs, Tab } from 'baseui/tabs';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Figure } from '../Figures/Figures';
import { useData } from '../../contexts/DataContext';
import DailyGrowth from "../DailyGrowth/DailyGrowth"

function CustomTab(props) {
  return (
    <Tab
      overrides={{
        Tab: {
          style: {
            flexGrow: 1,
            textAlign: 'center',
            padding: '10px 0'
          }
        }
      }}
      {...props}
    />
  )
}

export default function Mobile() {
  const { cases, cures, deaths, hospitalizations, quarantines, supervisions, tests, isLoading } = useData();
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
          width: '100vw'
        })}
      >
        <div
          className={css({
            backgroundColor: theme.colors.backgroundPrimary,
            padding: theme.sizing.scale600,
            paddingBottom: 0
          })}
        >
          <HeadingSmall margin={0}>Koronawirus w Polsce</HeadingSmall>
          <FlexGrid flexGridColumnCount={3}>
            <FlexGridItem>
              <Figure
                data={deaths}
                isLoading={isLoading}
                label="Zgony"
                color={theme.colors.primary}
                size="compact"
              />
            </FlexGridItem>
            <FlexGridItem>
              <Figure
                data={cases}
                isLoading={isLoading}
                label="Potw. przypadki"
                color={theme.colors.negative}
                size="compact"
              />
            </FlexGridItem>
            <FlexGridItem>
              <Figure
                data={cures}
                isLoading={isLoading}
                label="Wyleczenia"
                color={theme.colors.positive}
                size="compact"
              />
            </FlexGridItem>
          </FlexGrid>
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
                display: 'flex'
              }
            },
            TabBar: {
              style: {
                display: 'flex'
              }
            },
            TabContent: {
              style: ({ $active }) => {
                return {
                  backgroundColor: theme.colors.backgroundPrimary,
                  padding: 0,
                  flexGrow: 1,
                  display: $active ? 'flex' : 'none',
                  width: '100vw'
                };
              }
            }
          }}
        >
          <CustomTab title="Mapa">
            <Map className={useDarkTheme ? 'dark-theme' : ''} style={{ height: 'auto' }} />
          </CustomTab>
          <CustomTab title="Statystyki">
            <div
              className={css({
                padding: theme.sizing.scale600,
                height: 'auto'
              })}
            >
              <FlexGrid flexGridColumnCount={2}>
                <FlexGridItem>
                  <Figure
                    data={hospitalizations}
                    isLoading={isLoading}
                    label="Hospitalizowani"
                    color={theme.colors.accent}
                    size="compact"
                  />
                </FlexGridItem>
                <FlexGridItem>
                  <Figure
                    data={quarantines}
                    isLoading={isLoading}
                    label="Poddani kwarantannie"
                    color={theme.colors.accent}
                    size="compact"
                  />
                </FlexGridItem>
                <FlexGridItem>
                  <Figure
                    data={supervisions}
                    isLoading={isLoading}
                    label="Objęci nadzorem epidemiologicznym"
                    color={theme.colors.accent}
                    size="compact"
                  />
                </FlexGridItem>
                <FlexGridItem>
                  <Figure
                    data={tests}
                    isLoading={isLoading}
                    label="Testy"
                    color={theme.colors.accent}
                    size="compact"
                  />
                </FlexGridItem>
              </FlexGrid>
              <DailyGrowth />
              <br/>
              <DataElement />
            </div>
          </CustomTab>
        </Tabs>

      </div>
      <Layer>
        <Block position={'fixed'} bottom={'16px'} left={'0px'} display="flex">
          <Button
            size={SIZE.mini}
            onClick={() => setIsOpen(true)}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  borderRadius: $theme.borders.radius200,
                  boxShadow: $theme.lighting.shadow500,
                  marginLeft: '10px'
                })
              }
            }}
          >
            Informacje
          </Button>
          <Button
            size={SIZE.mini}
            onClick={() => setUseDarkTheme(!useDarkTheme)}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  borderRadius: $theme.borders.radius200,
                  boxShadow: $theme.lighting.shadow500,
                  marginLeft: '10px'
                })
              }
            }}
          >
            {useDarkTheme ? 'Wyłącz' : 'Włącz'} tryb ciemny
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
                  borderRadius: $theme.borders.radius200
                })
              }
            }}
          >
            <ModalHeader>Informacje</ModalHeader>
            <ModalBody>
              <Paragraph3>
                Autor nie ponosi odpowiedzialności za aktualność i poprawność przedstawionych treści. Dane mogą być nieaktualne.
              </Paragraph3>
              <Paragraph3>
                Autor: Konrad Kalemba<br />
                    Kontakt: <StyledLink target="_blank" href="mailto:admin@korona.ws">
                  admin@korona.ws
              </StyledLink>
              </Paragraph3>
              <Paragraph3>
                Aplikacja jest "open-source" — każdy chętny może bezpośrednio pomóc w rozwoju projektu. Kod źródłowy znajduje się pod poniższym odnośnikiem:
              </Paragraph3>
              <StyledLink target="_blank" href="https://github.com/konradkalemba/korona.ws">
                https://github.com/konradkalemba/korona.ws
              </StyledLink>

              <Label2 margin="20px 0 10px">Współtwórcy</Label2>
              <Contributors />
            </ModalBody>
          </Modal>
        </Block>
      </Layer>
    </>
  );
}