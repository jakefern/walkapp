import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';  // Optional: If you have styles

ReactDOM.createRoot(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);