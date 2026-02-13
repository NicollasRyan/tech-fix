import React from 'react';
import ReactDOM from 'react-dom/client';
import './firebase.ts';
import { GlobalStyle } from './styles/global.ts';
import { AppRoutes } from './routes/index.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/pt-br';

dayjs.extend(utc);
dayjs.locale('pt-br');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <GlobalStyle />
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>
);

