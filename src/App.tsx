import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Router from './routes';
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
  </div>
);



function App() {
  return (

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <NotificationProvider>
            <RoleProvider>
              <BrowserRouter>
                <Suspense fallback={<LoadingFallback />}>
                  <Router />
                </Suspense>
              </BrowserRouter>
            </RoleProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
  );
}

export default App;