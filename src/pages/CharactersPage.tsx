import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCharacters, type Character } from '../api/charactersApi';

export function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getCharacters(page);
        setCharacters(data.results);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page]);

  if (loading) return <div style={{ padding: '100px', color: 'var(--accent)' }}>Cargando multiverso...</div>;
  if (error) return <div style={{ padding: '100px' }}>Error: {error}</div>;

  // Personaje destacado (Hero) - Usamos el primero de la lista
  const featured = characters[0];

  return (
    <div className="app-main">
      {/* SECCIÓN HERO CINEMATOGRÁFICA */}
      {featured && (
        <section style={{
          position: 'relative',
          height: '85vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: `linear-gradient(to right, #020617 10%, transparent 60%), 
                            linear-gradient(to top, #020617 5%, transparent 30%), 
                            url(${featured.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          marginBottom: '2rem'
        }}>
          <div style={{ padding: '0 4%', maxWidth: '800px', zIndex: 2 }}>
            <h1 style={{ 
              fontSize: 'clamp(3rem, 8vw, 5rem)', 
              margin: 0, 
              fontWeight: '900', 
              textTransform: 'uppercase',
              lineHeight: '1.1',
              textShadow: '2px 2px 10px rgba(0,0,0,0.5)'
            }}>
              {featured.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '15px 0' }}>
              <span style={{ color: '#46d369', fontWeight: 'bold', fontSize: '1.2rem' }}>98% para ti</span>
              <span style={{ color: 'var(--text-soft)' }}>{featured.species}</span>
              <span style={{ border: '1px solid var(--text-soft)', padding: '0 5px', fontSize: '0.8rem' }}>HD</span>
            </div>
            <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', textShadow: '1px 1px 5px black' }}>
              Acompaña a {featured.name} en esta aventura épica a través de dimensiones desconocidas. 
              Una producción original de la Ciudadela de Ricks.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{ 
                background: 'white', color: 'black', padding: '12px 35px', 
                fontWeight: 'bold', fontSize: '1.2rem', border: 'none', borderRadius: '4px' 
              }}>
                ▶ Reproducir
              </button>
              <button style={{ 
                background: 'rgba(109, 109, 110, 0.7)', color: 'white', padding: '12px 35px', 
                fontWeight: 'bold', fontSize: '1.2rem', border: 'none', borderRadius: '4px' 
              }}>
                ⓘ Más información
              </button>
            </div>
          </div>
        </section>
      )}

      {/* LISTA DE PERSONAJES (FILA ESTILO NETFLIX) */}
      <h2 style={{ padding: '0 4%', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '600' }}>
        Tendencias ahora
      </h2>
      
      <div className="characters-grid">
        {characters.map((character) => (
          <article
            key={character.id}
            className="character-card"
            onClick={() => navigate(`/characters/${character.id}`)}
            style={{ position: 'relative', overflow: 'visible' }}
            onMouseEnter={(e) => {
              const info = e.currentTarget.querySelector('.card-info') as HTMLElement;
              if (info) info.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              const info = e.currentTarget.querySelector('.card-info') as HTMLElement;
              if (info) info.style.opacity = '0';
            }}
          >
            <img 
              src={character.image} 
              alt={character.name} 
              style={{ 
                width: '100%', 
                borderRadius: '4px', 
                display: 'block',
                transition: 'transform 0.3s ease' 
              }} 
            />
            {/* Overlay con información que aparece al hacer hover */}
            <div 
              className="card-info"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px 10px 10px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.95))',
                opacity: 0,
                transition: 'opacity 0.3s',
                pointerEvents: 'none',
                borderRadius: '0 0 4px 4px'
              }}
            >
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
                {character.name}
              </p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--accent)' }}>
                {character.status}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* PAGINACIÓN DISCRETA ESTILO STREAMING */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '40px 0' }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ opacity: page === 1 ? 0.3 : 1 }}>
          Anterior
        </button>
        <span style={{ color: 'var(--text-soft)' }}>Página {page}</span>
        <button onClick={() => setPage(p => p + 1)}>
          Siguiente
        </button>
      </div>
    </div>
  );
}