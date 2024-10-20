import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

import { ProductProvider } from './context/ProductProvider';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { SupplierProvider } from './context/SupplierContext';

const rootElement = document.getElementById('root') as HTMLElement;
const queryClient = new QueryClient();
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>                
            <ProductProvider>
              <App />
            </ProductProvider>
          </SettingsProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
