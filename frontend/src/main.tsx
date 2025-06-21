import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';

const googleClientId = '511827152165-nai5l57ubi3nuvnc4ja29dahs6aiffle.apps.googleusercontent.com';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider 
      clientId={googleClientId}
      onScriptLoadError={() => console.error('Failed to load Google Sign-In script')}
    >
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);