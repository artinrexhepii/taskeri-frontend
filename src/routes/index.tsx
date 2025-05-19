import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { routes } from './routes';
import MainLayout from '../components/layout/MainLayout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout/AuthLayout';
import { useAuth } from '../context/AuthContext';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500">Something went wrong. Please try again.</div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Router: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <Suspense fallback={<LoadingFallback />}>
                    {routes.login?.component && <routes.login.component />}
                  </Suspense>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/register"
              element={
                !isAuthenticated ? (
                  <Suspense fallback={<LoadingFallback />}>
                    {routes.register?.component && <routes.register.component />}
                  </Suspense>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/forgot-password"
              element={
                !isAuthenticated ? (
                  <Suspense fallback={<LoadingFallback />}>
                    {routes.forgotPassword?.component && <routes.forgotPassword.component />}
                  </Suspense>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Route>

          {/* Protected routes */}
          <Route
            element={
              isAuthenticated ? (
                <MainLayout />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            {Object.entries(routes)
              .filter(([_, route]) => route?.protected)
              .map(([key, route]) => (
                <Route
                  key={key}
                  path={route.path}
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      {route.component && <route.component />}
                    </Suspense>
                  }
                />
              ))}
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default Router;