import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Home from './pages/Home.jsx';
import ReservarTurnos from './pages/ReservarTurnos.jsx';
import AdministrarTurnos from './pages/AdministrarTurnos.jsx';
import VerTurnos from './pages/VerTurnos.jsx';
import ProtectedRoute from './libs/ProtectedRoute.jsx';
import { AuthProvider } from './libs/AuthContext.jsx';
import AdministrarUsuarios from './pages/AdministrarUsuarios.jsx'
import PreciosBarberia from './components/Precios.jsx';

function App() {


  return (
    <AuthProvider>
      <Router>
        <div className="overlay"></div>
        <div className="container">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/verTurnos"
              element={
                <ProtectedRoute requiredRole="admin">
                  <VerTurnos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservarTurnos"
              element={
                <ProtectedRoute >
                  <ReservarTurnos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/administrarTurnos"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdministrarTurnos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/administrarUsuarios"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdministrarUsuarios />
                </ProtectedRoute>
              }
            />
             <Route
              path="/precios"
              element={
                <ProtectedRoute>
                  <PreciosBarberia />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
