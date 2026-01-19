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

  // Efecto de Scroll para el Header dinámico
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounce para búsqueda
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm !== name) {
        setSearchParams({ name: searchTerm, status, page: '1' });
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm, status, setSearchParams, name]);

  // Carga de datos
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCharacters(page, { name, status });
        setCharacters(data.results);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setCharacters([]);
        setError("No hay personajes en esta dimensión.");
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
            <li><Link to="/characters" className={!name && !status ? 'active' : ''}>Inicio</Link></li>
            <li><Link to="/favorites">Mi Lista</Link></li>
          </ul>
        </nav>
        <input 
          className="search-input" 
          placeholder="Buscar personajes..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>

      {/* Hero Section */}
      {featured && !name && page === 1 && (
        <section style={{
          height: '75vh', width: '100vw',
          backgroundImage: `linear-gradient(to right, var(--bg) 15%, transparent), linear-gradient(to top, var(--bg), transparent), url(${featured.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center 20%',
          display: 'flex', alignItems: 'center', padding: '0 4%'
        }}>
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', margin: 0 }}>{featured.name}</h1>
            <p style={{ margin: '15px 0', color: 'var(--text-soft)' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>98% de coincidencia</span> • {featured.status} • {featured.species}
            </p>
            <button className="btn-play" onClick={() => navigate(`/characters/${featured.id}`)}>
              ▶ Ver Detalle
            </button>
          </div>
        </section>
      )}

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

      <div className="characters-grid">
        {loading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px' }}>Cargando dimensiones...</div>
        ) : error ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px' }}>{error}</div>
        ) : (
          characters.map(c => (
            <article key={c.id} className="character-card" onClick={() => navigate(`/characters/${c.id}`)}>
              <img src={c.image} alt={c.name} loading="lazy" />
              <div className="card-info-overlay">
                <h3>{c.name}</h3>
                <div className="card-meta">{c.status} - {c.species}</div>
              </div>
            </article>
          ))
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', paddingBottom: '50px', alignItems: 'center' }}>
        <button 
          className="btn-play" 
          style={{ padding: '8px 20px' }} 
          disabled={page <= 1} 
          onClick={() => setSearchParams({ name, status, page: String(page - 1) })}
        >
          Anterior
        </button>
        <span style={{ fontWeight: 'bold' }}>Página {page}</span>
        <button 
          className="btn-play" 
          style={{ padding: '8px 20px' }} 
          onClick={() => setSearchParams({ name, status, page: String(page + 1) })}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}