import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, Armchair, AlertCircle, CheckCircle2, XCircle, Printer, Film } from 'lucide-react';
import { Booking } from '../types';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { TicketPassModal } from '../components/TicketPassModal';

export const MyBookingsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getMyBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [isAuthenticated]);

  const handleCancel = async (bookingId: string) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this booking? The reserved seats will be released and made available for other guests.'
    );
    if (!confirmCancel) return;

    try {
      const updated = await api.cancelBooking(bookingId);
      // Update local state
      setBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
    } catch (err: any) {
      alert(`Could not cancel booking: ${err.message}`);
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
        <p style={{ color: 'var(--text-muted)' }}>Loading your tickets...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          My Bookings & Tickets
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          View, print, or manage your confirmed cinema reservations.
        </p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '12px',
          padding: '1rem',
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

      {bookings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Ticket size={48} color="var(--text-dim)" style={{ margin: '0 auto 1.2rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No Bookings Yet
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '420px', margin: '0 auto 2rem' }}>
            You haven't reserved any movie tickets yet. Explore currently showing movies and pick your seats!
          </p>
          <Link to="/" className="btn btn-primary">
            <Film size={16} /> Browse Movies
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bookings.map((booking) => {
            const isConfirmed = booking.bookingStatus === 'CONFIRMED';

            return (
              <div
                key={booking.id}
                className="glass-panel"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                  borderLeft: isConfirmed ? '4px solid #10b981' : '4px solid #ef4444'
                }}
              >
                {/* Left: Movie & Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: '1', minWidth: '280px' }}>
                  {booking.moviePosterUrl && (
                    <img
                      src={booking.moviePosterUrl}
                      alt={booking.movieTitle}
                      style={{
                        width: '70px',
                        height: '95px',
                        borderRadius: '10px',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                        {booking.movieTitle}
                      </h2>
                      <span className={isConfirmed ? 'badge badge-status-confirmed' : 'badge badge-status-cancelled'}>
                        {isConfirmed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {booking.bookingStatus}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '1.2rem',
                      fontSize: '0.88rem',
                      color: 'var(--text-muted)'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={14} color="#e50914" /> {booking.theatreName}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={14} /> {booking.showDate}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} /> {booking.showTime.substring(0, 5)}
                      </span>
                    </div>

                    <div style={{
                      marginTop: '0.6rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem'
                    }}>
                      <Armchair size={15} color="#f59e0b" />
                      <span style={{ color: 'var(--text-dim)' }}>Reserved Seats:</span>
                      <span style={{ fontWeight: 700, color: '#f59e0b' }}>
                        {booking.seatCodes.join(', ')} ({booking.seatCount} {booking.seatCount === 1 ? 'ticket' : 'tickets'})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Price & Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>TOTAL AMOUNT</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: isConfirmed ? '#10b981' : 'var(--text-dim)' }}>
                      ₹{Number(booking.totalAmount).toFixed(2)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    {isConfirmed && (
                      <>
                        <button
                          onClick={() => setSelectedTicket(booking)}
                          className="btn btn-secondary btn-sm"
                          title="View / Print Ticket Pass"
                        >
                          <Printer size={15} /> View Pass
                        </button>

                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="btn btn-danger btn-sm"
                        >
                          Cancel Booking
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Pass Modal */}
      {selectedTicket && (
        <TicketPassModal
          booking={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};
