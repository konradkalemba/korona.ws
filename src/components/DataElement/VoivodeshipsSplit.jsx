import React from 'react';
import { Label3 } from 'baseui/typography';
import { Block } from 'baseui/block';
import { Bar, BarChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useStyletron } from 'baseui';
import Loader from "./Loader"
import { useData } from '../../contexts/DataContext';

export default function VoivodeshipsSplit({ isLoading, data }) {
  const [, theme] = useStyletron();
  const { setClickedVoivodeship } = useData();

  return (
    <>
      <Label3>Podział na województwa</Label3>
      <Block
        $style={{
          height: '196px',
          overflow: 'auto',
          margin: '12px 0 20px'
        }}
      >
        {isLoading && <Loader />}
        {data && <ResponsiveContainer height={data.length * 32} width={'99%'}>
          <BarChart
            data={data}
            layout="vertical"
          >
            <YAxis
              dataKey="voivodeship"
              type="category"
              tick={{
                fill: theme.colors.contentPrimary,
                cursor: 'pointer'
              }}
              width={100}
              onClick={({ value }) => setClickedVoivodeship(value)}
            />
            <XAxis type="number" hide />
            <Tooltip
              formatter={value => [value, 'Liczba']}
              contentStyle={{
                backgroundColor: theme.colors.backgroundPrimary,
                borderColor: theme.colors.backgroundTertiary,
              }}
              cursor={{ fill: theme.colors.backgroundTertiary }}
            />
            <Bar dataKey="count" fill={theme.colors.accent} />
          </BarChart>
        </ResponsiveContainer>}
      </Block>
    </>
  );
}
