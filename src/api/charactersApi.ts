// src/api/charactersApi.ts

export type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
  gender?: string;
  origin?: {
    name: string;
    url: string;
  };
  location?: {
    name: string;
    url: string;
  };
};

type CharactersResponse = {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
};

const BASE_URL = 'https://rickandmortyapi.com/api';

/**
 * Lista de personajes con paginación y filtros.
 * Soporta: page, name, status (alive, dead, unknown).
 * Ejemplo: /character?name=rick&status=alive&page=1
 */
export async function getCharacters(
  page = 1,
  options?: { name?: string; status?: string }
): Promise<CharactersResponse> {
  const params = new URLSearchParams();
  params.set('page', String(page));

  if (options?.name) {
    params.set('name', options.name);
  }
  if (options?.status && options.status !== 'all') {
    params.set('status', options.status);
  }

  const res = await fetch(`${BASE_URL}/character?${params.toString()}`);

  if (!res.ok) {
    throw new Error('Error al cargar personajes');
  }

  return res.json();
}

/**
 * Detalle de un personaje por id.
 * GET /character/{id}
 */
export async function getCharacterById(id: number): Promise<Character> {
  const res = await fetch(`${BASE_URL}/character/${id}`);

  if (!res.ok) {
    throw new Error('Error al cargar el personaje');
  }

  return res.json();
}
