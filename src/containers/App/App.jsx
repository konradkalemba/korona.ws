import React, { useState } from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider, lightThemePrimitives, createTheme } from 'baseui';
import { Map, Figures, CitiesChart } from '../../components';

import { Layer } from 'baseui/layer';
import { Button, KIND, SIZE } from 'baseui/button';
import { Block } from 'baseui/block';
import { Modal, ModalHeader, ModalBody, ROLE } from 'baseui/modal';
import { Paragraph3 } from 'baseui/typography';

import { DataProvider } from './../../contexts/DataContext';
import { StyledLink } from 'baseui/link';

const engine = new Styletron();

const primitives = {
  ...lightThemePrimitives,
  primaryFontFamily: 'Rubik',
};

const overrides = {

};

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={createTheme(primitives, overrides)}>
        <DataProvider>
          <Layer>
            <Map />
          </Layer>
          <Layer>
            <Block position={'fixed'} top={0} left={0} width={['100%', '100%', 'auto']} margin={['0', '0', '40px']}>
              <Figures />
            </Block>
          </Layer>
          <Layer>
            <Block position={'fixed'} bottom={0} left={0} display={['none', 'none', 'block']} margin={'40px'}>
              {/* <CitiesChart /> */}
            </Block>
          </Layer>
          <Layer>
            <Block display={['none', 'none', 'block']} position={'fixed'} top={'40px'} right={'40px'}>
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
            <Block position={'fixed'} bottom={'40px'} right={'40px'} display="flex">
              <div className="fb-share-button" data-href="https://korona.ws" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fkorona.ws%2F&amp;src=sdkpreparse" className="fb-xfbml-parse-ignore">Udostępnij</a></div>
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
                      Autor: Konrad Kalemba<br/>
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
                  </ModalBody>
                </Modal>
            </Block>
          </Layer>
        </DataProvider>
      </BaseProvider>
    </StyletronProvider>
  );
}