import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Overview, Login, Profile, Edit } from './pages'
import { AuthProvider } from "./components/AuthContext";
import AuthGuard from './components/AuthGuard';
import { ROUTES } from './routes';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.HOME.path} element={<AuthGuard><Home /></AuthGuard>} />
          <Route path={ROUTES.LOGIN.path} element={<Login />} />
          <Route path={ROUTES.OVERVIEW.path} element={<AuthGuard><Overview /></AuthGuard>} />
          <Route path={ROUTES.PROFILE.path} element={<AuthGuard><Profile /></AuthGuard>} />
          <Route path="/edit/:username/:index" element={<Edit />} />
          <Route path={ROUTES.ERROR_404.path} element={<div><h1>Not found</h1></div>} />
          {/* <Route path="*" element={<Navigate to={ROUTES.ERROR_404.path} replace />} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;