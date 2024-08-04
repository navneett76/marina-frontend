import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { PortProvider } from './contexts/PortContext';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './Component/Common/PrivateRoute';
import { Routes, Route } from 'react-router-dom';
import Login from './Component/Login/Login';
import ErrorBoundary from './Component/Common/ErrorBoundary';
import { MessageProvider } from './Component/Common/MessageContext';

import SelectOption from './Component/SelectPort/SelectOption';
// import Dashboard from './Component/dashboard/Dashboard';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <PortProvider>
          
          <MessageProvider>
            <AuthProvider>


              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/select-option" element={<SelectOption />} />
                <Route
                  path="/*"
                  element={
                    <PrivateRoute>
                      <App />
                    </PrivateRoute>
                  }
                />
              </Routes>


            </AuthProvider>
          </MessageProvider>
        </PortProvider>
      </ErrorBoundary>
    </BrowserRouter>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
