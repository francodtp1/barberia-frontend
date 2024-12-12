import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Loader from './libs/Loader.jsx';
import { useState, useEffect } from 'react';
import Home from './pages/Home.jsx';
import ReservarTurnos from './pages/ReservarTurnos.jsx';
import AdministrarTurnos from './pages/AdministrarTurnos.jsx';

function App() {
  const [loading, setLoading] = useState(true); // Estado para controlar si el loader se muestra

  useEffect(() => {
    // Simulamos un tiempo de carga, por ejemplo, cuando se cargan los datos o se hace una solicitud a la API
    setTimeout(() => {
      setLoading(false); // Después de 3 segundos, dejamos de mostrar el loader
    }, 800);
  }, []);

  return (
    <Router>
      {loading && <Loader />}
      <div className="overlay"></div>
      <div className="container">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reservarTurnos" element={<ReservarTurnos />} />
          <Route path="/administrarTurnos" element={<AdministrarTurnos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
