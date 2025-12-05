import { Link } from 'react-router-dom';

export const HomePage = () => (
    <div className="container text-center mt-5">
        <div className="card p-5 shadow-sm">
            <h1 className="display-4">🎬 Bem-vindo ao CineWeb</h1>
            <p className="lead mt-3">Sistema de gerenciamento de cinema.</p>
            <hr className="my-4" />
            <p>Utilize a barra de navegação para acessar os módulos.</p>
            <div className="d-flex justify-content-center gap-3">
                <Link to="/filmes" className="btn btn-primary btn-lg">Gerenciar Filmes</Link>
                <Link to="/sessoes" className="btn btn-outline-dark btn-lg">Vender Ingressos</Link>
            </div>
        </div>
    </div>
);