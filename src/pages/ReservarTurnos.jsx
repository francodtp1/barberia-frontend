import { useState } from 'react';
import '../styles/reservarTurnos.css';

const ReservarTurnos = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const handleReservation = (e) => {
        e.preventDefault();
        if (selectedDate && selectedTime ) {
            alert(`Reserva realizada para el ${selectedDate} a las ${selectedTime}`);
        } else {
            alert('Por favor completa todos los campos.');
        }
    };

    return (
        <div className="reservar-container">
            <div className="reservar-content">
                <h1 className="reservar-title">Reservar un Turno</h1>
                <p className="reservar-subtitle">Selecciona la fecha y hora para tu turno.</p>
                <form className="reservar-form" onSubmit={handleReservation}>
                    <div className="form-group">
                        <label htmlFor="date">Fecha</label>
                        <input 
                            type="date" 
                            id="date" 
                            value={selectedDate} 
                            onChange={(e) => setSelectedDate(e.target.value)} 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="time">Hora</label>
                        <select 
                            id="time" 
                            value={selectedTime} 
                            onChange={(e) => setSelectedTime(e.target.value)} 
                            required
                        >
                            <option value="">Selecciona una hora</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                        </select>
                    </div>
                   
                    <button type="submit" className="reservar-button">Confirmar Reserva</button>
                </form>
            </div>
        </div>
    );
};

export default ReservarTurnos;
