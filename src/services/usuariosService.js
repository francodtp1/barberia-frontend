import axios from 'axios';

const API_URL = 'https://api.guribarber.site/api/usuarios';


// Obtener todos los usuarios
export const getUsuarios = async () => {
    try {
      const response = await axios.get(`${API_URL}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al obtener los usuarios';
      const statusCode = error.response?.status || 500;
      throw { message: errorMessage, status: statusCode };
    }
  };
