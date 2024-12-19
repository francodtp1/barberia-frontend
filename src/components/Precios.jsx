import { useState, useEffect } from "react";
import "../styles/precios.css"; // Asegúrate de crear este archivo de estilos
import { useNavigate } from 'react-router-dom';

const PreciosBarberia = () => {
    const [animate, setAnimate] = useState(false);
    const [precios, setPrecios] = useState([
        { servicio: "Corte Adulto", precio: "$4500" },
        { servicio: "Corte Niño", precio: "$4000" },
        { servicio: "Corte + Barba", precio: "$5000" },
    ]);

    const navigate = useNavigate();
    // Animación al cargar el componente
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimate(true);
        }); // Iniciar animación después de 1 segundo

        return () => clearTimeout(timer); // Limpiar temporizador
    }, []);

    return (
        <div className={`precios-container ${animate ? "animate" : ""}`}>
            <div className="precios-content">
                <h1 className="precios-title">Precios de Barbería</h1>
                <p className="precios-subtitle">Nuestros servicios y precios.</p>

                <div className="precios-table-container">
                    <table className="precios-table">
                        <thead>
                            <tr>
                                <th>Servicio</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {precios.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.servicio}</td>
                                    <td>{item.precio}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className="back-to-calendar-button" onClick={() => navigate('/')}>
                    Volver
                </button>
            </div>
        </div>
    );
};

export default PreciosBarberia;
