import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCharacterById, type Character } from '../api/charactersApi';
import { useFavorites } from '../hooks/useFavorites';

export function CharacterDetailPage() {
  const { id } = useParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (id) getCharacterById(Number(id)).then(setCharacter);
  }, [id]);

  if (!character) return <div className="app-main">Cargando...</div>;

  return (
    <div className="app-main">
      <div className="detail-layout">
        <img src={character.image} alt={character.name} className="detail-image" />
        
        <div className="detail-info">
          <h1>{character.name}</h1>
          <p className="detail-meta">{character.species} · {character.status}</p>
          
          <div className="info-grid">
            <InfoBox label="Origen" value={character.origin?.name} />
            <InfoBox label="Localización" value={character.location?.name} />
          </div>

          <button 
            className={isFavorite(character.id) ? 'btn-danger' : 'btn-primary'}
            onClick={() => toggleFavorite(character.id)}
          >
            {isFavorite(character.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string, value?: string }) {
  return (
    <div className="info-box">
      <span className="info-label">{label}</span>
      <p className="info-value">{value || 'Desconocido'}</p>
    </div>
  );
}