import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, MapPin, Calendar, Film, Ticket, Users } from 'lucide-react';
import { MovieDetail, Showtime } from '../types';
import { api } from '../api/client';
import { CountdownTimer } from '../components/CountdownTimer';

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getMovieById(id)
      .then(setMovie)
      .catch((err) => setError(err.message || 'Movie not found'))
      .finally(() => setLoading(false));
  }, [id]);

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
        <p style={{ color: 'var(--text-muted)' }}>Loading movie details...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Movie Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error}</p>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Movies
        </Link>
      </div>
    );
  }

  // Group showtimes by Theatre Name
  const showtimesByTheatre: { [theatre: string]: Showtime[] } = {};
  movie.showtimes.forEach((st) => {
    if (!showtimesByTheatre[st.theatreName]) {
      showtimesByTheatre[st.theatreName] = [];
    }
    showtimesByTheatre[st.theatreName].push(st);
  });

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Top Backdrop Header */}
      <div style={{
        position: 'relative',
        minHeight: '380px',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '2.5rem'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          filter: 'blur(25px) brightness(0.2)',
          transform: 'scale(1.1)'
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, var(--bg-dark) 10%, rgba(8, 10, 15, 0.7) 100%)'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '2.5rem 1.5rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              transition: 'color 0.2s'
            }}
          >
            <ArrowLeft size={16} /> Back to Movies
          </Link>

          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '2.5rem',
            alignItems: 'flex-end'
          }}>
            {/* Poster Card */}
            <div style={{
              width: '200px',
              height: '280px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.8), 0 0 25px rgba(229, 9, 20, 0.3)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              flexShrink: 0
            }}>
              <img
                src={movie.posterUrl}
                alt={movie.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Title & Metadata */}
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                <span className="badge badge-genre">{movie.genre}</span>
                <span className="badge badge-rating">
                  <Star size={12} fill="#fbbf24" color="#fbbf24" /> {movie.rating}
                </span>
                <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-main)' }}>
                  <Clock size={12} /> {movie.durationMins} mins
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 800,
                marginBottom: '1rem',
                lineHeight: 1.15
              }}>
                {movie.title}
              </h1>

              <div style={{ maxWidth: '750px', color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>
                {movie.synopsis}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body: Cast info & Showtimes selection */}
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem'
        }}>
          {/* Left Column: Movie Info & Cast */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} color="#e50914" /> Top Cast & Crew
              </h3>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.7' }}>
                {movie.castMembers || 'Information not specified.'}
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Film size={18} color="#e50914" /> Booking Information
              </h3>
              <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li>• Instant digital seat reservation (A1 - E10).</li>
                <li>• No booking fees, full flexibility to cancel before showtime.</li>
                <li>• Official CinePass boarding pass PDF available upon confirmation.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Showtimes Picker */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Available Showtimes</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Pick your preferred theatre and showtime to choose seats.
                </p>
              </div>
            </div>

            {movie.showtimes.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <Calendar size={36} color="var(--text-dim)" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>No Showtimes Scheduled</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  There are currently no active showtimes for this title. Please check back later.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {Object.entries(showtimesByTheatre).map(([theatre, showtimes]) => (
                  <div key={theatre} className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '1.2rem',
                      color: 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '1.05rem'
                    }}>
                      <MapPin size={18} color="#e50914" />
                      {theatre}
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '1rem'
                    }}>
                      {showtimes.map((st) => (
                        <div
                          key={st.id}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '12px',
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.8rem',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              <Calendar size={13} /> {st.showDate}
                            </div>
                            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981' }}>
                              ₹{Number(st.ticketPrice).toFixed(2)}
                            </span>
                          </div>

                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                            {st.showTime.substring(0, 5)}
                          </div>

                          {/* Countdown Timer */}
                          <CountdownTimer showDate={st.showDate} showTime={st.showTime} />

                          <button
                            onClick={() => navigate(`/showtimes/${st.id}/seats`)}
                            className="btn btn-primary btn-sm"
                            style={{ width: '100%', marginTop: '0.4rem' }}
                          >
                            <Ticket size={15} /> Select Seats
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
