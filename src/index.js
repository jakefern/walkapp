import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';  // Optional: If you have styles\

/**
 * Initializes and renders the root component of the React application.
 *
 * This function creates a root element using React's new `createRoot` API and
 * renders the `App` component within a `React.StrictMode` wrapper for highlighting
 * potential issues in the application. The `React.StrictMode` wrapper helps in identifying
 * potential problems in an application by intentionally double-invoking certain lifecycle
 * methods and providing additional warnings.
 *
 * @returns {void}
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Deploy project using Netlify to share with friends.