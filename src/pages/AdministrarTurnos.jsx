import { useState, useEffect } from "react";
import { createTurno, getTurnosByFecha, deleteTurno } from "../services/turnosService";
import "../styles/admistrarTurnos.css";
import ListaTurnos from "../components/ListaTurnos";
import Swal from 'sweetalert2';

const AdministrarTurnos = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [turnosDisponibles, setTurnosDisponibles] = useState([]);
  const [animate, setAnimate] = useState(false);


  // Obtener todos los turnos al cargar la página
  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const turnos = await getTurnosByFecha(selectedDate);
        setTurnosDisponibles(turnos);
      } catch (error) {
        console.error('Error al obtener los turnos:', error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener turnos',
          text: error.message,
        });
      }
    };
    fetchTurnos();

    // Retraso de 1 segundo para iniciar la animación
    const timer = setTimeout(() => {
      setAnimate(true);
    });

    return () => clearTimeout(timer); // Limpiar el temporizador

  }, [selectedDate, isModalOpen]);

  const addTimeSlot = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona una fecha',
        text: 'Por favor selecciona una fecha antes de agregar un horario.',
      });
      return;
    }

    const now = new Date();
    const selectedDateTime = new Date(`${selectedDate}T${newTimeSlot}`);

    // Validar que la fecha y hora no hayan pasado
    if (selectedDateTime < now) {
      Swal.fire({
        icon: 'error',
        title: 'Fecha u hora inválida',
        text: 'No puedes crear un turno en una fecha u hora que ya pasó.',
      });
      return;
    }

    if (newTimeSlot && !timeSlots.includes(newTimeSlot)) {
      try {
        const nuevoTurno = { fecha: selectedDate, hora: newTimeSlot };
        await createTurno(nuevoTurno);
        setTurnosDisponibles((prev) => [...prev, { ...nuevoTurno, disponible: true }]);
        setTimeSlots([...timeSlots, newTimeSlot]);
        setNewTimeSlot("");
        Swal.fire({
          icon: 'success',
          title: 'Turno creado exitosamente',
        });
      } catch (error) {
        console.error(`Error al crear el turno: ${error.message}`);
        Swal.fire({
          icon: 'error',
          title: 'Error al crear turno',
          text: error.message,
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Horario inválido o repetido',
        text: 'Por favor ingresa un horario válido que no esté repetido.',
      });
    }
  };

  const toggleModal = () => {
    if (!selectedDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona una fecha',
        text: 'Por favor selecciona una fecha antes de ver los turnos.',
      });
      return; // Detenemos la ejecución de la función si no hay fecha seleccionada
    }
    setModalOpen(!isModalOpen);
  };

  const eliminarTurno = async (id) => {
    try {
      await deleteTurno(id);
      setTurnosDisponibles((prev) => prev.filter((turno) => turno.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Turno eliminado correctamente',
      });
    } catch (error) {
      console.error(`Error al eliminar el turno: ${error.message}`);
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar turno',
        text: error.message,
      });
    }
  };

  return (
    <div className={`admin-container ${animate ? "animate" : ""}`}>
      <div className="admin-content-principal">
        <h1 className="admin-title">Administrar Turnos</h1>
        <p className="admin-subtitle">Selecciona una fecha y agrega horarios disponibles.</p>
        <div className="admin-form-group">
          <label htmlFor="date">Fecha</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <form className="admin-time-form" onSubmit={addTimeSlot}>
          <div className="admin-form-group">
            <label htmlFor="time">Agregar horario</label>
            <input
              type="time"
              id="time"
              value={newTimeSlot}
              onChange={(e) => setNewTimeSlot(e.target.value)}
            />
          </div>
          <button type="submit" className="admin-button">AGREGAR</button>
        </form>
      </div>
      <div className="admin-content-secundario">
        <p className="admin-subtitle-dos">Selecciona una fecha para ver los turnos disponibles.</p>
        <button className="admin-button view-button" onClick={toggleModal}>
          VER TURNOS
        </button>
      </div>
      <ListaTurnos
        isOpen={isModalOpen}
        onClose={toggleModal}
        turnosDisponibles={turnosDisponibles}
        eliminarTurno={eliminarTurno}
        fechaSeleccionada={selectedDate}
      />
    </div>
  );
};

export default AdministrarTurnos;
