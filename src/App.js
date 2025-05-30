import React, { useState } from 'react';

const TMDB_API_KEY = 'a07e22bc18f5cb106bfe4cc1f83ad8ed';
const TMDB_API_BASE = 'https://api.themoviedb.org/3';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState(null); // null means no search yet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearchSubmit(e) {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
    setLoading(true);
    setError(null);
    setMovies([]);
    try {
      const res = await fetch(
        `${TMDB_API_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          trimmedQuery
        )}&language=en-US&page=1&include_adult=false`
      );
      if (!res.ok) throw new Error('Failed to load search results');
      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      setError('Failed to load search results.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      fontFamily: "'Roboto', sans-serif",
      background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
      minHeight: '100vh',
      color: '#f0f0f3',
      padding: '3rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <header style={{
        marginBottom: '3rem',
        textAlign: 'center',
        textShadow: '0 0 6px rgba(250, 204, 21, 0.7)',
      }}>
        <h1 style={{
          color: '#facc15',
          fontSize: '3rem',
          fontWeight: '700',
          letterSpacing: '0.05em',
          marginBottom: '0.3rem',
        }}>ElieMovies</h1>
        <p style={{ color: '#d0d6db', fontSize: '1.5rem' }}>Search your favorite movie</p>
      </header>

      <form
        onSubmit={handleSearchSubmit}
        style={{
          maxWidth: 600,
          width: '100%',
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '3rem',
          boxShadow: '0 4px 12px rgba(250, 204, 21, 0.3)',
          borderRadius: '0.5rem',
          backgroundColor: '#152d35',
          padding: '0.5rem',
        }}
      >
        <input
          type="text"
          placeholder="Search for movies..."
          aria-label="Search movies"
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flexGrow: 1,
            padding: '0.75rem 1rem',
            fontSize: '1.125rem',
            borderRadius: '0.5rem',
            border: 'none',
            outline: 'none',
            backgroundColor: '#203a43',
            color: '#f0f0f3',
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.5)',
            transition: 'background-color 0.3s ease',
          }}
          onFocus={e => e.currentTarget.style.backgroundColor = '#2c5364'}
          onBlur={e => e.currentTarget.style.backgroundColor = '#203a43'}
        />
        <button
          type="submit"
          aria-label="Search"
          style={{
            backgroundColor: '#facc15',
            border: 'none',
            padding: '0 1.5rem',
            cursor: 'pointer',
            borderRadius: '0.5rem',
            color: '#121212',
            fontSize: '1.5rem',
            fontWeight: '700',
            boxShadow: '0 4px 10px rgba(250, 204, 21, 0.6)',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#d4ac0d';
            e.currentTarget.style.boxShadow = '0 6px 14px rgba(212, 172, 13, 0.8)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#facc15';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(250, 204, 21, 0.6)';
          }}
        >
          <i className="fas fa-search" aria-hidden="true"></i>
        </button>
      </form>

      <section
        aria-live="polite"
        aria-atomic="true"
        style={{
          maxWidth: 1200,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          paddingBottom: '4rem',
        }}
      >
        {loading && (
          <p style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            color: '#d0d6db',
            fontSize: '1.25rem',
            fontWeight: '600',
            textShadow: '0 0 20px #facc15',
          }}>
            Loading...
          </p>
        )}
        {error && (
          <p style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            color: '#e74c3c',
            fontSize: '1.2rem',
            fontWeight: '600',
            textShadow: '0 0 8px #e74c3c',
          }}>
            {error}
          </p>
        )}
        {movies && !loading && !error && movies.length === 0 && (
          <p style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            color: '#abb7c4',
            fontSize: '1.125rem',
            fontWeight: '600',
            textShadow: '0 0 8px #667083',
          }}>
            No movies found. Try another search.
          </p>
        )}
        {movies && !loading && !error && movies.map((movie) => {
          const poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://placehold.co/500x750/png?text=No+Image+Available';
          return (
            <div
              key={movie.id}
              tabIndex="0"
              role="button"
              aria-pressed="false"
              aria-label={`Watch ${movie.title}`}
              style={{
                backgroundColor: '#213b47',
                borderRadius: '1rem',
                overflow: 'hidden',
                cursor: 'default',
                display: 'flex',
                flexDirection: 'column',
                outline: 'none',
                boxShadow: '0 0 24px rgba(250, 204, 21, 0.5)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onClick={e => e.preventDefault()}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.07)';
                e.currentTarget.style.boxShadow = '0 0 38px rgba(250, 204, 21, 0.85)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 24px rgba(250, 204, 21, 0.5)';
              }}
            >
              <img
                src={poster}
                alt={`Movie poster of ${movie.title}, released in ${
                  movie.release_date ? movie.release_date.slice(0, 4) : 'unknown year'
                }`}
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  borderBottom: '3px solid #facc15',
                  borderTopLeftRadius: '1rem',
                  borderTopRightRadius: '1rem',
                  filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.7))',
                }}
              />
              <div style={{
                padding: '1rem 1.25rem',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: '#f0f0f3',
                textShadow: '0 0 3px rgba(0,0,0,0.7)',
              }}>
                <h3 style={{
                  margin: 0,
                  marginBottom: '0.75rem',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: '#facc15',
                  letterSpacing: '0.03em',
                }} title={movie.title}>
                  {movie.title}
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: '#d8d8d8',
                  flexGrow: 1,
                  lineHeight: '1.3',
                  fontStyle: 'italic',
                }}>
                  {movie.overview
                    ? movie.overview.length > 120
                      ? movie.overview.slice(0, 120) + '...'
                      : movie.overview
                    : 'No description available.'}
                </p>
                <p style={{
                  fontSize: '0.8rem',
                  color: '#ccc',
                  marginTop: '1rem',
                  fontWeight: '600',
                }}>
                  Release: {movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* FontAwesome CDN for icons */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        crossOrigin="anonymous"
      />
    </div>
  );
}

