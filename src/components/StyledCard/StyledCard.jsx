import React from 'react';
import { Card } from 'baseui/card';

export default function StyledCard({ children, style, ...props }) {
  return (
    <Card
      overrides={{
        Root: {
          style: ({ $theme }) => {
            const styleOverrides = style ? style($theme) : {};
            return {
              width: '100%',
              boxSizing: 'border-box',
              borderRadius: $theme.borders.radius200,
              boxShadow: $theme.lighting.shadow500,
              ...styleOverrides
            };
          }
        }
      }}
      {...props}
    >
      {children}
    </Card>
  );
}
