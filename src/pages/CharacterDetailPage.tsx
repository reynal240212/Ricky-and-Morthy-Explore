import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCharacterById, type Character } from '../api/charactersApi';
import { useFavorites } from '../hooks/useFavorites';
import { getEpisodesByIds, type Episode } from '../api/episodesApi';

export function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        setLoading(true);
        const data = await getCharacterById(Number(id));
        setCharacter(data);

        // Resolución de episodios: Extraer IDs de las URLs
        const episodeIds = data.episode?.map((url) => Number(url.split('/').pop())) ?? [];
        if (episodeIds.length) {
          const eps = await getEpisodesByIds(episodeIds);
          setEpisodes(eps);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="app-main" style={{ padding: '100px 4%' }}>Cargando multiverso...</div>;
  if (error || !character) return <div className="app-main" style={{ padding: '100px 4%' }}>Error: {error || 'No encontrado'}</div>;

  const fav = isFavorite(character.id);

  return (
    <div className="app-main">
      {/* HERO SECTION DE DETALLE */}
      <section style={{
        position: 'relative',
        height: '60vh',
        width: '100vw',
        backgroundImage: `linear-gradient(to top, var(--bg) 5%, transparent 90%), 
                          linear-gradient(to right, var(--bg) 10%, rgba(2, 6, 23, 0.7) 50%, transparent 100%), 
                          url(${character.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ padding: '0 4%', maxWidth: '800px', zIndex: 2 }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ background: 'none', border: 'none', color: 'var(--text-soft)', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            ← Volver
          </button>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '900', margin: 0 }}>{character.name}</h1>
          
          <div style={{ display: 'flex', gap: '15px', margin: '20px 0', alignItems: 'center' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{character.status}</span>
            <span style={{ color: 'var(--text-soft)' }}>•</span>
            <span>{character.species}</span>
            <span style={{ color: 'var(--text-soft)' }}>•</span>
            <span>{character.gender}</span>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              className="btn-play" 
              onClick={() => toggleFavorite(character.id)}
              style={{ backgroundColor: fav ? 'var(--netflix-red)' : 'white', color: fav ? 'white' : 'black' }}
            >
              {fav ? '❤️ En Favoritos' : '🤍 Añadir a Favoritos'}
            </button>
          </div>
        </div>
      </section>

      {/* INFORMACIÓN TÉCNICA Y EPISODIOS */}
      <div style={{ padding: '0 4% 4rem', marginTop: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          
          {/* Detalles del Personaje */}
          <section>
            <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>Sobre el personaje</h2>
            <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
              <p><strong style={{ color: 'var(--text-soft)' }}>Origen:</strong><br/>{character.origin.name}</p>
              <p><strong style={{ color: 'var(--text-soft)' }}>Última ubicación conocida:</strong><br/>{character.location.name}</p>
              <p><strong style={{ color: 'var(--text-soft)' }}>ID de Registro:</strong><br/>#{character.id}</p>
            </div>
          </section>

          {/* Lista de Episodios */}
          <section>
            <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              Episodios ({episodes.length})
            </h2>
            <div style={{ 
              marginTop: '20px', 
              maxHeight: '400px', 
              overflowY: 'auto', 
              display: 'grid', 
              gap: '10px',
              paddingRight: '10px'
            }}>
              {episodes.map((ep) => (
                <div key={ep.id} style={{ 
                  background: 'var(--bg-elevated)', 
                  padding: '12px', 
                  borderRadius: '4px',
                  borderLeft: '4px solid var(--accent)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{ep.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-soft)' }}>{ep.air_date}</div>
                  </div>
                  <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{ep.episode}</span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}