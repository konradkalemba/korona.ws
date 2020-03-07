import React from 'react';
import { Card } from 'baseui/card';

export default function StyledCard({ children, ...props }) {
  return (
    <Card
      overrides={{
        Root: {
          style: ({ $theme }) => ({
            width: props.width || '328px',
            borderRadius: $theme.borders.radius200,
            boxShadow: $theme.lighting.shadow500
          })
        }
      }}
      {...props}
    >
      {children}
    </Card>
  );
}