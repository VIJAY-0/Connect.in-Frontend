// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import App from './App.jsx';
import './index.css';
import { ContextProvider } from './context/GlobalContextProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ContextProvider>
        <App />
      </ContextProvider>
    </AuthProvider>
  </React.StrictMode>,
);