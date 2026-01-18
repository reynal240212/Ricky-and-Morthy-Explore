import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { type Character, getCharacterById } from '../api/charactersApi';
import { useFavorites } from '../hooks/useFavorites';

export function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      if (!favorites.length) {
        setCharacters([]);
        return;
      }
      
      setLoading(true);
      try {
        // Opción optimizada: Carga en paralelo
        const data = await Promise.all(
          favorites.map((id) => getCharacterById(id))
        );
        setCharacters(data);
      } catch (error) {
        console.error("Error cargando favoritos", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [favorites]);

  // Empty state con CTA "Explorar personajes"
  if (!favorites.length && !loading) {
    return (
      <div className="app-main" style={{ 
        height: '80vh', display: 'flex', flexDirection: 'column', 
        justifyContent: 'center', alignItems: 'center', textAlign: 'center' 
      }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '10px' }}>Tu lista está vacía</h1>
        <p style={{ color: 'var(--text-soft)', marginBottom: '30px', maxWidth: '500px' }}>
          Parece que aún no has guardado personajes en tus favoritos.
        </p>
        <Link to="/characters">
          <button className="btn-play">Explorar personajes</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="app-main" style={{ padding: '120px 4% 40px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Mi Lista</h1>
        <p style={{ color: 'var(--accent)', marginTop: '10px' }}>
          {characters.length} {characters.length === 1 ? 'título guardado' : 'títulos guardados'}
        </p>
      </header>

      <div className="characters-grid" style={{ marginTop: '0' }}>
        {loading && characters.length === 0 ? (
          [...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '300px' }} />)
        ) : (
          characters.map((c) => (
            <article key={c.id} className="character-card">
              <div onClick={() => navigate(`/characters/${c.id}`)}>
                <img src={c.image} alt={c.name} />
              </div>
              
              <div className="card-info-overlay">
                <div className="card-text-wrapper">
                  <h3>{c.name}</h3>
                  <button 
                    onClick={() => toggleFavorite(c.id)}
                    style={{
                      background: 'var(--netflix-red)',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      marginTop: '10px',
                      fontWeight: 'bold'
                    }}
                  >
                    ✕ Quitar
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}