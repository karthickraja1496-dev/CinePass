import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, Edit3, Film, Calendar, Clock, MapPin, ShieldCheck, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Movie, Showtime } from '../types';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const AdminPage: React.FC = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'movies' | 'showtimes'>('movies');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Movie Modal state
  const [movieModalOpen, setMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [movieForm, setMovieForm] = useState({
    title: '',
    genre: 'Action',
    durationMins: 120,
    rating: 'U/A',
    posterUrl: '',
    synopsis: '',
    castMembers: ''
  });

  // Showtime Modal state
  const [showtimeModalOpen, setShowtimeModalOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);
  const [showtimeForm, setShowtimeForm] = useState({
    movieId: '',
    theatreName: 'PVR Cinemas IMAX',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '18:30:00',
    ticketPrice: 250
  });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, isAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [mList, sList] = await Promise.all([
        api.getMovies(),
        api.getAllShowtimes()
      ]);
      setMovies(mList);
      setShowtimes(sList);
      if (mList.length > 0 && !showtimeForm.movieId) {
        setShowtimeForm(prev => ({ ...prev, movieId: mList[0].id }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  // Movie Handlers
  const handleOpenMovieCreate = () => {
    setEditingMovie(null);
    setMovieForm({
      title: '',
      genre: 'Action',
      durationMins: 120,
      rating: 'U/A',
      posterUrl: '',
      synopsis: '',
      castMembers: ''
    });
    setMovieModalOpen(true);
  };

  const handleOpenMovieEdit = (m: Movie) => {
    setEditingMovie(m);
    setMovieForm({
      title: m.title,
      genre: m.genre,
      durationMins: m.durationMins,
      rating: m.rating,
      posterUrl: m.posterUrl || '',
      synopsis: m.synopsis || '',
      castMembers: m.castMembers || ''
    });
    setMovieModalOpen(true);
  };

  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMovie) {
        await api.updateMovie(editingMovie.id, movieForm);
      } else {
        await api.createMovie(movieForm);
      }
      setMovieModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(`Error saving movie: ${err.message}`);
    }
  };

  const handleDeleteMovie = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? All associated showtimes will also be removed.`)) {
      return;
    }
    try {
      await api.deleteMovie(id);
      loadData();
    } catch (err: any) {
      alert(`Error deleting movie: ${err.message}`);
    }
  };

  // Showtime Handlers
  const handleOpenShowtimeCreate = () => {
    setEditingShowtime(null);
    setShowtimeForm({
      movieId: movies[0]?.id || '',
      theatreName: 'PVR Cinemas IMAX',
      showDate: new Date().toISOString().split('T')[0],
      showTime: '18:30:00',
      ticketPrice: 250
    });
    setShowtimeModalOpen(true);
  };

  const handleOpenShowtimeEdit = (showtime: Showtime) => {
    setEditingShowtime(showtime);
    setShowtimeForm({
      movieId: showtime.movieId,
      theatreName: showtime.theatreName,
      showDate: showtime.showDate,
      showTime: showtime.showTime,
      ticketPrice: Number(showtime.ticketPrice)
    });
    setShowtimeModalOpen(true);
  };

  const handleSaveShowtime = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let formattedTime = showtimeForm.showTime;
      if (formattedTime.length === 5) {
        formattedTime += ':00';
      }
      const data = {
        movieId: showtimeForm.movieId,
        theatreName: showtimeForm.theatreName,
        showDate: showtimeForm.showDate,
        showTime: formattedTime,
        ticketPrice: Number(showtimeForm.ticketPrice)
      };
      if (editingShowtime) {
        await api.updateShowtime(editingShowtime.id, data);
      } else {
        await api.createShowtime(data);
      }
      setShowtimeModalOpen(false);
      setEditingShowtime(null);
      loadData();
    } catch (err: any) {
      alert(`Error creating showtime: ${err.message}`);
    }
  };

  const handleDeleteShowtime = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this showtime?')) return;
    try {
      await api.deleteShowtime(id);
      loadData();
    } catch (err: any) {
      alert(`Error deleting showtime: ${err.message}`);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      {/* Admin Title */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            <ShieldCheck size={16} /> ADMINISTRATOR DASHBOARD
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
            Cinema Catalogue Management
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          {activeTab === 'movies' ? (
            <button onClick={handleOpenMovieCreate} className="btn btn-primary">
              <PlusCircle size={16} /> Add Movie
            </button>
          ) : (
            <button onClick={handleOpenShowtimeCreate} className="btn btn-primary">
              <PlusCircle size={16} /> Add Showtime
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.8rem',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => setActiveTab('movies')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'movies' ? '2px solid #e50914' : '2px solid transparent',
            color: activeTab === 'movies' ? '#ffffff' : 'var(--text-muted)',
            padding: '0.8rem 1.4rem',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Film size={18} /> Movies ({movies.length})
        </button>

        <button
          onClick={() => setActiveTab('showtimes')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'showtimes' ? '2px solid #e50914' : '2px solid transparent',
            color: activeTab === 'showtimes' ? '#ffffff' : 'var(--text-muted)',
            padding: '0.8rem 1.4rem',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Calendar size={18} /> Showtimes ({showtimes.length})
        </button>
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

      {/* Tab 1: Movies Table */}
      {activeTab === 'movies' && (
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Movie</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Genre</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Duration</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Rating</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                      <img
                        src={m.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=100&q=80'}
                        alt={m.title}
                        style={{ width: '38px', height: '52px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#ffffff' }}>{m.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {m.synopsis}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span className="badge badge-genre">{m.genre}</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {m.durationMins} mins
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span className="badge badge-rating">{m.rating}</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenMovieEdit(m)}
                        className="btn btn-secondary btn-sm"
                        title="Edit Movie"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteMovie(m.id, m.title)}
                        className="btn btn-danger btn-sm"
                        title="Delete Movie"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Showtimes Table */}
      {activeTab === 'showtimes' && (
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Movie</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Theatre</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Date & Time</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Ticket Price</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {showtimes.map((st) => (
                <tr key={st.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#ffffff' }}>
                    {st.movieTitle}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {st.theatreName}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem' }}>
                    <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{st.showDate}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{st.showTime.substring(0, 5)}</div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>
                    ₹{Number(st.ticketPrice).toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenShowtimeEdit(st)}
                      className="btn btn-secondary btn-sm"
                      title="Edit Showtime"
                      style={{ marginRight: '0.5rem' }}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteShowtime(st.id)}
                      className="btn btn-danger btn-sm"
                      title="Delete Showtime"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Movie Create / Edit Modal */}
      {movieModalOpen && (
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
        }}>
          <div className="glass-panel" style={{
            maxWidth: '560px',
            width: '100%',
            padding: '2rem',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                {editingMovie ? 'Edit Movie' : 'Add New Movie'}
              </h2>
              <button
                onClick={() => setMovieModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label className="input-label">Movie Title *</label>
                <input
                  type="text"
                  required
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Gladiator II"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="input-label">Genre *</label>
                  <select
                    value={movieForm.genre}
                    onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                    className="input-field"
                  >
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Animation">Animation</option>
                    <option value="Action">Action</option>
                    <option value="Biography">Biography</option>
                    <option value="Drama">Drama</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Thriller">Thriller</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Duration (Mins) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={movieForm.durationMins}
                    onChange={(e) => setMovieForm({ ...movieForm, durationMins: parseInt(e.target.value) || 0 })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="input-label">Rating *</label>
                  <select
                    value={movieForm.rating}
                    onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                    className="input-field"
                  >
                    <option value="U">U</option>
                    <option value="U/A">U/A</option>
                    <option value="A">A</option>
                    <option value="PG-13">PG-13</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label">Poster Image URL</label>
                <input
                  type="url"
                  value={movieForm.posterUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="input-label">Synopsis</label>
                <textarea
                  rows={3}
                  value={movieForm.synopsis}
                  onChange={(e) => setMovieForm({ ...movieForm, synopsis: e.target.value })}
                  className="input-field"
                  placeholder="A brief overview of the plot..."
                />
              </div>

              <div>
                <label className="input-label">Cast Members (comma-separated)</label>
                <input
                  type="text"
                  value={movieForm.castMembers}
                  onChange={(e) => setMovieForm({ ...movieForm, castMembers: e.target.value })}
                  className="input-field"
                  placeholder="Actor 1, Actor 2, Director..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save Movie
                </button>
                <button type="button" onClick={() => setMovieModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Showtime Create / Edit Modal */}
      {showtimeModalOpen && (
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
        }}>
          <div className="glass-panel" style={{
            maxWidth: '500px',
            width: '100%',
            padding: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                {editingShowtime ? 'Edit Showtime' : 'Schedule Showtime'}
              </h2>
              <button
                onClick={() => { setShowtimeModalOpen(false); setEditingShowtime(null); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveShowtime} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label className="input-label">Select Movie *</label>
                <select
                  required
                  value={showtimeForm.movieId}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, movieId: e.target.value })}
                  className="input-field"
                >
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Theatre Name *</label>
                <input
                  type="text"
                  required
                  value={showtimeForm.theatreName}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, theatreName: e.target.value })}
                  className="input-field"
                  placeholder="e.g. PVR Cinemas IMAX, Forum Mall"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="input-label">Show Date *</label>
                  <input
                    type="date"
                    required
                    value={showtimeForm.showDate}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, showDate: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="input-label">Show Time *</label>
                  <input
                    type="time"
                    required
                    value={showtimeForm.showTime}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, showTime: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Ticket Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={showtimeForm.ticketPrice}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, ticketPrice: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingShowtime ? 'Save Changes' : 'Create Showtime'}
                </button>
                <button type="button" onClick={() => { setShowtimeModalOpen(false); setEditingShowtime(null); }} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
