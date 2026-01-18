import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCharacters, type Character } from '../api/charactersApi';

export function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getCharacters(page);
        setCharacters(data.results);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page]);

  if (loading) return <div className="app-main">Cargando multiverso...</div>;

  return (
    <div className="app-main">
      <header className="hero-content">
        <h1>Explora el multiverso</h1>
        <p>Personajes de Rick y Morty en una experiencia fluida.</p>
      </header>

      <div className="characters-grid">
        {characters.map((char) => (
          <CharacterCard 
            key={char.id} 
            character={char} 
            onClick={() => navigate(`/characters/${char.id}`)} 
          />
        ))}
      </div>

      <div className="pagination-container">
        <button onClick={() => setPage(p => Math.max(1, p - 1))}>Anterior</button>
        <span>Página {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Siguiente</button>
      </div>
    </div>
  );
}

// Sub-componente para cumplir con "Evitar widgets tan grandes"
function CharacterCard({ character, onClick }: { character: Character, onClick: () => void }) {
  const statusClass = `status-${character.status.toLowerCase()}`;
  
  return (
    <article className="character-card" onClick={onClick}>
      <div className="card-image-container">
        <img src={character.image} alt={character.name} className="card-image" />
        <span className={`status-badge ${statusClass}`}>{character.status}</span>
      </div>
      <div className="card-content">
        <h3 className="card-title">{character.name}</h3>
        <p className="card-subtitle">{character.species}</p>
      </div>
    </article>
  );
}