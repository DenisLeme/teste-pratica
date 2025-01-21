import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/index.tsx';
import './style.css'; 

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <link href="https://fonts.cdnfonts.com/css/helvetica-neue-5" rel="stylesheet" />
      <Home />
    </React.StrictMode>
  );
} else {
  console.error('Elemento root não encontrado.');
}



