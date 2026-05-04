import axios from 'axios';

// Creamos una instancia de Axios con la URL base de nuestro backend
const api = axios.create({
    // Mientras desarrollas en local usa esta ruta.
    // Luego, al desplegar, la cambiaremos por la URL de Vercel/Render.
    baseURL: 'http://localhost:5000/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para manejar errores globalmente (opcional pero muy recomendado)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Aquí podríamos disparar un toast global si el servidor se cae
        console.error('Error en la API:', error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

export default api;