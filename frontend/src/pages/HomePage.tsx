import React, { useState, useEffect } from 'react';
import { Search, Film, Sparkles, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import { Movie } from '../types';
import { api } from '../api/client';
import { MovieCard } from '../components/MovieCard';

export const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async (genre?: string, search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getMovies(genre === 'All' ? undefined : genre, search);
      setMovies(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.getMovies()
      .then(data => setGenres([...new Set(data.map(movie => movie.genre).filter(Boolean))].sort()))
      .catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchMovies(selectedGenre, searchQuery);
    }, 250);

    return () => clearTimeout(handler);
  }, [selectedGenre, searchQuery]);

  // Featured movie for the hero banner
  const featured = movies[0];

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Hero Banner Section */}
      {featured && (
        <div style={{
          position: 'relative',
          minHeight: '440px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '3rem'
        }}>
          {/* Backdrop Image */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${featured.posterUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            filter: 'blur(30px) brightness(0.25)',
            transform: 'scale(1.1)',
            zIndex: 0
          }} />

          {/* Vignette Gradients */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(8, 10, 15, 0.95) 20%, rgba(8, 10, 15, 0.6) 60%, rgba(8, 10, 15, 0.95) 100%)',
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(to top, var(--bg-dark), transparent)',
            zIndex: 1
          }} />

          {/* Hero Content */}
          <div className="container" style={{ position: 'relative', zIndex: 2, padding: '3.5rem 1.5rem' }}>
            <div style={{ maxWidth: '640px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.8rem' }}>
                <span className="badge badge-genre" style={{ padding: '0.3rem 0.8rem' }}>
                  <Sparkles size={13} /> FEATURED BLOCKBUSTER
                </span>
                <span className="badge badge-rating">
                  {featured.rating}
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: '1rem',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)'
              }}>
                {featured.title}
              </h1>

              <p style={{
                color: 'var(--text-muted)',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                marginBottom: '1.8rem',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {featured.synopsis}
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href={`/movies/${featured.id}`}
                  className="btn btn-primary btn-lg"
                >
                  <Film size={18} />
                  Book Tickets Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Catalog Section */}
      <div className="container">
        {/* Section Header & Filters */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>
                Now Showing in Theatres
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Select a movie to browse available showtimes and choose your seats.
              </p>
            </div>

            {/* Search Bar (Stretch goal #3) */}
            <div style={{ position: 'relative', minWidth: '280px', flex: '1', maxWidth: '380px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-dim)'
                }}
              />
              <input
                type="text"
                placeholder="Search movies by title or cast..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          {/* Genre Filters Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: 'var(--text-dim)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginRight: '0.4rem'
            }}>
              <Filter size={15} /> Genre:
            </span>
            {['All', ...genres].map((genre) => {
              const active = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  style={{
                    background: active ? '#e50914' : 'rgba(255, 255, 255, 0.05)',
                    color: active ? '#ffffff' : 'var(--text-muted)',
                    border: `1px solid ${active ? '#e50914' : 'var(--border-subtle)'}`,
                    borderRadius: '9999px',
                    padding: '0.45rem 1.1rem',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Movies Grid / State Handling */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="glass-panel"
                style={{ height: '420px', borderRadius: '18px', animation: 'pulseGlow 1.5s infinite ease-in-out' }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <AlertCircle size={40} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Failed to Load Movies</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
            <button onClick={() => fetchMovies(selectedGenre, searchQuery)} className="btn btn-secondary">
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        ) : movies.length === 0 ? (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <Film size={44} color="var(--text-dim)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Movies Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              No titles match your current filter criteria "{selectedGenre}" {searchQuery && `with query "${searchQuery}"`}.
            </p>
            <button
              onClick={() => { setSelectedGenre('All'); setSearchQuery(''); }}
              className="btn btn-secondary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '2rem'
          }}>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
