import React from 'react';
import { useStyletron } from 'baseui';

export default function Marker({ size, casesCount, deathsCount }) {
  const [, theme] = useStyletron();
  const offset = (deathsCount / casesCount) * 100;

  return (
    <svg
      className="marker"
      xmlns="http://www.w3.org/2000/svg"
      width={size || '32'}
      height={size || '32'}
      viewBox="0 0 32 32"
    >
      {deathsCount && 
        <defs>
          <linearGradient id={`combined-${offset}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset={`${100 - offset}%`} stopColor={theme.colors.negative} />
            <stop offset={`${offset}%`}  stopColor={theme.colors.primary} />
          </linearGradient>
        </defs>
      }

      <circle
        className="pulse"
        cx="50%"
        cy="50%"
        r="8px"
        fill={deathsCount ? `url(#combined-${offset})` : theme.colors.negative}
      ></circle>
      {casesCount && (
        <text className="text" x="50%" y="50%" fontSize={'60%'} fill="white" textAnchor="middle" dy=".3em">{casesCount}</text>
      )}
    </svg>
  )
}