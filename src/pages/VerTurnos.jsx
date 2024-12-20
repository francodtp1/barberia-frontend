import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Swal from 'sweetalert2';
import { getTurnosReservados, deleteTurnoReservado } from '../services/turnosService';
import '../styles/verTurnos.css';

const VerTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [diasConTurnos, setDiasConTurnos] = useState([]);
  const [turnosDia, setTurnosDia] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [animate, setAnimate] = useState(false); // Estado para controlar la animación

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const data = await getTurnosReservados();
        setTurnos(data);

        const diasUnicos = Array.from(
          new Set(data.map((turno) => new Date(turno.fecha).toISOString().split('T')[0]))
        );
        setDiasConTurnos(diasUnicos);

        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error al cargar los turnos');
        setLoading(false);
      }
    };

    fetchTurnos();

    // Configuramos el temporizador para iniciar la animación
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 500); // Tiempo para iniciar la animación (500ms)

    return () => clearTimeout(timer); // Limpiamos el temporizador
  }, []);

  const handleDayClick = (date) => {
    const selectedDate = date.toISOString().split('T')[0];
    const turnosDelDia = turnos
      .filter((turno) => turno.fecha.split('T')[0] === selectedDate)
      .sort((a, b) => a.hora.localeCompare(b.hora));

    setTurnosDia(turnosDelDia);
    setFechaSeleccionada(date);
  };

  const handleBackToCalendar = () => {
    setFechaSeleccionada(null);
    setTurnosDia([]);
  };

  const handleCancelarTurno = (turnoId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cancelar este turno?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTurnoReservado(turnoId);
          const updatedTurnos = turnos.filter((turno) => turno.id !== turnoId);
          setTurnos(updatedTurnos);

          // Actualizar turnos del día
          const updatedTurnosDia = turnosDia.filter((turno) => turno.id !== turnoId);
          setTurnosDia(updatedTurnosDia);

          // Verificar si quedan turnos para la fecha seleccionada
          const fechaSeleccionadaISO = fechaSeleccionada.toISOString().split('T')[0];
          const turnosRestantesEnDia = updatedTurnos.filter(
            (turno) => turno.fecha.split('T')[0] === fechaSeleccionadaISO
          );

          // Si no hay más turnos para la fecha, eliminarla de días con turnos
          if (turnosRestantesEnDia.length === 0) {
            setDiasConTurnos(diasConTurnos.filter((dia) => dia !== fechaSeleccionadaISO));
          }

          Swal.fire({
            title: 'Cancelado',
            text: 'El turno ha sido cancelado con éxito.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } catch (err) {
          Swal.fire({
            title: 'Error',
            text: err.message || 'Hubo un problema al cancelar el turno.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

  const formatReadableDate = (date) => {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${days[date.getDay()]} ${date.getDate()} de ${months[date.getMonth()]}`;
  };

  const tileContent = ({ date }) => {
    const isDiaConTurnos = diasConTurnos.includes(date.toISOString().split('T')[0]);
    return isDiaConTurnos ? <div className="highlight"></div> : null;
  };

  const isTileDisabled = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today; // Deshabilitar días anteriores
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );

  if (error) return <div className="error">{error}</div>;

  return (
    <div className={`ver-turno-container ${animate ? 'animate' : ''}`}>
      <div className="ver-turnos-content">
        {!fechaSeleccionada ? (
          <div className="calendar-view">
            <h1 className="title">Turnos reservados</h1>
            <Calendar
              onClickDay={handleDayClick}
              tileContent={tileContent}
              tileDisabled={isTileDisabled}
              className="custom-calendar"
              showNeighboringMonth={false}
              prev2Label={null}
              next2Label={null}
              minDate={new Date()}
            />
          </div>
        ) : (
          <div className="turnos-dia-view">
            <h2 className="title">
              Turnos del {formatReadableDate(fechaSeleccionada)}
            </h2>
            <ul className="turnos-list-modern">
              {turnosDia.length > 0 ? (
                turnosDia.map((turno) => (
                  <li className="turno-item" key={turno.id}>
                    <div className="turno-info">
                      <span className="turno-hora">{turno.hora}</span>
                      <span className="turno-cliente">{turno.cliente_nombre}</span>
                    </div>
                    <button
                      className="cancel-button"
                      onClick={() => handleCancelarTurno(turno.id)}
                    >
                      Cancelar
                    </button>
                  </li>
                ))
              ) : (
                <div className="no-turnos">No hay turnos para este día</div>
              )}
            </ul>
            <button className="back-button" onClick={handleBackToCalendar}>
              Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerTurnos;
