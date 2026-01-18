import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCharacters, type Character } from '../api/charactersApi';

export function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCharacters(page);
        setCharacters(data.results);
        setHasNextPage(Boolean(data.info.next));
        setHasPrevPage(Boolean(data.info.prev));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page]);

  if (loading) return <div className="app-main"><p>Cargando multiverso...</p></div>;

  if (error) {
    return (
      <div className="app-main">
        <p>Ocurrió un error: {error}</p>
        <button onClick={() => setPage(1)}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="app-main">
      

      <h2 style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>Personajes</h2>
      
      <div className="characters-grid">
        {characters.map((character) => (
          <article
            key={character.id}
            onClick={() => navigate(`/characters/${character.id}`)}
            style={{
              cursor: 'pointer',
              background: 'var(--bg-elevated)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
              transition: 'transform 0.2s ease',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ position: 'relative' }}>
              <img 
                src={character.image} 
                alt={character.name} 
                style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} 
              />
              <span style={{
                position: 'absolute', top: 10, left: 10, padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold',
                backgroundColor: character.status === 'Alive' ? '#22c55e' : character.status === 'Dead' ? '#ef4444' : '#64748b'
              }}>
                {character.status}
              </span>
            </div>
            <div style={{ padding: '12px' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {character.name}
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-soft)' }}>{character.species}</p>
            </div>
          </article>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem', paddingBottom: '2rem' }}>
        <button onClick={() => setPage(p => p - 1)} disabled={!hasPrevPage}>Anterior</button>
        <span style={{ alignSelf: 'center', fontWeight: 'bold' }}>Página {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={!hasNextPage}>Siguiente</button>
      </div>
    </div>
  );
}