import React from 'react';
import ReactDOM from 'react-dom/client';
import './firebase.ts';
import { GlobalStyle } from './styles/global.ts';
import { AppRoutes } from './routes/index.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <>
      <GlobalStyle />
      <AppRoutes />
    </>
  </React.StrictMode>

);

