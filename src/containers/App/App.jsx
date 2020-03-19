import React from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider, darkThemePrimitives, createTheme, DarkTheme, lightThemePrimitives } from 'baseui';
import { ThemeContext, ThemeProvider } from './../../contexts/ThemeContext';
import { DataProvider } from './../../contexts/DataContext';

import { Notification } from 'baseui/notification';
import { Block } from 'baseui/block';
import { Layer } from 'baseui/layer';
import { Layout } from '../../components';

const engine = new Styletron();

const { typography, ...rest } = DarkTheme;

const lightTheme = createTheme({ ...lightThemePrimitives, primaryFontFamily: 'Rubik' }, {});
const darkTheme = createTheme({ ...darkThemePrimitives, primaryFontFamily: 'Rubik' }, { ...rest });

export default function App() {
  return (
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
                      'data-theme': useDarkTheme ? 'dark' : 'light'
                    }
                  },
                  LayersContainer: {
                    props: {
                      'data-theme': useDarkTheme ? 'dark' : 'light'
                    }
                  }
                }}
              >
                <Layout />

                {!localStorage.getItem('notificationDismissed') && (
                  <Layer>
                    <Block
                      position={'fixed'}
                      top="0"
                      padding="0"
                      width="100%"
                    >

                      <Notification
                        overrides={{
                          Body: {
                            style: {
                              marginTop: 0,
                              width: '100%',
                              boxSizing: 'border-box'
                            }
                          }
                        }}
                        closeable
                        onClose={() => localStorage.setItem('notificationDismissed', true)}
                      >
                        Ze względu na brak precyzyjnych informacji o lokalizacji poszczególnych przypadków w najnowszych komunikatach Ministerstwa Zdrowia, zmuszeni jesteśmy ograniczyć się do wyświetlania danych z podziałem na województwa.
                      </Notification>
                    </Block>
                  </Layer>
                )}
              </BaseProvider>
            )}
          </ThemeContext.Consumer>
        </ThemeProvider>
      </StyletronProvider>
    </DataProvider>
  );
}