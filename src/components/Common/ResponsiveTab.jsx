import React from 'react';
import { Tab } from 'baseui/tabs';

export default function ResponsiveTab({ isCompact, ...props }) {
  return (
    <Tab
      overrides={{
        Tab: {
          style: {
            flexGrow: 1,
            textAlign: 'center',
            ...(isCompact && { padding: '4px 0' }),
          },
        },
      }}
      {...props}
    />
  );
}
