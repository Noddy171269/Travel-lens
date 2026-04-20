import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

// Lazy-loaded pages (React.lazy + Suspense)
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TripDetails = lazy(() => import('./pages/TripDetails'));
const Budget = lazy(() => import('./pages/Budget'));
const Itinerary = lazy(() => import('./pages/Itinerary'));
const Documents = lazy(() => import('./pages/Documents'));

function LoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="spinner" />
    </div>
  );
}

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Login />
                </Suspense>
              }
            />
            <Route
              path="/signup"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Signup />
                </Suspense>
              }
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/trip/:id"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <TripDetails />
                  </AppLayout>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="budget" replace />} />
              <Route path="budget" element={<Budget />} />
              <Route path="itinerary" element={<Itinerary />} />
              <Route path="documents" element={<Documents />} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
