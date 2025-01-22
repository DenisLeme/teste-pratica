import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../src/router/app.tsx';
import './style.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Router>
        <link href="https://fonts.cdnfonts.com/css/helvetica-neue-5" rel="stylesheet" />
        <App />
      </Router>
    </React.StrictMode>
  );
} else {
  console.error('Elemento root não encontrado.');
}
