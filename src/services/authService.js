import axios from 'axios';

const API_URL = 'https://api.guribarber.site/api/auth';

// Registro de usuario
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    handleError(error, 'Error al registrar');
  }
};

// Inicio de sesión
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData, {
      withCredentials: true, // Permitir envío de cookies
    });
    return response.data;
  } catch (error) {
    handleError(error, 'Error al iniciar sesión');
  }
};

// Cierre de sesión
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error, 'Error al cerrar sesión');
  }
};

// Verificar sesión activa
export const checkSession = async () => {
  try {
    const response = await axios.get(`${API_URL}/check-session`, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error, 'Sesión no activa');
  }
};

// Verificar si el usuario tiene un turno pendiente
export const checkUsuarioConTurno = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuario/turno`, {
      withCredentials: true, // Permitir envío de cookies para autenticación
    });
    return response.data;
  } catch (error) {
    handleError(error, 'Error al verificar el turno');
  }
};

// Eliminar un usuario (solo admin puede hacerlo)
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/usuario/${userId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error, 'Error al eliminar el usuario');
  }
};

// Manejo centralizado de errores
const handleError = (error, defaultMessage) => {
  const errorMessage = error.response?.data?.message || defaultMessage;
  const statusCode = error.response?.status || 500;

  if (statusCode === 401 && errorMessage === 'Sesión expirada') {
    throw { message: 'Sesión expirada', status: 401 };
  }

  throw { message: errorMessage, status: statusCode };
};