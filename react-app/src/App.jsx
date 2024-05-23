import React from 'react';
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Login, Profile, Edit, Signup, Start, Post } from './pages'
import { AuthProvider } from "./components/AuthContext";
import AuthGuard from './components/AuthGuard';
import { ROUTES } from './routes';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.HOME.path} element={<Home />} />
          <Route path={ROUTES.LOGIN.path} element={<Login />} />
          <Route path={ROUTES.SIGNUP.path} element={<Signup />} />
          <Route path={ROUTES.START.path} element={<AuthGuard><Start /></AuthGuard>} />
          <Route path={ROUTES.PROFILE.path} element={<AuthGuard><Profile /></AuthGuard>} />
          <Route path="/newpost/:username/" element={<AuthGuard><Post /></AuthGuard>} />
          <Route path="/edit/:username/:index" element={<AuthGuard><Edit /></AuthGuard>} />
          <Route path={ROUTES.ERROR_404.path} element={<div><h1>Not found</h1></div>} />
          <Route path="*" element={<Navigate to={ROUTES.ERROR_404.path} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;