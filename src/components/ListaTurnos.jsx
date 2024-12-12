import '../styles/listaTurnos.css';

const ListaTurnos = ({ isOpen, onClose, turnosDisponibles, eliminarTurno, fechaSeleccionada }) => {
    return (
        <div className={`modal-overlay ${isOpen ? 'show' : ''}`}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">Horarios disponibles para {fechaSeleccionada}</h2>
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <ul className="modal-slots-list">
                        {turnosDisponibles.length > 0 ? (
                            turnosDisponibles.map((turno, index) => (
                                <li key={index} className="modal-slot-item">
                                    <span>{turno.hora}</span>
                                    <button
                                        className="delete-button"
                                        onClick={() => eliminarTurno(turno.id)}
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p>No hay horarios disponibles.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ListaTurnos;
