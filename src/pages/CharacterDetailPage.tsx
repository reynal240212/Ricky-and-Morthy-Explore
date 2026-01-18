import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCharacterById, type Character } from '../api/charactersApi';
import { useFavorites } from '../hooks/useFavorites';

export function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCharacterById(Number(id));
        setCharacter(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <p>Cargando personaje...</p>;
  if (error) return <p>Ocurrió un error: {error}</p>;
  if (!character) return <p>No se encontró el personaje.</p>;

  const fav = isFavorite(character.id);

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 260px) minmax(0, 1fr)',
          gap: 24,
          alignItems: 'flex-start',
        }}
      >
        <div>
          <img
            src={character.image}
            alt={character.name}
            style={{
              width: '100%',
              borderRadius: 16,
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}
          />
        </div>

        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 8 }}>
            {character.name}
          </h1>
          <p style={{ color: '#9ca3af', marginBottom: 16 }}>
            {character.species} · {character.status}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                backgroundColor: '#020617',
                padding: 12,
                borderRadius: 10,
                border: '1px solid #1f2937',
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  marginBottom: 4,
                }}
              >
                Origen
              </p>
              <p style={{ margin: 0 }}>{character.origin?.name}</p>
            </div>

            <div
              style={{
                backgroundColor: '#020617',
                padding: 12,
                borderRadius: 10,
                border: '1px solid #1f2937',
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  marginBottom: 4,
                }}
              >
                Última localización
              </p>
              <p style={{ margin: 0 }}>{character.location?.name}</p>
            </div>
          </div>

          <button onClick={() => toggleFavorite(character.id)}>
            {fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          </button>
        </div>
      </div>
    </div>
  );
}
