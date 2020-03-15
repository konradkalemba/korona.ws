import React from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider, darkThemePrimitives, createTheme, DarkTheme, lightThemePrimitives } from 'baseui';
import { ThemeContext, ThemeProvider } from './../../contexts/ThemeContext';
import { DataProvider } from './../../contexts/DataContext';

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
              </BaseProvider>
            )}
          </ThemeContext.Consumer>
        </ThemeProvider>
      </StyletronProvider>
    </DataProvider>
  );
}