import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Map, Figures, DataElement, Contributors } from '..';

import { Layer } from 'baseui/layer';
import { Button, KIND, SIZE } from 'baseui/button';
import { Block } from 'baseui/block';
import { Modal, ModalHeader, ModalBody, ROLE } from 'baseui/modal';
import { Paragraph3, Label2 } from 'baseui/typography';

import { switchLanguage } from '../../helpers/switchLanguage';

import { useTheme } from '../../contexts/ThemeContext';
import { StyledLink } from 'baseui/link';
import DailyGrowth from '../DailyGrowth/DailyGrowth';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { useDarkTheme, setUseDarkTheme } = useTheme();

  return (
    <>
      <Layer>
        <Map className={useDarkTheme ? 'dark-theme' : ''} />
      </Layer>
      <Layer>
        <Block position={'fixed'} bottom={0} left={0} width={['100%', '100%', 'auto']} margin={['0', '0', '20px']}>
          <Block
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  [$theme.mediaQuery.medium]: {
                    width: '288px',
                  },
                  [$theme.mediaQuery.large]: {
                    width: '320px',
                  },
                }),
              },
            }}
          >
            <DailyGrowth />
          </Block>
        </Block>
      </Layer>
      <Layer>
        <Block position={'fixed'} top={0} left={0} width={['100%', '100%', 'auto']} margin={['0', '0', '20px']}>
          <Figures />
        </Block>
      </Layer>
      <Layer>
        <Block
          display={['none', 'none', 'none', 'block']}
          position={'fixed'}
          top={'20px'}
          right={'20px'}
          $style={({ $theme }) => ({
            [$theme.mediaQuery.medium]: {
              maxHeight: 'calc(100vh - 100px)',
            },
            textAlign: 'right',
          })}
        >
          <DataElement />
          <Button
            $as='a'
            target='_blank'
            href='https://www.gov.pl/web/koronawirus'
            kind={KIND.secondary}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  borderRadius: $theme.borders.radius200,
                  boxShadow: $theme.lighting.shadow500,
                  marginTop: '20px',
                }),
              },
            }}
          >
            {t('moreInfo')}
          </Button>
        </Block>
      </Layer>
      <Layer>
        <Block position={'fixed'} bottom={'20px'} right={'20px'} display='flex'>
          <div className='fb-share-button' data-href='https://korona.ws' data-layout='button' data-size='large'>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fkorona.ws%2F&amp;src=sdkpreparse'
              className='fb-xfbml-parse-ignore'
            >
              {t('share')}
            </a>
          </div>
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
