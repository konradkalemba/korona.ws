import React from 'react';
import { Tab } from 'baseui/tabs';

export default function ResponsiveTab(props) {
  return (
    <Tab
      overrides={{
        Tab: {
          style: {
            flexGrow: 1,
            textAlign: 'center',
          },
        },
      }}
      {...props}
    />
  );
}
