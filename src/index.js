import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from 'components/App/App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
            <BrowserRouter basename="/goit-react-hw-04-image-finder">
          <App />
        </BrowserRouter>
  </React.StrictMode>
);
