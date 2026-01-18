// src/api/episodesApi.ts
const BASE_URL = 'https://rickandmortyapi.com/api';

export type Episode = {
  id: number;
  name: string;
  air_date: string;
  episode: string; // S01E01
};

export async function getEpisodesByIds(ids: number[]): Promise<Episode[]> {
  if (!ids.length) return [];

  const uniqueIds = Array.from(new Set(ids));
  const res = await fetch(`${BASE_URL}/episode/${uniqueIds.join(',')}`);

  if (!res.ok) {
    throw new Error('Error al cargar episodios');
  }

  const data = await res.json();
  // La API devuelve objeto si es 1 episodio o array si son varios
  return Array.isArray(data) ? data : [data];
}
