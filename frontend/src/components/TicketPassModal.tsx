import React from 'react';
import { X, Printer, CheckCircle, Calendar, Clock, MapPin, Armchair, Film } from 'lucide-react';
import { Booking } from '../types';

interface TicketPassModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.5rem'
    }}
    onClick={onClose}
    >
      <div
        className="glass-panel ticket-card"
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'linear-gradient(145deg, #161b26 0%, #0d1017 100%)',
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 40px rgba(229, 9, 20, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div style={{
          background: 'linear-gradient(90deg, #e50914 0%, #b8050f 100%)',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Film size={22} />
            <div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                CINEPASS BOARDING PASS
              </span>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Official Cinema e-Ticket</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="no-print"
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Ticket Body */}
        <div style={{ padding: '2rem 1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Movie Title
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                {booking.movieTitle}
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-status-confirmed" style={{ fontSize: '0.8rem' }}>
                <CheckCircle size={13} />
                {booking.bookingStatus}
              </span>
            </div>
          </div>

          {/* Grid Information */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.2rem',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '1.2rem',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                <MapPin size={14} /> THEATRE
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '0.2rem' }}>
                {booking.theatreName}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                <Armchair size={14} /> SEATS ({booking.seatCount})
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.2rem' }}>
                {booking.seatCodes.join(', ')}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                <Calendar size={14} /> DATE
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '0.2rem' }}>
                {booking.showDate}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                <Clock size={14} /> TIME
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '0.2rem' }}>
                {booking.showTime}
              </div>
            </div>
          </div>

          {/* Booking ID & Barcode simulation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 0',
            borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
            borderBottom: '1px dashed rgba(255, 255, 255, 0.15)',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BOOKING REF / PASS ID</div>
              <div style={{ fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em' }}>
                {booking.id.toUpperCase()}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL PAID</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                ₹{Number(booking.totalAmount).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Mock Barcode Graphic */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              display: 'inline-flex',
              gap: '3px',
              height: '38px',
              padding: '6px 16px',
              background: '#ffffff',
              borderRadius: '6px',
              alignItems: 'center'
            }}>
              {[4, 2, 6, 2, 5, 3, 2, 4, 6, 2, 3, 5, 2, 4, 3, 6, 2, 5, 4, 2, 6, 3, 4].map((width, i) => (
                <div key={i} style={{ width: `${width}px`, height: '100%', background: '#000000' }} />
              ))}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.4rem', fontFamily: 'monospace' }}>
              *SCAN AT CINEMA USHER TURNSTILE*
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.8rem' }} className="no-print">
            <button
              onClick={handlePrint}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              <Printer size={16} />
              Print / Save Ticket
            </button>
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
