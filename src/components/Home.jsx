import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaListUl } from 'react-icons/fa';
import '../styles/home.css';

const Home = () => {
    return (
      <div className="home-container">
        <div className="home-content">
          <div className="home-section">
            <h1 className="home-title animate-fade-in">
              ¡Bienvenido a nuestra Barbería!
            </h1>
            <p className="home-subtitle animate-slide-up">
              Reserva tu turno ahora y vive la mejor experiencia de cuidado personal.
            </p>
            <Link to="/turnos" className="home-button">
              <FaCalendarAlt className="button-icon" />
              Reservar Turno
            </Link>
          </div>
          <div className="home-section">
            <p className="home-subtitle animate-slide-up">
              Conoce nuestros precios y descubre todo lo que ofrecemos.
            </p>
            <Link to="/precios" className="home-button">
              <FaListUl className="button-icon" />
              Ver Lista de Precios
            </Link>
          </div>
        </div>
      </div>
    );
  };
  
  export default Home;