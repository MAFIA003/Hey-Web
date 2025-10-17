// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { StateProvider } from './StateProvider'; // Import StateProvider
import reducer, { initialState } from './reducer'; // Import the reducer and initial state

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename='/Hey-Web/'>
      <StateProvider initialState={initialState} reducer={reducer}> {/* Add the wrapper here */}
        <App />
      </StateProvider>
    </BrowserRouter>
  </React.StrictMode>,
);