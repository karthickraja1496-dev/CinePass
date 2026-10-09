import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Ticket, AlertCircle, CheckCircle2, LogIn, Sparkles } from 'lucide-react';
import { Showtime, Booking } from '../types';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { SeatMap } from '../components/SeatMap';
import { TicketPassModal } from '../components/TicketPassModal';
import { CountdownTimer } from '../components/CountdownTimer';

export const SeatSelectionPage: React.FC = () => {
  const { id: showtimeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(() =>
    (location.state as { selectedSeats?: string[] } | null)?.selectedSeats ?? []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking states
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const fetchSeatData = async () => {
    if (!showtimeId) return;
    try {
      setLoading(true);
      setError(null);
      const [stData, booked] = await Promise.all([
        api.getShowtimeById(showtimeId),
        api.getBookedSeats(showtimeId)
      ]);
      setShowtime(stData);
      setBookedSeats(booked);
      setSelectedSeats(current => current.filter(seat => !booked.includes(seat)));
    } catch (err: any) {
      setError(err.message || 'Failed to load showtime details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeatData();
  }, [showtimeId]);

  const handleToggleSeat = (seatCode: string) => {
    if (selectedSeats.includes(seatCode)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatCode));
    } else {
      if (selectedSeats.length >= 6) {
        alert('You can select a maximum of 6 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatCode].sort());
    }
  };

  const handleProceedBooking = async () => {
    if (selectedSeats.length === 0) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      setBookingInProgress(true);
      setError(null);
      const booking = await api.createBooking(showtimeId!, selectedSeats);
      setCompletedBooking(booking);
      // Immediately refresh booked seats so they show red on map!
      setBookedSeats(prev => [...prev, ...selectedSeats]);
      setSelectedSeats([]);
    } catch (err: any) {
      setError(err.message || 'Failed to confirm booking. A seat may have just been booked.');
      // Refresh booked seats to reflect actual current state
      api.getBookedSeats(showtimeId!).then(setBookedSeats);
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '3px solid rgba(229, 9, 20, 0.2)',
          borderTopColor: '#e50914',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1.5rem'
        }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading theatre seating layout...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error && !showtime) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <AlertCircle size={40} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Showtime Unavailable</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error}</p>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    );
  }

  const ticketPrice = showtime ? Number(showtime.ticketPrice) : 0;
  const totalPrice = selectedSeats.length * ticketPrice;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 6rem' }}>
      {/* Breadcrumb Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '1rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Movie Showtimes
        </button>

        {showtime && (
          <div className="glass-panel" style={{
            padding: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              {showtime.moviePosterUrl && (
                <img
                  src={showtime.moviePosterUrl}
                  alt={showtime.movieTitle}
                  style={{
                    width: '60px',
                    height: '80px',
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }}
                />
              )}
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                  {showtime.movieTitle}
                </h1>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.2rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.3rem'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} color="#e50914" /> {showtime.theatreName}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={14} /> {showtime.showDate}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={14} /> {showtime.showTime.substring(0, 5)}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <CountdownTimer showDate={showtime.showDate} showTime={showtime.showTime} />
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                textAlign: 'right'
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>PRICE PER TICKET</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>
                  ₹{ticketPrice.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error alert if conflict occurs */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          color: '#f87171',
          marginBottom: '2rem'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Seat Map + Booking Summary Sidebar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr minmax(300px, 360px)',
        gap: '2rem',
        alignItems: 'start'
      }} className="seat-booking-grid">
        {/* Left: 5x10 Seat Map */}
        <div>
          <SeatMap
            bookedSeats={bookedSeats}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
            maxSeats={6}
          />
        </div>

        {/* Right: Booking Summary Drawer */}
        <div className="glass-panel" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Ticket size={18} color="#e50914" /> Booking Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Selected Seats ({selectedSeats.length})</span>
              <span style={{ fontWeight: 700, color: selectedSeats.length > 0 ? '#f59e0b' : 'var(--text-dim)' }}>
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Ticket Price</span>
              <span>₹{ticketPrice.toFixed(2)} / seat</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Booking Fees</span>
              <span style={{ color: '#10b981' }}>FREE (Foundation Capstone)</span>
            </div>

            <div style={{
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>Total Payable</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleProceedBooking}
            disabled={selectedSeats.length === 0 || bookingInProgress}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.9rem',
              fontSize: '1rem',
              opacity: selectedSeats.length === 0 ? 0.5 : 1,
              cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {bookingInProgress ? (
              <span>Confirming Booking...</span>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Confirm Booking ({selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'})
              </>
            )}
          </button>

          {!isAuthenticated && selectedSeats.length > 0 && (
            <div style={{
              marginTop: '0.8rem',
              fontSize: '0.8rem',
              color: 'var(--text-dim)',
              textAlign: 'center'
            }}>
              *You will be prompted to login/register to complete booking.
            </div>
          )}
        </div>
      </div>

      {/* Auth Prompt Modal (If Guest) */}
      {showAuthModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '440px',
            width: '100%',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(229, 9, 20, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.2rem'
            }}>
              <LogIn size={24} color="#e50914" />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Sign In to Complete Booking
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.8rem', lineHeight: '1.5' }}>
              Sign in or create an account to continue with {selectedSeats.join(', ')}. Availability is checked again when you confirm.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <Link
                to="/login"
                state={{ from: location.pathname, selectedSeats }}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Log In to CinePass
              </Link>
              <Link
                to="/register"
                state={{ from: location.pathname, selectedSeats }}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Create New Account
              </Link>
              <button
                onClick={() => setShowAuthModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '0.4rem',
                  fontSize: '0.85rem'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Pass Modal upon successful confirmation */}
      {completedBooking && (
        <TicketPassModal
          booking={completedBooking}
          onClose={() => {
            setCompletedBooking(null);
            navigate('/bookings');
          }}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .seat-booking-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
