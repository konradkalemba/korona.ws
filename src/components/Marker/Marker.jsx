import React from 'react';
import { useStyletron } from 'baseui';

export default function Marker({ size, casesCount, deathsCount }) {
  const [, theme] = useStyletron();

  return (
    <svg
      className='marker'
      xmlns='http://www.w3.org/2000/svg'
      width={size || '32'}
      height={size || '32'}
      viewBox='0 0 32 32'
    >
      <circle
        cx='50%'
        cy='50%'
        r='7.5px'
        fill={theme.colors.negative}
        opacity={0.8}
      ></circle>
      <circle
        cx='50%'
        cy='50%'
        r='10px'
        fill={theme.colors.negative}
        opacity={0.2}
      ></circle>
      {casesCount && (
        <text
          className='text'
          x='50%'
          y='50%'
          fontSize={'40%'}
          fill='white'
          textAnchor='middle'
          dy='.3em'
        >
          {casesCount}
        </text>
      )}
    </svg>
  );
}
