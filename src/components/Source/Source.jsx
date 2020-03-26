import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'baseui/tabs';

import { useData } from '../../contexts/DataContext';
import ResponsiveTab from '../Common/ResponsiveTab';
import Table from './Table';

export default function Source() {
  const { t } = useTranslation();
  const { cases, deaths, cures, isLoading } = useData();
  const [activeKey, setActiveKey] = useState('0');

  return (
    <Tabs
      onChange={({ activeKey }) => {
        setActiveKey(activeKey);
      }}
      activeKey={activeKey}
      overrides={{
        TabContent: {
          style: {
            maxHeight: '400px',
            overflow: 'auto',
            textAlign: 'left',
            padding: '14px',
          },
        },
      }}
    >
      <ResponsiveTab title={t('confirmedCases')}>
        <Table data={cases} isLoading={isLoading} />
      </ResponsiveTab>
      <ResponsiveTab title={t('deaths')}>
        <Table data={deaths} isLoading={isLoading} />
      </ResponsiveTab>
      <ResponsiveTab title={t('cured')}>
        <Table data={cures} isLoading={isLoading} />
      </ResponsiveTab>
    </Tabs>
  );
}
