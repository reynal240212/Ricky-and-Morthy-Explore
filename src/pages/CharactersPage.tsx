import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCharacters, type Character } from '../api/charactersApi';

export function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Detectar scroll para cambiar el header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getCharacters(page);
        setCharacters(data.results);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page]);

  if (loading && characters.length === 0) {
    return (
      <div className="app-main" style={{ padding: '100px 4%' }}>
        <div className="characters-grid">
          {[...Array(10)].map((_, i) => <div key={i} className="skeleton" />)}
        </div>
      </div>
    );
  }

  const featured = characters[0];

  return (
    <div className="app-main">
      {/* Aplicamos la clase scrolled al header que está en App.tsx o forzamos estilo aquí */}
      <style>{`
        .app-header { 
          background: ${isScrolled ? 'var(--bg)' : 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'} !important;
          padding: ${isScrolled ? '0.8rem 4%' : '1.2rem 4%'} !important;
        }
      `}</style>

      {/* SECCIÓN HERO */}
      {featured && (
        <section style={{
          position: 'relative',
          height: '85vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: `linear-gradient(to right, var(--bg) 10%, transparent 70%), 
                            linear-gradient(to top, var(--bg) 5%, transparent 30%), 
                            url(${featured.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%'
        }}>
          <div style={{ padding: '0 4%', maxWidth: '800px', zIndex: 2 }}>
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: '900', margin: 0, textTransform: 'uppercase' }}>
              {featured.name}
            </h1>
            <div style={{ display: 'flex', gap: '15px', margin: '20px 0', alignItems: 'center' }}>
              <span style={{ color: '#46d369', fontWeight: 'bold' }}>98% para ti</span>
              <span style={{ color: 'var(--text-soft)' }}>{featured.species}</span>
              <span style={{ border: '1px solid grey', padding: '0 4px', fontSize: '0.7rem' }}>HD</span>
            </div>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              Explora las dimensiones con {featured.name}. Una aventura original de Rick y Morty
              que desafía las leyes de la física y el sentido común.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button className="btn-play" onClick={() => navigate(`/characters/${featured.id}`)}>▶ Reproducir</button>
              <button className="btn-info">ⓘ Más información</button>
            </div>
          </div>
        </section>
      )}

      {/* FILA DE PERSONAJES */}
      <div style={{ position: 'relative', zIndex: 5 }}>
        <h2 style={{ padding: '0 4%', marginBottom: '15px', fontSize: '1.5rem' }}>Tendencias ahora</h2>
        <div className="characters-grid">
          {characters.map((c) => (
            <article
              key={c.id}
              className="character-card"
              onClick={() => navigate(`/characters/${c.id}`)}
            >
              <img src={c.image} alt={c.name} loading="lazy" />
              <div className="card-info">
                <p style={{ fontWeight: 'bold', margin: 0 }}>{c.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--accent)', margin: 0 }}>{c.status}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* PAGINACIÓN */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', padding: '3rem 0' }}>
        <button className="btn-info" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Anterior</button>
        <button className="btn-info" onClick={() => setPage(p => p + 1)}>Siguiente</button>
      </div>
    </div>
  );
}