import { BrowserRouter } from 'react-router-dom';
import { Nav } from './components/Nav';
import { AppRoutes } from './routers/app.routers';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;