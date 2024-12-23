import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/reservarTurnos.css';
import { FaTimes } from 'react-icons/fa';
import { checkSession, checkUsuarioConTurno } from '../services/authService';
import { createTurnoReservado, getTurnosDisponibles } from '../services/turnosService';
import Modal from 'react-modal';

const ReservarTurnos = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
    const [clienteId, setClienteId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [datesWithAvailableSlots, setDatesWithAvailableSlots] = useState([]);
    const [turnoPendiente, setTurnoPendiente] = useState(null);
    const [animate, setAnimate] = useState(false);

    const navigate = useNavigate();

    const formatDate = (date) => date.toISOString().split('T')[0];

    const formatReadableDate = (date) => {
        const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        const months = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        const localDate = new Date(date);
        return `${days[localDate.getUTCDay()]} ${localDate.getUTCDate()} de ${months[localDate.getUTCMonth()]}`;
    };

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const sessionData = await checkSession();
                setClienteId(sessionData.user.id);
            } catch (error) {
                console.error('Error al verificar la sesión:', error.message);
                setError('No estás autenticado. Por favor, inicia sesión para reservar un turno.');
                Swal.fire({
                    icon: 'error',
                    title: 'Sesión no autenticada',
                    text: 'Por favor, inicia sesión para reservar un turno.',
                });
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, []);

    useEffect(() => {
        const fetchTurnos = async () => {
            try {
                const turnoStatus = await checkUsuarioConTurno();

                if (turnoStatus.message === 'Ya tienes un turno pendiente.') {
                    const { fecha, hora } = turnoStatus.turno;
                    setTurnoPendiente({ fecha, hora });
                    setAvailableSlots([]);
                    return;
                }

                const turnos = await getTurnosDisponibles();
                const filteredSlots = turnos.filter((turno) => {
                    const turnoDate = new Date(turno.fecha).toISOString().split('T')[0];
                    return turnoDate === formatDate(selectedDate);
                });

                setAvailableSlots(filteredSlots);

                const dates = turnos.map((slot) => new Date(slot.fecha).toISOString().split('T')[0]);
                setDatesWithAvailableSlots([...new Set(dates)]);
            } catch (error) {
                console.error('Error al verificar o cargar turnos:', error.message);
                setError(error.message);
                setAvailableSlots([]);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                    setAnimate(true);
                }, 500); // Retraso para iniciar la animación (500ms)
            }
        };

        fetchTurnos();
    }, [selectedDate]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) return <div className="error">{error}</div>;

    const confirmReservation = async (turnoId, slot) => {
        try {
            if (!clienteId) {
                Swal.fire({
                    icon: 'error',
                    title: 'No autenticado',
                    text: 'No puedes reservar un turno sin estar autenticado.',
                });
                return;
            }

            if (!turnoId) {
                Swal.fire({
                    icon: 'error',
                    title: 'Turno no encontrado',
                    text: 'No se pudo encontrar el turno seleccionado. Intenta nuevamente.',
                });
                return;
            }

            await createTurnoReservado(clienteId, turnoId);

            Swal.fire({
                icon: 'success',
                title: 'Turno reservado',
                text: `Turno confirmado para el ${formatReadableDate(selectedDate)} a las ${slot}.`,
            }).then(() => {
                navigate('/');
            });
        } catch (error) {
            console.error('Error al reservar el turno:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al reservar turno',
                text: error.message,
            });
        }
    };

    const handleSlotSelection = (slot) => {
        const turno = availableSlots.find((available) => available.hora === slot);

        if (!turno) {
            Swal.fire({
                icon: 'error',
                title: 'Turno no disponible',
                text: 'El turno seleccionado ya no está disponible.',
            });
            return;
        }

        setSelectedTime(slot);

        Swal.fire({
            title: 'Confirmar Turno',
            text: `¿Está seguro que desea confirmar el turno para el ${formatReadableDate(selectedDate)} a las ${slot}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                confirmReservation(turno.id, slot);
            }
        });
    };

    const openSlotModal = () => {
        setIsSlotModalOpen(true);
    };

    const closeSlotModal = () => {
        setIsSlotModalOpen(false);
    };

    const tileContent = ({ date }) => {
        const isDiaConTurnos = datesWithAvailableSlots.includes(date.toISOString().split('T')[0]);
        return isDiaConTurnos ? <div className="highlight"></div> : null;
    };

    const isTileDisabled = ({ date }) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        openSlotModal();
    };

    return (
        <div className={`reservar-container ${animate ? 'animate' : ''}`}>
            <div className="reservar-content">
                <h1 className="reservar-title">Reservar un Turno</h1>
                <p className="reservar-subtitle">
                    Las fechas con el punto indicadas en el calendario son aquellas en las que hay turnos disponibles. Selecciona una de ellas para reservar tu turno.
                </p>
                {turnoPendiente ? (
                    <div className="turno-pendiente">
                        <p><strong>Fecha:</strong> <span className="fecha">{formatReadableDate(turnoPendiente.fecha)}</span></p>
                        <p><strong>Hora:</strong> <span className="hora">{turnoPendiente.hora}</span></p>
                        <button className="back-to-calendar-button" onClick={() => navigate('/')}>
                            Volver
                        </button>
                    </div>
                ) : (
                    <>
                        <Calendar
                            onClickDay={handleDateClick}
                            className="calendar-user"
                            tileContent={tileContent}
                            tileDisabled={isTileDisabled}
                            minDate={new Date()}
                            showNeighboringMonth={true}
                            view="month"
                            prev2Label={null}
                            next2Label={null}
                        />
                        <button className="back-to-calendar-button" onClick={() => navigate('/')}>
                            Volver
                        </button>
                        <Modal
                            isOpen={isSlotModalOpen}
                            onRequestClose={closeSlotModal}
                            className="modal-seleccionar"
                            overlayClassName="modal-overlay"
                        >
                            <button className="close-icon-button-seleccionar" onClick={closeSlotModal}>
                                <FaTimes />
                            </button>
                            <h2 className='tit-seleccionar'>Turnos disponibles para {formatReadableDate(selectedDate)}</h2>
                            <p className='subt-seleccionar'>Seleccione un turno:</p>
                            <div className="slots-container">
                                {availableSlots.length > 0 ? (
                                    availableSlots.map((turno) => (
                                        <button
                                            key={turno.id}
                                            className={`slot-button ${selectedTime === turno.hora ? 'selected' : ''}`}
                                            onClick={() => handleSlotSelection(turno.hora)}
                                        >
                                            {turno.hora}
                                        </button>
                                    ))
                                ) : (
                                    <p className='error-message'>No hay turnos disponibles para esta fecha.</p>
                                )}
                            </div>
                        </Modal>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReservarTurnos;
