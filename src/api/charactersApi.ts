export type Character = {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  image: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  episode: string[];
};

type CharactersResponse = {
  info: { count: number; pages: number; next: string | null; prev: string | null };
  results: Character[];
};

const BASE_URL = 'https://rickandmortyapi.com/api';

export async function getCharacters(
  page = 1,
  options?: { name?: string; status?: string }
): Promise<CharactersResponse> {
  const params = new URLSearchParams();
  params.set('page', String(page));

  if (options?.name) params.set('name', options.name);
  if (options?.status && options.status !== '') params.set('status', options.status);

  const res = await fetch(`${BASE_URL}/character?${params.toString()}`);
  if (!res.ok) throw new Error('No se encontraron personajes');
  return res.json();
}

export async function getCharacterById(id: number): Promise<Character> {
  const res = await fetch(`${BASE_URL}/character/${id}`);
  if (!res.ok) throw new Error('Error al cargar el detalle');
  return res.json();
}