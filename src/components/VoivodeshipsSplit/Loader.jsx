import React from 'react';
import ContentLoader from 'react-content-loader';
import { useStyletron } from 'baseui';

export default function Loader() {
  const [, theme] = useStyletron();

  return (
    <ContentLoader
      speed={0.6}
      width={260}
      height={200}
      display={'block'}
      viewBox='0 0 280 200'
      backgroundColor={theme.colors.backgroundTertiary}
      foregroundColor={theme.colors.backgroundSecondary}
    >
      <rect x='20' y='6' rx='2' ry='2' width='80' height='22' />
      <rect x='110' y='6' rx='2' ry='2' width='200' height='22' />
      <rect x='40' y='40' rx='2' ry='2' width='60' height='22' />
      <rect x='110' y='40' rx='2' ry='2' width='170' height='22' />
      <rect x='30' y='74' rx='2' ry='2' width='70' height='22' />
      <rect x='110' y='74' rx='2' ry='2' width='140' height='22' />
      <rect x='20' y='108' rx='2' ry='2' width='80' height='22' />
      <rect x='110' y='108' rx='2' ry='2' width='100' height='22' />
      <rect x='50' y='142' rx='2' ry='2' width='50' height='22' />
      <rect x='110' y='142' rx='2' ry='2' width='100' height='22' />
      <rect x='40' y='176' rx='2' ry='2' width='60' height='22' />
      <rect x='110' y='176' rx='2' ry='2' width='60' height='22' />
    </ContentLoader>
  );
}
