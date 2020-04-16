import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Map,
  Figures,
  DailyGrowth,
  Source,
  VoivodeshipsSplit,
  Contributors,
} from '..';

import { useStyletron } from 'baseui';
import { Layer } from 'baseui/layer';
import { Button, KIND, SIZE } from 'baseui/button';
import { Block } from 'baseui/block';
import { Modal, ModalHeader, ModalBody, ROLE } from 'baseui/modal';
import { Paragraph3, Label2 } from 'baseui/typography';
import { StyledFlag } from 'baseui/phone-input';

import { switchLanguage } from '../../helpers/switchLanguage';

import { useTheme } from '../../contexts/ThemeContext';
import { StyledLink } from 'baseui/link';

export default function Desktop() {
  const { t, i18n } = useTranslation();
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const { useDarkTheme, setUseDarkTheme } = useTheme();
  const [css] = useStyletron();

  return (
    <>
      <Layer>
        <Map className={useDarkTheme ? 'dark-theme' : ''} />
      </Layer>
      <Layer>
        <Block
          position={'fixed'}
          bottom={0}
          left={0}
          width={['100%', '100%', 'auto']}
          margin={['0', '0', '20px']}
        >
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
        <Block
          position={'fixed'}
          top={0}
          left={0}
          width={['100%', '100%', 'auto']}
          margin={['0', '0', '20px']}
        >
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
          <VoivodeshipsSplit />
          <Button
            $as='a'
            target='_blank'
            href={
              i18n.language === 'pl'
                ? 'https://www.gov.pl/web/koronawirus'
                : 'https://www.gov.pl/web/coronavirus'
            }
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
          <div
            className={css({
              display: 'block',
              textAlign: 'right',
              marginTop: '20px',
            })}
          >
            <img
              className={css({
                height: '36px',
              })}
              src={`${process.env.PUBLIC_URL}/images/zeit.svg`}
              alt='Sponsored by Zeit'
            />
          </div>
        </Block>
      </Layer>
      <Layer>
        <Block position={'fixed'} bottom={'20px'} right={'20px'} display='flex'>
          <div
            className='fb-share-button'
            data-href='https://korona.ws'
            data-layout='button'
            data-size='large'
          >
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
            onClick={() => setIsInfoModalOpen(true)}
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
            onClick={() => setIsSourceModalOpen(true)}
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
            {t('source')}
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
            <StyledFlag
              iso={i18n.language === 'pl' ? 'gb' : 'pl'}
              $size='mini'
              className={css({ marginRight: '8px', marginTop: '0px' })}
            />

            {t('switchLang')}
          </Button>
          <Modal
            onClose={() => setIsInfoModalOpen(false)}
            closeable
            isOpen={isInfoModalOpen}
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
              <StyledLink
                target='_blank'
                href='https://github.com/konradkalemba/korona.ws'
              >
                https://github.com/konradkalemba/korona.ws
              </StyledLink>
              <Paragraph3>{t('donation')}</Paragraph3>
              <StyledLink
                target='_blank'
                href='https://www.paypal.me/konradkalemba'
              >
                https://www.paypal.me/konradkalemba
              </StyledLink>

              <Label2 margin='20px 0 10px'>{t('contributors')}</Label2>
              <Contributors />
            </ModalBody>
          </Modal>
          <Modal
            onClose={() => setIsSourceModalOpen(false)}
            closeable
            isOpen={isSourceModalOpen}
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
            <ModalHeader>{t('source')}</ModalHeader>
            <ModalBody>
              <Paragraph3>{t('sourceInfo')}</Paragraph3>
              <Source />
            </ModalBody>
          </Modal>
        </Block>
      </Layer>
    </>
  );
}
