import React from 'react';
import { useStyletron } from 'baseui';

export default function Marker() {
  const [, theme] = useStyletron();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill={theme.colors.negative}
      stroke={theme.colors.negative}
    >
      <circle
        cx="50%"
        cy="50%"
        r="8px"
      ></circle>
      <circle
        class="pulse"
        cx="50%"
        cy="50%"
        r="12px"
      ></circle>
    </svg>
  )
}