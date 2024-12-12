import axios from 'axios';

const API_URL = 'http://localhost:4000/api/turnos';

// Crear un turno disponible
export const createTurno = async (turnoData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, turnoData, {
      withCredentials: true, // Permitir envío de cookies para autenticación
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al crear el turno';
    const statusCode = error.response?.status || 500;
    throw { message: errorMessage, status: statusCode };
  }
};

// Obtener todos los turnos disponibles
export const getTurnos = async () => {
  try {
    const response = await axios.get(API_URL, {
      withCredentials: true, // Permitir envío de cookies para autenticación
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener los turnos';
    const statusCode = error.response?.status || 500;
    throw { message: errorMessage, status: statusCode };
  }
};

// Obtener los turnos disponibles por fecha
export const getTurnosByFecha = async (fecha) => {
  try {
    const response = await axios.get(`${API_URL}/fecha?fecha=${fecha}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener los turnos';
    const statusCode = error.response?.status || 500;
    throw { message: errorMessage, status: statusCode };
  }
};

// Eliminar un turno por ID
export const deleteTurno = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      withCredentials: true, // Permitir envío de cookies para autenticación
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al eliminar el turno';
    const statusCode = error.response?.status || 500;
    throw { message: errorMessage, status: statusCode };
  }
};
