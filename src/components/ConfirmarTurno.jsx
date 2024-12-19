import '../styles/confirmarTurno.css';

const ConfirmarTurno = ({ fecha, hora, onClose, onConfirm }) => {
    return (
        <div className="modal-confirmar-overlay">
            <div className="modal-confirmar-content">
                <h2 className="modal-confirmar-title">Confirmar Turno</h2>
                <p className="modal-confirmar-info">Fecha: <strong>{fecha}</strong></p>
                <p className="modal-confirmar-info">Hora: <strong>{hora}</strong></p>
                <p className="modal-confirmar-instructions">
                    Por favor, asegúrate de ser puntual. 
                    Si tienes alguna duda, puedes contactarnos en WhatsApp.
                </p>
                <div className="modal-confirmar-actions">
                    <button className="modal-confirmar-button confirm-button" onClick={onConfirm}>
                        Confirmar
                    </button>
                    <button className="modal-confirmar-button cancel-button" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmarTurno;
