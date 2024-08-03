import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';  // Optional: If you have styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Deploy project using Netlify to share with friends.