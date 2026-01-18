import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getCharacters, type Character } from '../api/charactersApi';

export function CharactersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const name = searchParams.get('name') || '';
  const status = searchParams.get('status') || '';
  const page = Number(searchParams.get('page')) || 1;
  const [searchTerm, setSearchTerm] = useState(name);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounce de 500ms para búsqueda
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchParams({ name: searchTerm, status, page: '1' });
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm, status, setSearchParams]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCharacters(page, { name, status });
        setCharacters(data.results);
      } catch (err) {
        setCharacters([]);
        setError("No se encontraron personajes con estos filtros.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [name, status, page]);

  const featured = characters[0];

  return (
    <div className="app-main">
      <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo">RICKFLIX</Link>
        <nav>
          <ul className="nav-links">
            <li><Link to="/characters">Inicio</Link></li>
            <li><Link to="/favorites">Mi Lista</Link></li>
          </ul>
        </nav>
        <input 
          className="search-input" 
          placeholder="Buscar personajes..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Buscar personajes"
        />
      </header>

      {/* Hero Section */}
      {featured && !name && (
        <section style={{
          height: '70vh', width: '100vw',
          backgroundImage: `linear-gradient(to right, var(--bg) 15%, transparent), linear-gradient(to top, var(--bg), transparent), url(${featured.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center 20%',
          display: 'flex', alignItems: 'center', padding: '0 4%'
        }}>
          <div style={{ maxWidth: '600px', animation: 'fadeIn 1s ease' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', margin: 0, lineHeight: 1 }}>{featured.name}</h1>
            <p style={{ fontSize: '1.1rem', margin: '15px 0', color: 'var(--text-soft)' }}>
              <span style={{ color: 'var(--accent)' }}>98% de coincidencia</span> • {featured.species} • {featured.status}
            </p>
            <button className="btn-play" onClick={() => navigate(`/characters/${featured.id}`)}>▶ Ver Detalle</button>
          </div>
        </section>
      )}

      {/* Filtros */}
      <div style={{ padding: '40px 4% 20px', display: 'flex', gap: '15px' }}>
        <select 
          className="search-input" 
          style={{ width: '180px', cursor: 'pointer' }}
          value={status}
          onChange={(e) => setSearchParams({ name, status: e.target.value, page: '1' })}
        >
          <option value="">Todos los estados</option>
          <option value="alive">Vivo</option>
          <option value="dead">Muerto</option>
          <option value="unknown">Desconocido</option>
        </select>
      </div>

      {/* Grilla con nombres siempre visibles */}
      <div style={{ padding: '0 4% 4rem' }}>
        {loading ? (
          <div className="loading-state">Cargando dimensiones...</div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button className="btn-info" onClick={() => setSearchTerm('')}>Limpiar filtros</button>
          </div>
        ) : (
          <div className="characters-grid">
            {characters.map(c => (
              <article 
                key={c.id} 
                className="character-card" 
                onClick={() => navigate(`/characters/${c.id}`)}
                tabIndex={0}
              >
                <img src={c.image} alt={c.name} loading="lazy" />
                {/* Overlay con degradado para legibilidad del nombre */}
                <div className="card-info-overlay">
                  <div className="card-text-wrapper">
                    <h3>{c.name}</h3>
                    <div className="card-meta">
                      <span className={`status-dot ${c.status.toLowerCase()}`}></span>
                      {c.status} - {c.species}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Paginación */}
      <div className="pagination">
        <button className="btn-info" disabled={page <= 1} onClick={() => setSearchParams({ name, status, page: String(page - 1) })}>Anterior</button>
        <span className="page-indicator">Página {page}</span>
        <button className="btn-info" onClick={() => setSearchParams({ name, status, page: String(page + 1) })}>Siguiente</button>
      </div>
    </div>
  );
}