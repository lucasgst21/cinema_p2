import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePages';
import { FilmePage } from '../pages/FilmePages';
import { SalaPage } from '../pages/SalaPages';
import { SessaoPage } from '../pages/SessaoPages';
import { LanchePage } from '../pages/LanchePages';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/filmes" element={<FilmePage />} />
            <Route path="/salas" element={<SalaPage />} />
            <Route path="/sessoes" element={<SessaoPage />} />
            <Route path="/lanches" element={<LanchePage />} />
        </Routes>
    );
};