import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStyletron } from 'baseui';
import { Search } from 'baseui/icon';
import { Input, SIZE } from 'baseui/input';
import {
  StyledBody as StyledTableBody,
  StyledCell,
  StyledHead,
  StyledHeadCell,
  StyledRow,
  StyledTable,
} from 'baseui/table';
import { Label3, Paragraph3, Paragraph4 } from 'baseui/typography';
import { StyledLink } from 'baseui/link';
import { ProgressBar } from 'baseui/progress-bar';
import { useData } from '../../contexts/DataContext';

function SearchIcon() {
  const [css, theme] = useStyletron();
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.sizing.scale500,
      })}
    >
      <Search size='18px' />
    </div>
  );
}

const compare = (originalText = '', filterValue = '') =>
  originalText.toLowerCase().includes(filterValue.toLowerCase().trim());

export default function Table({ isLoading, data }) {
  const { t } = useTranslation();
  const [, theme] = useStyletron();
  const [filter, setFilter] = useState('');
  const filteredData =
    data?.filter(
      ({ voivodeship, date }) =>
        compare(voivodeship, filter) || compare(date, filter)
    ) || [];
  const { setClickedVoivodeship } = useData();

  return (
    <>
      <Input
        size={SIZE.compact}
        overrides={{ Before: SearchIcon }}
        placeholder={t('search')}
        onChange={(event) => setFilter(event.target.value)}
        value={filter}
      />
      <StyledTable
        $style={{
          borderColor: theme.colors.backgroundTertiary,
          marginTop: '12px',
          minHeight: '100px',
        }}
      >
        {isLoading && (
          <ProgressBar
            infinite
            overrides={{
              Bar: {
                style: {
                  marginBottom: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  marginTop: 0,
                },
              },
            }}
          />
        )}

        <StyledHead role='row'>
          <StyledHeadCell role='columnheader'>
            <Paragraph3 margin={0}>{t('date')}</Paragraph3>
          </StyledHeadCell>
          <StyledHeadCell role='columnheader'>
            <Paragraph3 margin={0}>{t('quantity')}</Paragraph3>
          </StyledHeadCell>
          <StyledHeadCell role='columnheader'>
            <Paragraph3 margin={0}>{t('voivodeship')}</Paragraph3>
          </StyledHeadCell>
        </StyledHead>
        <StyledTableBody>
          {filteredData
            .slice()
            .reverse()
            .map(({ date, count, voivodeship, source }, index) => (
              <StyledRow key={index}>
                <StyledCell>
                  <Paragraph4 margin={0}>
                    <StyledLink href={source} target='_blank'>
                      {date}
                    </StyledLink>
                  </Paragraph4>
                </StyledCell>
                <StyledCell>
                  <Paragraph4 margin={0}>{count}</Paragraph4>
                </StyledCell>
                <StyledCell>
                  <Paragraph4
                    margin={0}
                    $style={{
                      wordBreak: 'break-all',
                    }}
                  >
                    {voivodeship ? (
                      <StyledLink
                        onClick={() => setClickedVoivodeship(voivodeship)}
                        $style={{ cursor: 'pointer' }}
                      >
                        {voivodeship}
                      </StyledLink>
                    ) : (
                      t('noDetails')
                    )}
                  </Paragraph4>
                </StyledCell>
              </StyledRow>
            ))}
        </StyledTableBody>
      </StyledTable>
    </>
  );
}
