import React from 'react';

import { useStyletron } from 'baseui';
import Mobile from './Mobile';
import Desktop from './Desktop';

import useWindowDimensions from '../../hooks/window-dimensions';

export default function Layout() {
  const { width } = useWindowDimensions();
  const [, theme] = useStyletron();

  return (
    <>
      {width < theme.breakpoints.medium 
        ? <Mobile />
        : <Desktop />
      }
    </>
  );
}