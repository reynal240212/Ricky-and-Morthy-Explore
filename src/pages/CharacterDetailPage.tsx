import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCharacterById, type Character } from '../api/charactersApi';
import { getEpisodesByIds, type Episode } from '../api/episodesApi';
import { useFavorites } from '../hooks/useFavorites';

export function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [character, setCharacter] = useState<Character | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getCharacterById(Number(id));
        setCharacter(data);

        // Requerimiento: Resolver episodios de forma eficiente (Opción A)
        const epIds = data.episode.map(url => Number(url.split('/').pop()));
        const eps = await getEpisodesByIds(epIds);
        setEpisodes(eps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div style={{ padding: '100px 4%' }}>Analizando ADN del personaje...</div>;
  if (!character) return <div style={{ padding: '100px 4%' }}>Personaje no encontrado.</div>;

  return (
    <div className="app-main">
      <section style={{
        height: '65vh', width: '100vw',
        backgroundImage: `linear-gradient(to top, var(--bg), transparent), linear-gradient(to right, var(--bg) 20%, transparent), url(${character.image})`,
        backgroundSize: 'cover', backgroundPosition: 'center 20%',
        display: 'flex', alignItems: 'center', padding: '0 4%'
      }}>
        <div style={{ maxWidth: '800px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-soft)', cursor: 'pointer', marginBottom: '20px' }}>← Volver</button>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', margin: 0 }}>{character.name}</h1>
          <p style={{ color: 'var(--accent)', fontWeight: 'bold', margin: '15px 0' }}>{character.status} • {character.species} • {character.gender}</p>
          
          <button 
            className="btn-play" 
            style={{ backgroundColor: isFavorite(character.id) ? 'var(--netflix-red)' : 'white', color: isFavorite(character.id) ? 'white' : 'black' }}
            onClick={() => toggleFavorite(character.id)}
          >
            {isFavorite(character.id) ? '❤️ Quitar de favoritos' : '🤍 Añadir a favoritos'}
          </button>
        </div>
      </section>

      <div style={{ padding: '40px 4%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px' }}>
        <div>
          <h2 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', color: 'var(--text-soft)' }}>Detalles Técnicos</h2>
          <div style={{ marginTop: '20px' }}>
            <p><strong>Origen:</strong> {character.origin.name}</p>
            <p><strong>Ubicación Actual:</strong> {character.location.name}</p>
          </div>
        </div>
        <div>
          <h2 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', color: 'var(--text-soft)' }}>Apariciones ({episodes.length})</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '20px' }}>
            {episodes.map(ep => (
              <div key={ep.id} style={{ padding: '12px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{ep.name}</span>
                <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{ep.episode}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}