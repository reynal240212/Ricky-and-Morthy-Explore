// src/api/charactersApi.ts

export type Character = {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown'; // Tipado más estricto según la API [cite: 48]
  species: string;
  image: string;
  gender: string; // Requerido para el detalle [cite: 64]
  origin: {       // Quitamos el '?' para evitar errores de undefined [cite: 64]
    name: string;
    url: string;
  };
  location: {     // Requerido para evidenciar lógica de solución [cite: 18, 64]
    name: string;
    url: string;
  };
  episode: string[]; // ¡ESTA ES LA CLAVE! Resuelve el error de la imagen [cite: 66, 72]
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
 * Lista de personajes con paginación y filtros. [cite: 25, 33]
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
    // Manejo de errores consistente como pide el challenge [cite: 87]
    throw new Error('No se encontraron personajes con esos filtros');
  }

  return res.json();
}

/**
 * Detalle de un personaje por id. [cite: 55, 70]
 */
export async function getCharacterById(id: number): Promise<Character> {
  const res = await fetch(`${BASE_URL}/character/${id}`);

  if (!res.ok) {
    throw new Error('Error al cargar el detalle del personaje');
  }

  return res.json();
}