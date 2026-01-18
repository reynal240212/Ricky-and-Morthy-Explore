import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  NavLink,
} from 'react-router-dom';
import { CharactersPage } from './pages/CharactersPage';
import { CharacterDetailPage } from './pages/CharacterDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import './App.css';

function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-logo">
          <div className="app-logo-badge">RM</div>
          <span>Rick &amp; Morty Explorer</span>
        </div>

        <nav className="app-nav">
          <NavLink
            to="/characters"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Personajes
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Favoritos
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <section className="hero">
          <div className="hero-content">
            <h1>Explora el multiverso</h1>
            <p>
              Descubre personajes, mundos y episodios de Rick y Morty en una
              experiencia tipo streaming.
            </p>
          </div>
        </section>

        <section className="content-section">
          <Outlet />
        </section>
      </main>

      <footer className="app-footer">
        <span>Rick &amp; Morty Explorer · Code Challenge</span>
      </footer>
    </div>
  );
}

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
