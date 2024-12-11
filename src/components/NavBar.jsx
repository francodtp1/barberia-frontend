import { useEffect, useState } from "react";
import "../styles/navBar.css";
import AuthModal from "./Auth";
import { checkSession, logoutUser } from '../services/authService';
import Swal from 'sweetalert2';  // Importa SweetAlert2

const NavBar = () => {
  const [menuState, setMenuState] = useState({
    isExpanded: false,
    showModal: false,
    isAuthenticated: false,
  });

  useEffect(() => {
    const verifySession = async () => {
      try {
        await checkSession();
        setMenuState((prev) => ({ ...prev, isAuthenticated: true }));
      } catch {
        setMenuState((prev) => ({ ...prev, isAuthenticated: false }));
      }
    };
    verifySession();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setMenuState((prev) => ({ ...prev, isAuthenticated: false, isExpanded: false }));
      
      // Muestra un mensaje de éxito al cerrar sesión
      Swal.fire({
        icon: 'success',
        title: '¡Has cerrado sesión!',
        text: 'Hasta pronto.',
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
      
      // Muestra un mensaje de error si ocurre un problema al cerrar sesión
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cerrar sesión. Intenta nuevamente.',
      });
    }
  };

  const handleAuthSuccess = () => {
    setMenuState((prev) => ({ ...prev, isAuthenticated: true, showModal: false }));
    
    // Muestra un mensaje de éxito al autenticar al usuario
    Swal.fire({
      icon: 'success',
      title: '¡Bienvenido!',
      text: 'Iniciaste sesión correctamente.',
    });
  };

  const toggleMenu = () => {
    setMenuState((prev) => ({ ...prev, isExpanded: !prev.isExpanded }));
  };

  const closeMenu = (e) => {
    if (!e.target.closest(".nav-toggle") && !e.target.closest(".nav__list")) {
      setMenuState((prev) => ({ ...prev, isExpanded: false }));
    }
  };

  const toggleModal = () => {
    setMenuState((prev) => ({ ...prev, showModal: !prev.showModal }));
  };

  return (
    <div className="containerNav" onClick={closeMenu}>
      <header className="site-header">
        <div className="header__content--flow">
          <section className="header-content--left">
            <a href="/" className="brand-logo">
              <span className="logo-text">BARBERIA</span>
            </a>
            {menuState.isAuthenticated && (
              <button className="nav-toggle" onClick={toggleMenu}>
                <span className="toggle--icon"></span>
              </button>
            )}
          </section>
          <section className="header-content--right">
            <nav className="header-nav" role="navigation">
              {menuState.isAuthenticated ? (
                <ul
                  className={`nav__list ${menuState.isExpanded ? "expanded slide-in" : "slide-out"}`}
                  aria-expanded={menuState.isExpanded}
                >
                  <li className="list-item"><a className="nav__link" href="/">Inicio</a></li>
                  <li className="list-item"><a className="nav__link" href="#">Ver Turnos</a></li>
                  <li className="list-item"><a className="nav__link" href="#">Administrar Turnos</a></li>
                  <li className="list-item">
                    <button className="btnAuth-nav-salir" onClick={handleLogout}>
                      <p>Salir</p>
                    </button>
                  </li>
                </ul>
              ) : (
                <button className="btnAuth-nav" onClick={toggleModal}>
                  <p>Registrarse</p>
                </button>
              )}
            </nav>
          </section>
        </div>
      </header>
      {menuState.showModal && (
        <AuthModal
          onClose={toggleModal}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default NavBar;
