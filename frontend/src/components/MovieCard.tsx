import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Ticket } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="glass-panel" style={{
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(0, 0, 0, 0.8), 0 0 25px -5px rgba(229, 9, 20, 0.3)';
      e.currentTarget.style.borderColor = 'rgba(229, 9, 20, 0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      e.currentTarget.style.borderColor = 'var(--border-subtle)';
    }}
    >
      {/* Poster image container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '135%', // 3:4 aspect ratio
        overflow: 'hidden',
        background: '#121621'
      }}>
        <img
          src={movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'}
          alt={movie.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Rating overlay badge */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
          <span className="badge badge-rating">
            <Star size={11} fill="#fbbf24" color="#fbbf24" />
            {movie.rating}
          </span>
        </div>

        {/* Genre overlay badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
          <span className="badge badge-genre">
            {movie.genre}
          </span>
        </div>

        {/* Gradient shadow overlay at bottom of poster */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(to top, rgba(18, 22, 33, 0.95), transparent)'
        }} />
      </div>

      {/* Content Details */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            marginBottom: '0.4rem',
            lineHeight: 1.3
          }}>
            {movie.title}
          </h3>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '0.9rem'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={14} color="var(--text-dim)" />
              {movie.durationMins} mins
            </span>
          </div>

          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-dim)',
            lineHeight: 1.5,
            marginBottom: '1.2rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {movie.synopsis || 'Experience this cinematic journey with immersive sound and high-definition projection.'}
          </p>
        </div>

        {/* Book Now Button */}
        <Link
          to={`/movies/${movie.id}`}
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.65rem 1rem', fontSize: '0.9rem' }}
        >
          <Ticket size={16} />
          Book Now
        </Link>
      </div>
    </div>
  );
};
