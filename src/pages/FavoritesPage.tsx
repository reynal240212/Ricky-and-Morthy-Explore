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
        // Obtenemos todos los personajes favoritos en paralelo
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

  // Requerimiento: Empty state con CTA "Explorar personajes" 
  if (!favorites.length && !loading) {
    return (
      <div className="app-main" style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 4%'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Tu lista está vacía</h1>
        <p style={{ color: 'var(--text-soft)', marginBottom: '30px', maxWidth: '500px' }}>
          Parece que aún no has guardado a ningún personaje del multiverso en tus favoritos.
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
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Mis Favoritos</h1>
        <p style={{ color: 'var(--accent)', marginTop: '10px' }}>
          {characters.length} {characters.length === 1 ? 'personaje guardado' : 'personajes guardados'}
        </p>
      </header>

      {loading && characters.length === 0 ? (
        <div className="characters-grid">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{height: '180px'}} />)}
        </div>
      ) : (
        <div className="characters-grid">
          {characters.map((c) => (
            <article key={c.id} className="character-card">
              {/* Al hacer clic en la imagen vamos al detalle */}
              <div onClick={() => navigate(`/characters/${c.id}`)}>
                <img src={c.image} alt={c.name} />
              </div>
              
              <div className="card-info" style={{ opacity: 1, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 10px 0', fontSize: '0.9rem' }}>{c.name}</p>
                {/* Requerimiento: Permitir quitar favoritos desde la lista  */}
                <button 
                  onClick={() => toggleFavorite(c.id)}
                  style={{
                    background: '#e50914',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Quitar de mi lista
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}