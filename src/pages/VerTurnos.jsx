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
        console.log("lo que traigo es ", data)
        setTurnos(data);

        const diasUnicos = Array.from(
          new Set(data.map((turno) => new Date(turno.fecha).toDateString()))
        );
        setDiasConTurnos(diasUnicos);
        console.log("Días con turnos:", diasUnicos);
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
    });

    return () => clearTimeout(timer); // Limpiamos el temporizador
  }, []);

  const handleDayClick = (date) => {
    console.log("Fecha seleccionada:", date); // Agregado para depurar
    const turnosDelDia = turnos
      .filter(
        (turno) => new Date(turno.fecha).toDateString() === date.toDateString()
      )
      .sort((a, b) => a.hora.localeCompare(b.hora));

    console.log("Turnos para el día:", turnosDelDia);
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
          setTurnos(turnos.filter((turno) => turno.id !== turnoId));
          setTurnosDia(turnosDia.filter((turno) => turno.id !== turnoId));

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
    const isDiaConTurnos = diasConTurnos.includes(date.toDateString());
    return isDiaConTurnos ? <div className="highlight"></div> : null;
  };

  const isTileDisabled = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today; // Deshabilitar días anteriores
  };

  if (loading) return <div className="loading">Cargando turnos...</div>;
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
              showNeighboringMonth={false} // No mostrar meses vecinos
              prev2Label={null} // Elimina la opción de ir dos meses atrás
              next2Label={null} // Eliminar el botón de mes siguiente
              minDate={new Date()} // Deshabilita meses anteriores al actual
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
