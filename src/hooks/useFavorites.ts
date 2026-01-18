import { useEffect, useState } from 'react';

const STORAGE_KEY = 'rm_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as number[];
      if (Array.isArray(parsed)) {
        setFavorites(parsed);
      }
    } catch {
      // ignorar errores de parseo
    }
  }, []);

  function save(ids: number[]) {
    setFavorites(ids);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }

  function toggleFavorite(id: number) {
    save(
      favorites.includes(id)
        ? favorites.filter((x) => x !== id)
        : [...favorites, id]
    );
  }

  function isFavorite(id: number) {
    return favorites.includes(id);
  }

  return { favorites, toggleFavorite, isFavorite };
}
