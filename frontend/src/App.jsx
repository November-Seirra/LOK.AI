import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

// Placeholder Dashboard
const Dashboard = () => {
  const { logout } = useAuth();
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome to LokAI!</p>
      <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
  );
};

// Placeholder Home
const Home = () => (
  <div className="p-10 text-center">
    <h1 className="text-4xl font-bold text-indigo-600">LokAI</h1>
    <p className="mt-4 text-xl">AI-Powered Government Exam Preparation</p>
    <div className="mt-8 space-x-4">
      <a href="/login" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Login</a>
      <a href="/register" className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded hover:bg-indigo-50">Register</a>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* Handle reset password token in same component for simplicity */}
            <Route path="/reset-password" element={<ForgotPassword />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
