import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  NavLink,
  Link,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CharactersPage } from './pages/CharactersPage';
import { CharacterDetailPage } from './pages/CharacterDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import './App.css';

function AppLayout() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Controlar el estado del scroll para el efecto de glassmorphism en el header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-shell">
      {/* HEADER DINÁMICO ESTILO RICKFLIX */}
      <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <Link to="/" className="nav-logo">RICKFLIX</Link>
          
          <nav className="nav-links">
            <NavLink 
              to="/characters" 
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Inicio
            </NavLink>
            <NavLink 
              to="/favorites" 
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Mi Lista
            </NavLink>
          </nav>
        </div>

        {/* Espacio para perfil o buscador global si se desea */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            background: 'var(--netflix-red)', 
            borderRadius: '4px',
            cursor: 'pointer' 
          }}></div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="app-main">
        {/* Eliminamos el hero estático de aquí, ya que cada página maneja su propio Hero */}
        <Outlet />
      </main>

      <footer className="app-footer" style={{
        padding: '40px 4%',
        textAlign: 'center',
        color: 'var(--text-soft)',
        fontSize: '0.8rem',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: '50px'
      }}>
        <span>© 2026 Rick & Morty Explorer · Creado para Pink Tech Code Challenge</span>
      </footer>
    </div>
  );
}

// Configuración de Rutas
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <CharactersPage />,
      },
      {
        path: '/characters',
        element: <CharactersPage />,
      },
      {
        path: '/characters/:id',
        element: <CharacterDetailPage />,
      },
      {
        path: '/favorites',
        element: <FavoritesPage />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}