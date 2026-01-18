import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  NavLink,
  Link,
  ScrollRestoration
} from 'react-router-dom';
import { useEffect, useState } from 'react';

// Importaciones de componentes
import { CharactersPage } from './pages/CharactersPage';
import { CharacterDetailPage } from './pages/CharacterDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';

// Estilos globales
import './App.css';

/**
 * Layout principal que envuelve toda la aplicación.
 * Mantiene el Header y Footer constantes.
 */
function AppLayout() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Optimizamos el cambio de estado solo cuando cruza el umbral
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-shell">
      {/* ScrollRestoration asegura que al navegar el scroll vuelva arriba automáticamente */}
      <ScrollRestoration />

      <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-left">
          <Link to="/" className="nav-logo">RICKFLIX</Link>
          
          <nav className="nav-links" aria-label="Navegación principal">
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

        <div className="header-right">
          <div className="profile-badge" title="Usuario">RM</div>
        </div>
      </header>

      <main className="app-main" role="main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2026 Rick & Morty Explorer · Pink Tech Challenge</p>
          <p className="footer-sub">Barranquilla, Colombia</p>
        </div>
      </footer>
    </div>
  );
}

// Configuración de Rutas con manejo de "/" y "/characters"
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true, // Esto hace que "/" cargue CharactersPage
        element: <CharactersPage />,
      },
      {
        path: 'characters',
        element: <CharactersPage />,
      },
      {
        path: 'characters/:id',
        element: <CharacterDetailPage />,
      },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
      {
        path: '*', // Catch-all para rutas no existentes
        element: <div className="error-page"><h1>404 - Portal Cerrado</h1><Link to="/">Volver al inicio</Link></div>
      }
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}