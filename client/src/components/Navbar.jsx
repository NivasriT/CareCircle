import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  Menu,
  X,
  PlusCircle,
  BarChart3,
  Award,
  Calendar,
  User,
  LogOut,
  Layers,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isNGO, isVolunteer } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 20px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)',
          }}>
            <Heart size={22} fill="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.28rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
              Care<span style={{ color: '#0284c7' }}>Circle</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: '#0d9488', marginTop: '-3px' }}>
              Community Impact Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          <Link
            to="/tasks"
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: isActive('/tasks') ? '#0284c7' : '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Layers size={17} />
            Explore Tasks
          </Link>

          <Link
            to="/impact"
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: isActive('/impact') ? '#0284c7' : '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <BarChart3 size={17} />
            Impact Dashboard
          </Link>

          <Link
            to="/leaderboard"
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: isActive('/leaderboard') ? '#0284c7' : '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Award size={17} />
            Volunteer Rankings
          </Link>

          {isNGO && (
            <Link
              to="/create-task"
              className="btn btn-primary btn-sm"
              style={{
                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
              }}
            >
              <PlusCircle size={16} />
              Post Task
            </Link>
          )}
        </nav>

        {/* Right Action / Auth Buttons */}
        <div style={{ display: 'none', alignItems: 'center', gap: '14px' }} className="desktop-nav">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                to="/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '9999px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: isNGO ? '#dbeafe' : '#ccfbf1',
                  color: isNGO ? '#1e40af' : '#0f766e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                }}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span>{user?.name?.split(' ')[0]}</span>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: isNGO ? '#0284c7' : '#0d9488',
                  color: '#ffffff',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}>
                  {user?.role}
                </span>
                {isVolunteer && user?.points !== undefined && (
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#b45309',
                    backgroundColor: '#fef3c7',
                    padding: '2px 7px',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}>
                    <Sparkles size={11} /> {user.points} pts
                  </span>
                )}
              </Link>

              <Link
                to="/profile"
                style={{
                  color: '#64748b',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Profile"
              >
                <User size={19} />
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  color: '#ef4444',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Logout"
              >
                <LogOut size={19} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Join CareCircle
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'block',
            padding: '8px',
            color: '#334155',
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>
          <Link
            to="/tasks"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Layers size={18} /> Explore Tasks
          </Link>
          <Link
            to="/impact"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <BarChart3 size={18} /> Impact Dashboard
          </Link>
          <Link
            to="/leaderboard"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Award size={18} /> Volunteer Rankings
          </Link>

          {isNGO && (
            <Link
              to="/create-task"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary btn-sm"
              style={{ justifyContent: 'center' }}
            >
              <PlusCircle size={16} /> Post Task
            </Link>
          )}

          <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '6px 0' }} />

          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontWeight: 600, color: '#0284c7' }}
              >
                Dashboard ({user?.name})
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontWeight: 600, color: '#475569' }}
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#ef4444',
                  fontWeight: 600,
                  textAlign: 'left',
                }}
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-outline"
                style={{ justifyContent: 'center' }}
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary"
                style={{ justifyContent: 'center' }}
              >
                Join CareCircle
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Media query styling for responsive nav */}
      <style>{`
        @media (min-width: 820px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
