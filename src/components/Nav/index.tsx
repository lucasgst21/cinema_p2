import { Link } from 'react-router-dom';

export const Nav = () => (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
            <Link className="navbar-brand" to="/">CineWeb</Link>
            <div className="navbar-nav">
                <Link className="nav-link" to="/filmes">Filmes</Link>
                <Link className="nav-link" to="/salas">Salas</Link>
                <Link className="nav-link" to="/sessoes">Sessões</Link>
                <Link className="nav-link" to="/lanches">Lanches</Link>
            </div>
        </div>
    </nav>
);