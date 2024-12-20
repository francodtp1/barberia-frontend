import { useEffect, useState } from "react";
import "../styles/navBar.css";
import AuthModal from "./Auth";
import { checkSession, logoutUser } from '../services/authService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [menuState, setMenuState] = useState({
    isExpanded: false,
    showModal: false,
    isAuthenticated: false,
    userRole: null, // Estado para almacenar el rol del usuario
  });

  const navigate = useNavigate();
  const [hasCheckedSession, setHasCheckedSession] = useState(false); // Evita múltiples verificaciones

  const verifySession = async () => {
    try {
      const sessionData = await checkSession();
      console.log("Usuario autenticado:", sessionData.user); // Solo log una vez
      setMenuState((prev) => ({
        ...prev,
        isAuthenticated: true,
        userRole: sessionData.user.role,
      }));
    } catch (error) {
      if (error.message === 'Sesión expirada') {
        Swal.fire({
          icon: 'warning',
          title: 'Sesión expirada',
          text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        });
      }
      setMenuState((prev) => ({
        ...prev,
        isAuthenticated: false,
        userRole: null,
      }));

    }
  };

  useEffect(() => {
    if (!hasCheckedSession) {
      verifySession();
      setHasCheckedSession(true); // Marca como ejecutado
    }
  }, [hasCheckedSession]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setMenuState((prev) => ({
        ...prev,
        isAuthenticated: false,
        userRole: null,
        isExpanded: false,
      }));

      Swal.fire({
        icon: 'success',
        title: '¡Has cerrado sesión!',
        text: 'Hasta pronto.',
      });
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cerrar sesión. Intenta nuevamente.',
      });
    }
  };

  const handleAuthSuccess = () => {
    setMenuState((prev) => ({
      ...prev,
      isAuthenticated: true,
      showModal: false,
    }));
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
              <span className="logo-text">
                <span className="logo-text-guri">GURI</span><span className="logo-text-barber">BARBER</span>
              </span>
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
                  {menuState.userRole === 'admin' && (
                    <>
                      <li className="list-item"><a className="nav__link" href="/verTurnos">Turnos reservados</a></li>
                      <li className="list-item"><a className="nav__link" href="/administrarTurnos">Administrar turnos</a></li>
                      <li className="list-item"><a className="nav__link" href="/administrarUsuarios">Administrar usuarios</a></li>
                    </>
                  )}
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
          onAuthSuccess={() => {
            verifySession();
            handleAuthSuccess();
          }}
        />
      )}
    </div>
  );
};

export default NavBar;
