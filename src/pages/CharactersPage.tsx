import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCharacters, type Character } from '../api/charactersApi';

export function CharactersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Estados de datos
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Parámetros de la URL (Requerimiento )
  const nameQuery = searchParams.get('name') || '';
  const statusQuery = searchParams.get('status') || '';
  const pageQuery = Number(searchParams.get('page')) || 1;

  // Estado local para el input (Debounce)
  const [searchTerm, setSearchTerm] = useState(nameQuery);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Implementación de Debounce para búsqueda 
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchParams({ name: searchTerm, status: statusQuery, page: '1' });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCharacters(pageQuery, { name: nameQuery, status: statusQuery });
        setCharacters(data.results);
      } catch (err) {
        setCharacters([]);
        setError("No se encontraron personajes que coincidan con la búsqueda."); // Requerimiento 
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [nameQuery, statusQuery, pageQuery]);

  const featured = characters[0];

  return (
    <div className="app-main">
      <style>{`
        .app-header { background: ${isScrolled ? 'var(--bg)' : 'transparent'}; }
        .filter-bar {
          padding: 20px 4%;
          display: flex;
          gap: 15px;
          position: sticky;
          top: 70px;
          z-index: 100;
          background: linear-gradient(to bottom, var(--bg), transparent);
        }
        .search-input {
          background: rgba(255,255,255,0.1);
          border: 1px solid var(--border-subtle);
          color: white;
          padding: 10px;
          border-radius: 4px;
          flex: 1;
        }
        .status-select {
          background: #0f172a;
          color: white;
          border: 1px solid var(--border-subtle);
          padding: 10px;
          border-radius: 4px;
        }
      `}</style>

      {/* HERO SECTION */}
      {featured && !nameQuery && (
        <section style={{
          height: '80vh',
          width: '100vw',
          backgroundImage: `linear-gradient(to right, var(--bg) 10%, transparent 70%), url(${featured.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{ padding: '0 4%', maxWidth: '800px' }}>
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: '900', margin: 0 }}>{featured.name}</h1>
            <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>Destacado de hoy • {featured.species} • HD</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button className="btn-play" onClick={() => navigate(`/characters/${featured.id}`)}>Ver detalle</button>
            </div>
          </div>
        </section>
      )}

      {/* BARRA DE BÚSQUEDA Y FILTROS [cite: 33, 46, 47] */}
      <div className="filter-bar">
        <input 
          className="search-input"
          placeholder="Buscar por nombre (Rick, Morty...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="status-select"
          value={statusQuery}
          onChange={(e) => setSearchParams({ name: nameQuery, status: e.target.value, page: '1' })}
        >
          <option value="">Todos los estados</option>
          <option value="alive">Vivo</option>
          <option value="dead">Muerto</option>
          <option value="unknown">Desconocido</option>
        </select>
      </div>

      {/* GRILLA DE CONTENIDO */}
      <div style={{ padding: '0 4% 4rem' }}>
        <h2 style={{ marginBottom: '20px' }}>{nameQuery ? `Resultados para "${nameQuery}"` : 'Tendencias ahora'}</h2>
        
        {loading ? (
          <div className="characters-grid">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{height: '180px'}} />)}
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p style={{ color: 'var(--text-soft)' }}>{error}</p>
            <button className="btn-info" onClick={() => setSearchTerm('')}>Limpiar filtros</button>
          </div>
        ) : (
          <div className="characters-grid">
            {characters.map((c) => (
              <article key={c.id} className="character-card" onClick={() => navigate(`/characters/${c.id}`)}>
                <img src={c.image} alt={c.name} />
                <div className="card-info">
                  <p style={{ fontWeight: 'bold', margin: 0 }}>{c.name}</p>
                  <p style={{ color: 'var(--accent)', margin: 0, fontSize: '0.8rem' }}>{c.status} - {c.species}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* PAGINACIÓN  */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', paddingBottom: '100px' }}>
        <button 
          className="btn-info" 
          disabled={pageQuery <= 1}
          onClick={() => setSearchParams({ name: nameQuery, status: statusQuery, page: String(pageQuery - 1) })}
        >
          Anterior
        </button>
        <span style={{ alignSelf: 'center' }}>Página {pageQuery}</span>
        <button 
          className="btn-info"
          onClick={() => setSearchParams({ name: nameQuery, status: statusQuery, page: String(pageQuery + 1) })}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}