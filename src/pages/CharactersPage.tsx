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

  // Requerimiento: Los filtros deben reflejarse en la URL [cite: 50]
  const name = searchParams.get('name') || '';
  const status = searchParams.get('status') || '';
  const page = Number(searchParams.get('page')) || 1;
  const [searchTerm, setSearchTerm] = useState(name);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Requerimiento: Debounce en búsqueda de 500ms 
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Actualiza la URL, lo que dispara el useEffect de carga de datos
      setSearchParams({ name: searchTerm, status, page: '1' });
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm, status, setSearchParams]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Endpoint: GET /character/?name=rick&status=alive&page=1 [cite: 53]
        const data = await getCharacters(page, { name, status });
        setCharacters(data.results);
      } catch (err) {
        setCharacters([]);
        // Requerimiento: Manejo de errores consistente [cite: 87]
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
          aria-label="Buscar personajes" // Requerimiento: Accesibilidad 
        />
      </header>

      {/* Hero Section - Solo se muestra si no hay búsqueda activa */}
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

      {/* Filtros de estado [cite: 47] */}
      <div style={{ padding: '40px 4% 20px' }}>
        <select 
          className="search-input" 
          style={{ width: '200px' }}
          value={status}
          onChange={(e) => setSearchParams({ name, status: e.target.value, page: '1' })}
          aria-label="Filtrar por estado"
        >
          <option value="">Todos los estados</option>
          <option value="alive">Vivo</option>
          <option value="dead">Muerto</option>
          <option value="unknown">Desconocido</option>
        </select>
      </div>

      {/* Grilla de Personajes con Estados de UI [cite: 26] */}
      <div style={{ padding: '0 4% 4rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>Cargando multiverso...</div> // Requerimiento: Loading [cite: 29]
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>{error}</p>
            <button className="btn-info" onClick={() => setSearchTerm('')}>Reintentar</button> {/* Requerimiento: Error [cite: 30] */}
          </div>
        ) : characters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>No hay resultados.</div> // Requerimiento: Empty state [cite: 31]
        ) : (
          <div className="characters-grid">
            {characters.map(c => (
              <article 
                key={c.id} 
                className="character-card" 
                onClick={() => navigate(`/characters/${c.id}`)}
                tabIndex={0} // Requerimiento: Navegación por teclado 
              >
                <img src={c.image} alt={c.name} /> {/* Requerimiento: Alt en imágenes  */}
                <div className="card-info">
                  <p style={{ fontWeight: 'bold', margin: 0 }}>{c.name}</p>
                  <p style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>{c.status} - {c.species}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Paginación funcional [cite: 25] */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', paddingBottom: '100px' }}>
        <button 
          className="btn-info" 
          disabled={page <= 1} 
          onClick={() => setSearchParams({ name, status, page: String(page - 1) })}
        >
          Anterior
        </button>
        <span style={{ alignSelf: 'center' }}>Página {page}</span>
        <button 
          className="btn-info" 
          onClick={() => setSearchParams({ name, status, page: String(page + 1) })}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}