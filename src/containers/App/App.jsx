import React from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider, lightThemePrimitives, createTheme } from 'baseui';
import { Map } from '../../components';

import { Layer } from 'baseui/layer';
import { Button, KIND } from 'baseui/button';
import { Block } from 'baseui/block';

import { DataProvider } from './../../contexts/DataContext';
import DetailsElement from '../../components/DetailsElement/DetailsElement';

const engine = new Styletron();

const primitives = {
  ...lightThemePrimitives,
  primaryFontFamily: 'Rubik',
};

const overrides = {
};

export default function App() {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={createTheme(primitives, overrides)}>
        <DataProvider>
          <Layer>
            <Map />
          </Layer>
          <Layer>
            <Block position={'fixed'} top={'40px'} left={'40px'}>
              <DetailsElement />
            </Block>
          </Layer>
          <Layer>
            <Block position={'fixed'} top={'40px'} right={'40px'}>
              <Button
                $as="a"
                target="_blank"
                href="https://www.gov.pl/web/koronawirus"
                kind={KIND.secondary}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      borderRadius: $theme.borders.radius200,
                      boxShadow: $theme.lighting.shadow500
                    })
                  }
                }}
              >
                Więcej informacji nt. koronawirusa
              </Button>
            </Block>
          </Layer>
          <Layer>
            <Block position={'fixed'} bottom={'40px'} right={'40px'}>
              <div class="fb-share-button" data-href="https://korona.ws" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fkorona.ws%2F&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Udostępnij</a></div>
            </Block>
          </Layer>
        </DataProvider>
      </BaseProvider>
    </StyletronProvider>
  );
}