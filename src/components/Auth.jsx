import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Importa los íconos
import { registerUser, loginUser } from '../services/authService';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import '../styles/auth.css';

const AuthModal = ({ onClose, onAuthSuccess }) => {
  const [registerForm, setRegisterForm] = useState({ nombre: '', email: '', password: '', telefono: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm({ ...registerForm, [name]: value });
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(registerForm);
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Ahora puedes iniciar sesión.',
      });
      setRegisterForm({ nombre: '', email: '', password: '', telefono: '' });
      setError(null);
      onClose();
    } catch (err) {
      console.error('Error en registro:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: err.message || 'Error desconocido en registro.',
      });
      setError(err.message || 'Error desconocido en registro');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(loginForm);
      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: '¡Bienvenido de nuevo!',
      });
      setLoginForm({ email: '', password: '' });
      setError(null);
      onAuthSuccess();
    } catch (err) {
      console.error('Error en login:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error en el inicio de sesión',
        text: err.message || 'Error desconocido en inicio de sesión.',
      });
      setError(err.message || 'Error desconocido en inicio de sesión');
    }
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleModalClick}>
      <div className="auth-box">
        <input type="checkbox" id="chk" aria-hidden="true" className="hidden" />
        <div className="signup">
          <form onSubmit={handleRegisterSubmit}>
            <label htmlFor="chk" aria-hidden="true" className="lbls">Registrarse</label>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre de usuario"
              className="inputs"
              value={registerForm.nombre}
              onChange={handleRegisterInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Correo"
              className="inputs"
              value={registerForm.email}
              onChange={handleRegisterInputChange}
              required
            />
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                className="inputs"
                value={registerForm.password}
                onChange={handleRegisterInputChange}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <input
              type="number"
              name="telefono"
              placeholder="Número de Teléfono"
              className="inputs"
              value={registerForm.telefono}
              onChange={handleRegisterInputChange}
              required
            />
            <button type="submit" className="btnAuth">Registrarse</button>
          </form>
        </div>
        <div className="login">
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="chk" aria-hidden="true" className="lbls" id="lblLogin">Iniciar sesión</label>
            <input
              type="email"
              name="email"
              placeholder="Correo"
              className="inputs"
              value={loginForm.email}
              onChange={handleLoginInputChange}
              required
            />
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                className="inputs"
                value={loginForm.password}
                onChange={handleLoginInputChange}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <button type="submit" className="btnAuth">Iniciar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
