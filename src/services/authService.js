import axios from 'axios';

const API_URL = 'http://localhost:4000/api/auth';

// Registro de usuario
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
       // Retornar más detalles del error del backend
       const errorMessage = error.response?.data?.message || 'Error al registrar';
       const statusCode = error.response?.status || 500; // Capturar el código de estado
       throw { message: errorMessage, status: statusCode };
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
    // Retornar más detalles del error del backend
    const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
    const statusCode = error.response?.status || 500; // Capturar el código de estado
    throw { message: errorMessage, status: statusCode };
  }
};

// Cierre de sesión
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al cerrar sesión' };
  }
};

// Verificar sesión activa
export const checkSession = async () => {
  try {
    const response = await axios.get(`${API_URL}/check-session`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error al verificar la sesión:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Sesión no activa' };
  }
};

