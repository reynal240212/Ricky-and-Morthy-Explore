import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCharacterById, type Character } from '../api/charactersApi';

export function CharacterDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [episodes, setEpisodes] = useState<{name: string, episode: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const charData = await getCharacterById(Number(id));
        setCharacter(charData);

        // Opción A: Obtener episodios en lote
        const episodeIds = charData.episode.map(url => url.split('/').pop());
        const res = await fetch(`https://rickandmortyapi.com/api/episode/${episodeIds.join(',')}`);
        const episodesData = await res.json();
        
        // Manejar si es un solo episodio o un array
        setEpisodes(Array.isArray(episodesData) ? episodesData : [episodesData]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <div className="loading-state">Cargando multiverso...</div>;
  if (!character) return <div>Personaje no encontrado</div>;

  return (
    <div className="detail-page">
      <div className="detail-hero" style={{ 
        backgroundImage: `linear-gradient(to top, var(--bg) 10%, transparent), url(${character.image})` 
      }}>
        <div className="detail-hero-content">
          <button className="btn-info" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>← Volver</button>
          <h1>{character.name}</h1>
          <div className="card-meta">
            <span className={`status-dot ${character.status.toLowerCase()}`}></span>
            {character.status} • {character.species} • {character.gender}
          </div>
        </div>
      </div>

      <div style={{ padding: '40px 4%' }}>
        <h2>Episodios donde aparece</h2>
        <div className="episodes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
          {episodes.map((ep, i) => (
            <div key={i} className="episode-card" style={{ 
              background: 'var(--bg-elevated)', 
              padding: '15px', 
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}>
              <p style={{ margin: 0, color: 'var(--accent)', fontSize: '0.8rem' }}>{ep.episode}</p>
              <p style={{ margin: '5px 0 0', fontWeight: 'bold' }}>{ep.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}