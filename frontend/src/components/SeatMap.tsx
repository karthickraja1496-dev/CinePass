import React from 'react';
import { Armchair, Check, Lock, AlertCircle } from 'lucide-react';

interface SeatMapProps {
  bookedSeats: string[];
  selectedSeats: string[];
  onToggleSeat: (seatCode: string) => void;
  maxSeats?: number;
}

const ROWS = ['A', 'B', 'C', 'D', 'E'];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const SeatMap: React.FC<SeatMapProps> = ({
  bookedSeats,
  selectedSeats,
  onToggleSeat,
  maxSeats = 6
}) => {
  const isBooked = (code: string) => bookedSeats.includes(code);
  const isSelected = (code: string) => selectedSeats.includes(code);

  return (
    <div className="glass-panel" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
      {/* Cinema Screen Indicator */}
      <div style={{ maxWidth: '640px', margin: '0 auto 2.5rem' }}>
        <div style={{
          height: '6px',
          width: '100%',
          background: 'linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%)',
          borderRadius: '9999px',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.7)',
          marginBottom: '0.8rem'
        }} />
        <span style={{
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--text-dim)',
          fontWeight: 700
        }}>
          SCREEN THIS WAY
        </span>
      </div>

      {/* 5x10 Seat Grid */}
      <div style={{
        display: 'inline-block',
        margin: '0 auto',
        overflowX: 'auto',
        maxWidth: '100%',
        paddingBottom: '0.5rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {ROWS.map((row) => (
            <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              {/* Row label left */}
              <div style={{
                width: '26px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-dim)',
                textAlign: 'center'
              }}>
                {row}
              </div>

              {/* Seats in row */}
              <div style={{ display: 'flex', gap: '0.55rem' }}>
                {COLS.map((col, idx) => {
                  const seatCode = `${row}${col}`;
                  const booked = isBooked(seatCode);
                  const selected = isSelected(seatCode);

                  // Create aisle spacing after column 5
                  const isAisle = idx === 4;

                  return (
                    <React.Fragment key={seatCode}>
                      <button
                        type="button"
                        disabled={booked}
                        onClick={() => onToggleSeat(seatCode)}
                        title={booked ? `${seatCode} (Booked)` : `${seatCode} (Available)`}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: 'none',
                          cursor: booked ? 'not-allowed' : 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          transition: 'all 0.15s ease',
                          position: 'relative',
                          background: booked
                            ? '#ef4444' // Red for booked
                            : selected
                            ? '#f59e0b' // Gold for selected
                            : '#10b981', // Green for available
                          color: '#ffffff',
                          boxShadow: selected
                            ? '0 0 12px rgba(245, 158, 11, 0.7)'
                            : 'none',
                          transform: selected ? 'scale(1.08)' : 'scale(1)'
                        }}
                      >
                        {booked ? (
                          <Lock size={14} />
                        ) : selected ? (
                          <Check size={16} strokeWidth={3} />
                        ) : (
                          seatCode
                        )}
                      </button>

                      {isAisle && (
                        <div style={{ width: '18px' }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Row label right */}
              <div style={{
                width: '26px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-dim)',
                textAlign: 'center'
              }}>
                {row}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend & Seat Limit notice */}
      <div style={{
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: '#10b981' }} />
          <span>Available (Green)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: '#f59e0b' }} />
          <span>Selected (Amber)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: '#ef4444' }} />
          <span>Booked (Red)</span>
        </div>
      </div>

      {selectedSeats.length >= maxSeats && (
        <div style={{
          marginTop: '1rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#fbbf24',
          fontSize: '0.85rem'
        }}>
          <AlertCircle size={15} />
          Maximum {maxSeats} seats selected per booking.
        </div>
      )}
    </div>
  );
};
