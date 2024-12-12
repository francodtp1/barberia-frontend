import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Home from './pages/Home.jsx';
import ReservarTurnos from './pages/ReservarTurnos.jsx';
import AdministrarTurnos from './pages/AdministrarTurnos.jsx';

function App() {

  return (
    <Router>
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
