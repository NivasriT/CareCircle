import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Tasks from './pages/Tasks';
import TaskDetails from './pages/TaskDetails';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import ImpactDashboard from './pages/ImpactDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '80px 20px' }}>
    <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#0284c7' }}>404</h1>
    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '8px 0 16px' }}>Page Not Found</h2>
    <p style={{ color: '#64748b', marginBottom: '24px' }}>
      The page you are looking for doesn't exist or has been moved.
    </p>
    <Link to="/" className="btn btn-primary">
      Return to Home
    </Link>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/:id" element={<TaskDetails />} />
              <Route path="/impact" element={<ImpactDashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-task"
                element={
                  <ProtectedRoute allowedRoles={['ngo', 'admin']}>
                    <CreateTask />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-task/:id"
                element={
                  <ProtectedRoute allowedRoles={['ngo', 'admin']}>
                    <EditTask />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
