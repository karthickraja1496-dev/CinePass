import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Film, Ticket, ShieldCheck, LogIn, LogOut, User as UserIcon, Menu, X, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass-nav sticky top-0 z-50 w-full" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #e50914 0%, #b8050f 100%)',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)'
          }}>
            <Film size={22} color="#ffffff" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.45rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(90deg, #ffffff 60%, #e50914 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              CinePass
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1.8rem' }} className="desktop-nav">
          <Link
            to="/"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: isActive('/') ? '#e50914' : 'var(--text-main)',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Film size={17} />
            Movies
          </Link>

          {isAuthenticated && (
            <Link
              to="/bookings"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: isActive('/bookings') ? '#e50914' : 'var(--text-main)',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Ticket size={17} />
              My Bookings
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: isActive('/admin') ? '#f59e0b' : 'var(--accent-gold)',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                padding: '0.35rem 0.8rem',
                borderRadius: '9999px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <ShieldCheck size={16} />
              Admin Panel
            </Link>
          )}
        </div>

        {/* User / Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.4rem 0.8rem',
                borderRadius: '9999px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isAdmin ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {user?.name?.split(' ')[0]}
                </span>
                {isAdmin && (
                  <span style={{
                    fontSize: '0.65rem',
                    background: '#f59e0b',
                    color: '#000',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px',
                    fontWeight: 800
                  }}>
                    ADMIN
                  </span>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log out"
                style={{ padding: '0.5rem 0.8rem' }}
              >
                <LogOut size={16} />
                <span className="hidden-mobile">Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={16} />
                <span>Log In</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <span>Register</span>
              </Link>
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              padding: '0.4rem'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(10, 13, 20, 0.98)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem', color: 'var(--text-main)' }}
          >
            <Film size={18} />
            Movies
          </Link>
          {isAuthenticated && (
            <Link
              to="/bookings"
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem', color: 'var(--text-main)' }}
            >
              <Ticket size={18} />
              My Bookings
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem', color: 'var(--accent-gold)' }}
            >
              <ShieldCheck size={18} />
              Admin Panel
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
};
