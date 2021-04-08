import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import {
  BaseProvider,
  darkThemePrimitives,
  createTheme,
  DarkTheme,
  lightThemePrimitives,
} from 'baseui';
import { ThemeContext, ThemeProvider } from './../../contexts/ThemeContext';
import { DataProvider } from './../../contexts/DataContext';
import {
  ConnectionProvider,
  ConnectionContext,
} from '../../contexts/ConnectionContext';

import { Notification } from 'baseui/notification';
import { Block } from 'baseui/block';
import { Layer } from 'baseui/layer';
import { StyledLink } from 'baseui/link';

import { Contributors, Layout } from '../../components';
import useWindowDimensions from '../../hooks/window-dimensions';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal';
import { ParagraphMedium } from 'baseui/typography';

const engine = new Styletron();

const { typography, ...rest } = DarkTheme;

const lightTheme = createTheme(
  { ...lightThemePrimitives, primaryFontFamily: 'Rubik' },
  {}
);
const darkTheme = createTheme(
  { ...darkThemePrimitives, primaryFontFamily: 'Rubik' },
  { ...rest }
);

export default function App() {
  const { t } = useTranslation();
  const [isEolModalOpen, setIsEolModalOpen] = useState(true);
  const { width } = useWindowDimensions();

  return (
    <ConnectionProvider>
      <ConnectionContext.Consumer>
        {({ isOnline }) => (
          <DataProvider>
            <StyletronProvider value={engine}>
              <ThemeProvider>
                <ThemeContext.Consumer>
                  {({ useDarkTheme }) => (
                    <BaseProvider
                      theme={useDarkTheme ? darkTheme : lightTheme}
                      overrides={{
                        AppContainer: {
                          props: {
                            'data-theme': useDarkTheme ? 'dark' : 'light',
                          },
                          style: {
                            height: '100%',
                            ...(width >= 600 && { display: 'none' }),
                          },
                        },
                        LayersContainer: {
                          props: {
                            'data-theme': useDarkTheme ? 'dark' : 'light',
                          },
                        },
                      }}
                    >
                      <Layout />

                      {!localStorage.getItem('notificationDismissed') && (
                        <Layer>
                          <Block
                            position={'fixed'}
                            top='0'
                            padding='0'
                            width='100%'
                          >
                            <Notification
                              overrides={{
                                Body: {
                                  style: {
                                    marginTop: 0,
                                    width: '100%',
                                    boxSizing: 'border-box',
                                  },
                                },
                              }}
                              closeable
                              onClose={() =>
                                localStorage.setItem(
                                  'notificationDismissed',
                                  true
                                )
                              }
                            >
                              {t('notification')}
                            </Notification>
                          </Block>
                        </Layer>
                      )}

                      {!isOnline && (
                        <Layer>
                          <Block
                            position={'fixed'}
                            top='0'
                            padding='0'
                            width='100%'
                          >
                            <Notification
                              kind={'negative'}
                              overrides={{
                                Body: {
                                  style: {
                                    marginTop: 0,
                                    width: '100%',
                                    boxSizing: 'border-box',
                                  },
                                },
                              }}
                              closeable
                            >
                              {t('offline')}{' '}
                              <StyledLink href=''>
                                {t('offlineRetry')}
                              </StyledLink>
                            </Notification>
                          </Block>
                        </Layer>
                      )}

                      <Layer>
                        <Modal
                          isOpen={isEolModalOpen}
                          closeable
                          onClose={() => setIsEolModalOpen(false)}
                        >
                          <ModalHeader>End-of-life</ModalHeader>
                          <ModalBody>
                            <ParagraphMedium $style={{ textAlign: 'justify' }}>
                              Projekt zakonczył swą działalność i nie jest już
                              rozwijany. Dane prezentowane na mapie są
                              nieaktualne i nieaktualizowane. Do śledzenia
                              obecnej sytuacji dot. koronawirusa w Polsce
                              polecam oficjalną stronę Ministerstwa Zdrowia
                              dostępną{' '}
                              <StyledLink
                                target='_blank'
                                rel='nofollow'
                                href='https://www.gov.pl/web/koronawirus/wykaz-zarazen-koronawirusem-sars-cov-2'
                              >
                                tutaj
                              </StyledLink>
                              .
                              <br />
                              <br />
                              Dziękuję wszystkim kontrybutorom!
                            </ParagraphMedium>

                            <Contributors />
                          </ModalBody>
                          <ModalFooter></ModalFooter>
                        </Modal>
                      </Layer>
                    </BaseProvider>
                  )}
                </ThemeContext.Consumer>
              </ThemeProvider>
            </StyletronProvider>
          </DataProvider>
        )}
      </ConnectionContext.Consumer>
    </ConnectionProvider>
  );
}
