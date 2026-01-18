import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCharacters, type Character } from '../api/charactersApi';

export function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getCharacters(page);
      setCharacters(data.results);
      setLoading(false);
    }
    load();
  }, [page]);

  if (loading && characters.length === 0) return <div style={{ padding: '100px' }}>Cargando...</div>;

  const featured = characters[0];

  return (
    <div className="app-main">
      <style>{`
        .app-header { background: ${isScrolled ? 'var(--bg)' : 'transparent'}; }
      `}</style>

      {/* HERO SECTION - 100% ANCHO */}
      {featured && (
        <section style={{
          height: '85vh',
          width: '100vw',
          backgroundImage: `linear-gradient(to right, var(--bg) 10%, transparent 70%), 
                            linear-gradient(to top, var(--bg) 5%, transparent 30%), 
                            url(${featured.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{ padding: '0 4%', maxWidth: '800px' }}>
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: '900', margin: 0 }}>{featured.name}</h1>
            <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>98% para ti • {featured.species} • HD</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button className="btn-play" onClick={() => navigate(`/characters/${featured.id}`)}>▶ Reproducir</button>
              <button className="btn-info">ⓘ Más información</button>
            </div>
          </div>
        </section>
      )}

      {/* GRILLA DE CONTENIDO */}
      <div style={{ position: 'relative', zIndex: 5 }}>
        <h2 style={{ padding: '0 4%', marginBottom: '15px' }}>Tendencias ahora</h2>
        <div className="characters-grid">
          {characters.map((c) => (
            <article key={c.id} className="character-card" onClick={() => navigate(`/characters/${c.id}`)}>
              <img src={c.image} alt={c.name} />
              <div className="card-info">
                <p style={{ fontWeight: 'bold', margin: 0 }}>{c.name}</p>
                <p style={{ color: 'var(--accent)', margin: 0, fontSize: '0.8rem' }}>{c.status}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', paddingBottom: '50px' }}>
        <button className="btn-info" onClick={() => setPage(p => p - 1)} disabled={page === 1}>Anterior</button>
        <button className="btn-info" onClick={() => setPage(p => p + 1)}>Siguiente</button>
      </div>
    </div>
  );
}