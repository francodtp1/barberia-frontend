import { useState, useEffect } from "react";
import { getUsuarios } from "../services/usuariosService";
import "../styles/administrarUsuarios.css";
import Swal from "sweetalert2";
import { FaWhatsapp } from "react-icons/fa"; // Importar ícono de WhatsApp

const AdministrarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [animate, setAnimate] = useState(false);

  // Obtener todos los usuarios al cargar la página
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getUsuarios();
        setUsuarios(data);
        setFilteredUsuarios(data); // Inicializar la lista filtrada con todos los usuarios
      } catch (error) {
        console.error("Error al obtener los usuarios:", error.message);
        Swal.fire({
          icon: "error",
          title: "Error al obtener usuarios",
          text: error.message,
        });
      }
    };
    fetchUsuarios();

    // Retraso de 1 segundo para iniciar la animación
    const timer = setTimeout(() => {
      setAnimate(true);
    });

    return () => clearTimeout(timer); // Limpiar el temporizador
  }, []);

  // Actualizar la lista filtrada cada vez que cambia el término de búsqueda
  useEffect(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = usuarios.filter(
      (usuario) =>
        usuario.nombre.toLowerCase().includes(lowerCaseSearch) ||
        usuario.telefono.toLowerCase().includes(lowerCaseSearch)
    );
    setFilteredUsuarios(filtered);
  }, [searchTerm, usuarios]);

  return (
    <div className={`admin-container-users ${animate ? "animate" : ""}`}>
      <div className="admin-content-principal-users">
        <h1 className="admin-title-users">Administrar Usuarios</h1>
        <p className="admin-subtitle-users">
          Lista de usuarios registrados en el sistema.
        </p>

        {/* Campo de búsqueda */}
        <input
          type="text"
          className="search-input-users"
          placeholder="Buscar usuarios por nombre o teléfono..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="admin-table-container-users">
          <table className="admin-table-users">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.telefono}</td>
                  <td>
                    <a
                      href={`https://wa.me/${usuario.telefono}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp-button"
                    >
                      <FaWhatsapp size={20} /> {/* Ícono de WhatsApp */}
                    </a>
                  </td>
                </tr>
              ))}
              {filteredUsuarios.length === 0 && (
                <tr>
                  <td colSpan="3" className="no-data-users">
                    No hay usuarios que coincidan con el término de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdministrarUsuarios;
