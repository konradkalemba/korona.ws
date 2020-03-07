import React, { useState } from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider, lightThemePrimitives, createTheme, styled } from 'baseui';
import { Map, StyledCard } from '../../components';

import { Layer } from 'baseui/layer';
import { Button, KIND } from 'baseui/button';
import { Block } from 'baseui/block';
import {
  Card,
  StyledBody,
  StyledAction,
  StyledThumbnail,
} from 'baseui/card';
import {
  Display2
} from 'baseui/typography';

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
        </DataProvider>
      </BaseProvider>
    </StyletronProvider>
  );
}