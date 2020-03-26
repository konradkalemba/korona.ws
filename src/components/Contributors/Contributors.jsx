import React, { useState } from 'react';
import { Avatar } from 'baseui/avatar';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Block } from 'baseui/block';

const REPO = 'konradkalemba/korona.ws';

export default function Contributors() {
  const [data, setData] = useState([]);

  fetch(`https://api.github.com/repos/${REPO}/contributors`)
    .then(async (response) => {
      if (response.ok) {
        setData(await response.json());
      } else {
        throw new Error('GitHub API rate limit exceeded!');
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return (
    <Block display='flex' flexWrap>
      {data &&
        data
          .filter(({ type }) => type === 'User')
          .map((contributor) => (
            <Block as='a' href={contributor.html_url} target='_blank' key={contributor.id} title={contributor.login}>
              <Avatar
                name={contributor.login}
                src={contributor.avatar_url}
                overrides={{
                  Root: {
                    style: ({ $theme }) => ({
                      margin: $theme.sizing.scale100,
                      transitionProperty: 'all',
                      transitionDuration: $theme.animation.timing100,
                      transitionTimingFunction: $theme.animation.easeInOutCurve,
                      ':hover': {
                        transform: 'scale(1.2)',
                      },
                    }),
                  },
                }}
              />
            </Block>
          ))}
    </Block>
  );
}
