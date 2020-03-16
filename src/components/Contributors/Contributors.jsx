import React, { useState } from 'react';
import { Avatar } from 'baseui/avatar';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';

const REPO = 'konradkalemba/korona.ws';

export default function Contributors() {
  const [data, setData] = useState([]);

  fetch(`https://api.github.com/repos/${REPO}/contributors`)
    .then(async response => {
      if (response.ok) {
        setData(await response.json());
      } else {
        throw new Error('GitHub API rate limit exceeded!');
      }
    })
    .catch((error) => {
      console.log(error)
    });

  return (
    <FlexGrid
      flexGridColumnCount={10}
      flexGridColumnGap="scale800"
      flexGridRowGap="scale800"
    >
      {data && data.filter(({ type }) => type === 'User').map(contributor => (
        <FlexGridItem>
          <a
            key={contributor.id}
            href={contributor.html_url}
            title={contributor.login}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Avatar
              name={contributor.login}
              src={contributor.avatar_url}
            />
          </a>
        </FlexGridItem>
      ))}
    </FlexGrid>
  );
}