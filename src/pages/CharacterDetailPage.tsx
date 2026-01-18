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
        // 1. Obtener datos del personaje (Nombre, imagen, status, etc.) 
        const data = await getCharacterById(Number(id));
        setCharacter(data);

        // 2. Resolver episodios usando la Opción A (Eficiencia) 
        const episodeIds = data.episode?.map((url) => Number(url.split('/').pop())) ?? [];
        if (episodeIds.length) {
          const eps = await getEpisodesByIds(episodeIds);
          setEpisodes(eps);
        }
      } catch (err) {
        // Manejo de errores consistente [cite: 87]
        setError("No se pudo cargar la información del personaje.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="app-main" style={{ padding: '100px 4%' }}>Cargando ficha técnica...</div>;
  if (error || !character) return <div className="app-main" style={{ padding: '100px 4%' }}>{error}</div>;

  const fav = isFavorite(character.id);

  return (
    <div className="app-main">
      {/* SECCIÓN VISUAL (HERO) */}
      <section style={{
        position: 'relative',
        height: '60vh',
        width: '100vw',
        backgroundImage: `linear-gradient(to top, var(--bg) 5%, transparent 90%), 
                          linear-gradient(to right, var(--bg) 15%, rgba(2, 6, 23, 0.6) 50%, transparent 100%), 
                          url(${character.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ padding: '0 4%', maxWidth: '800px', zIndex: 2 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-soft)', cursor: 'pointer', marginBottom: '20px' }}>
            ← Volver al listado
          </button>
          
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '900', margin: 0, color: 'var(--text)' }}>
            {character.name}
          </h1>
          
          <div style={{ display: 'flex', gap: '15px', margin: '20px 0', alignItems: 'center' }}>
            <span style={{ 
              color: character.status === 'Alive' ? 'var(--accent)' : character.status === 'Dead' ? '#e50914' : 'var(--text-soft)',
              fontWeight: 'bold' 
            }}>
              ● {character.status}
            </span>
            <span>{character.species}</span>
            <span style={{ color: 'var(--text-soft)' }}>|</span>
            <span>{character.gender}</span>
          </div>

          {/* BOTÓN DE FAVORITOS (PERSISTENCIA LOCALSTORAGE) [cite: 80, 81] */}
          <button 
            className="btn-play" 
            onClick={() => toggleFavorite(character.id)}
            style={{ 
              backgroundColor: fav ? '#e50914' : 'white', 
              color: fav ? 'white' : 'black',
              transition: 'all 0.3s ease'
            }}
          >
            {fav ? '❤️ Quitar de favoritos' : '🤍 Agregar a favoritos'}
          </button>
        </div>
      </section>

      {/* SECCIÓN INFORMATIVA (GRID) */}
      <div style={{ padding: '0 4% 4rem', marginTop: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px' }}>
          
          {/* Detalles Técnicos [cite: 64] */}
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-soft)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              Datos de Origen
            </h2>
            <div style={{ marginTop: '20px', display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ color: 'var(--text-soft)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Planeta de Origen</label>
                <p style={{ fontSize: '1.1rem', margin: '5px 0' }}>{character.origin.name}</p>
              </div>
              <div>
                <label style={{ color: 'var(--text-soft)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Ubicación Actual</label>
                <p style={{ fontSize: '1.1rem', margin: '5px 0' }}>{character.location.name}</p>
              </div>
            </div>
          </div>

          {/* Lista de Episodios (Resolución de URLs) [cite: 65, 66] */}
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-soft)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              Apariciones en Episodios
            </h2>
            <div style={{ 
              marginTop: '20px', 
              maxHeight: '450px', 
              overflowY: 'auto', 
              display: 'grid', 
              gap: '12px',
              paddingRight: '15px'
            }}>
              {episodes.map((ep) => (
                <div key={ep.id} style={{ 
                  background: 'var(--bg-elevated)', 
                  padding: '15px', 
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text)' }}>{ep.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>{ep.air_date}</div>
                  </div>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.9rem' }}>{ep.episode}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}