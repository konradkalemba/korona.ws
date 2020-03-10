import React from 'react';
import { useStyletron } from 'baseui';

export default function Marker({ size, count }) {
  const [, theme] = useStyletron();

  return (
    <svg
      className="marker"
      xmlns="http://www.w3.org/2000/svg"
      width={size || '32'}
      height={size || '32'}
      viewBox="0 0 32 32"
    >
      <circle
        className="pulse"
        cx="50%"
        cy="50%"
        r="8px"
        fill={theme.colors.negative}
      ></circle>
      {count && (
        <text className="text" x="50%" y="50%" fontSize={'60%'} fill="white" textAnchor="middle" dy=".3em">{count}</text>
      )}
    </svg>
  )
}