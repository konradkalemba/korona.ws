import React from 'react';

import { Layout } from '../../components';
import { ThemeProvider } from './../../contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}