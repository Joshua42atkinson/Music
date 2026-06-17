import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { preloadStaticData } from './data/staticData';
import { GOOGLE_CLIENT_ID } from './config/google';
import './index.css';
import './i18n';

preloadStaticData().then(async () => {
  const { default: App } = await import('./App.jsx');
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <HelmetProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </HelmetProvider>
    </React.StrictMode>,
  );
});
