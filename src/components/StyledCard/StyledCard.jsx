import React from 'react';
import { Card } from 'baseui/card';

export default function StyledCard({ children, width, ...props }) {
  return (
    <Card
      overrides={{
        Root: {
          style: ({ $theme }) => ({
            width: '100%',
            borderRadius: $theme.borders.radius200,
            boxShadow: $theme.lighting.shadow500,
            [$theme.mediaQuery.large]: {
              width
            }
          })
        }
      }}
      {...props}
    >
      {children}
    </Card>
  );
}