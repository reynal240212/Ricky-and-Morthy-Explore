import { useEffect, useState } from 'react';
import { type Character, getCharacterById } from '../api/charactersApi';
import { useFavorites } from '../hooks/useFavorites';
import { Link } from 'react-router-dom';

export function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    async function load() {
      const data = await Promise.all(
        favorites.map((id) => getCharacterById(id))
      );
      setCharacters(data);
    }

    if (favorites.length) load();
    else setCharacters([]);
  }, [favorites]);

  if (!favorites.length) {
    return (
      <div>
        <h1>Favoritos</h1>
        <p style={{ color: '#9ca3af', marginBottom: 12 }}>
          No tienes personajes guardados todavía.
        </p>
        <Link to="/characters">
          <button>Explorar personajes</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Favoritos</h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
          Tu lista de personajes guardados.
        </p>
      </section>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '20px',
          justifyItems: 'center',
        }}
      >
        {characters.map((c) => (
          <article
            key={c.id}
            style={{
              width: '100%',
              maxWidth: 210,
              background:
                'linear-gradient(145deg, rgba(15,23,42,0.95), rgba(5,46,22,0.9))',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
              border: '1px solid #1f2937',
            }}
          >
            <img
              src={c.image}
              alt={c.name}
              style={{
                width: '100%',
                display: 'block',
                aspectRatio: '3 / 4',
                objectFit: 'cover',
              }}
            />
            <div style={{ padding: '8px 10px 12px' }}>
              <p
                style={{
                  fontSize: '0.95rem',
                  margin: 0,
                  marginBottom: 4,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {c.name}
              </p>
              <button onClick={() => toggleFavorite(c.id)}>Quitar</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
