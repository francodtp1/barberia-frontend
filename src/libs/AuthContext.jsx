import { createContext, useContext, useEffect, useState } from 'react';
import { checkSession } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const session = await checkSession();
                setUser(session.user); // Información del usuario autenticado
            } catch {
                setUser(null); // No hay sesión activa
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
