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

  // Parámetros de la URL
  const name = searchParams.get('name') || '';
  const status = searchParams.get('status') || '';
  const page = Number(searchParams.get('page')) || 1;
  const [searchTerm, setSearchTerm] = useState(name);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Requerimiento: Debounce en búsqueda (500ms)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchParams({ name: searchTerm, status, page: '1' });
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

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
        <nav><ul className="nav-links">
          <li><Link to="/characters">Inicio</Link></li>
          <li><Link to="/favorites">Mi Lista</Link></li>
        </ul></nav>
        <input 
          className="search-input" 
          placeholder="Buscar personajes..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>

      {/* Hero Section */}
      {featured && !name && (
        <section style={{
          height: '85vh', width: '100vw',
          backgroundImage: `linear-gradient(to right, var(--bg) 10%, transparent), linear-gradient(to top, var(--bg), transparent), url(${featured.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center 20%',
          display: 'flex', alignItems: 'center', padding: '0 4%'
        }}>
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', margin: 0 }}>{featured.name}</h1>
            <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>{featured.species} • {featured.status} • HD</p>
            <button className="btn-play" onClick={() => navigate(`/characters/${featured.id}`)}>Ver Detalle</button>
          </div>
        </section>
      )}

      {/* Filtros */}
      <div style={{ padding: '40px 4% 20px' }}>
        <select 
          className="search-input" 
          style={{ width: '200px' }}
          value={status}
          onChange={(e) => setSearchParams({ name, status: e.target.value, page: '1' })}
        >
          <option value="">Todos los estados</option>
          <option value="alive">Vivo</option>
          <option value="dead">Muerto</option>
          <option value="unknown">Desconocido</option>
        </select>
      </div>

      {/* Grilla de Personajes */}
      <div style={{ padding: '0 4% 4rem' }}>
        {error ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>{error}</div>
        ) : (
          <div className="characters-grid">
            {characters.map(c => (
              <article key={c.id} className="character-card" onClick={() => navigate(`/characters/${c.id}`)}>
                <img src={c.image} alt={c.name} />
                <div className="card-info">
                  <p style={{ fontWeight: 'bold', margin: 0 }}>{c.name}</p>
                  <p style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>{c.status}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Paginación */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', paddingBottom: '100px' }}>
        <button className="btn-info" disabled={page <= 1} onClick={() => setSearchParams({ name, status, page: String(page - 1) })}>Anterior</button>
        <button className="btn-info" onClick={() => setSearchParams({ name, status, page: String(page + 1) })}>Siguiente</button>
      </div>
    </div>
  );
}