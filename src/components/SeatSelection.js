import { Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const SeatSelection = ({ roomId, rows, columns }) => {
    const [reservedSeats, setReservedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3000/api/reservations/${roomId}`)
            .then(response => setReservedSeats(response.data))
            .catch(error => console.error("Error al cargar reservas:", error));
    }, [roomId]);

    const toggleSeatSelection = (row, col) => {
        const seatKey = `${row}-${col}`;
        if (reservedSeats.includes(seatKey)) return;
        setSelectedSeats((prev) => prev.includes(seatKey) ? prev.filter(s => s !== seatKey) : [...prev, seatKey]);
    };

    const confirmReservation = () => {
        axios.post(`http://localhost:3000/api/reservations/${roomId}`, { seats: selectedSeats })
            .then(() => alert("Reserva confirmada"))
            .catch(error => console.error("Error al reservar:", error));
    };

    return (
        <div>
            <Typography variant="h6">Selecciona tus asientos</Typography>
            <Grid container spacing={1}>
                {Array.from({ length: rows }).map((_, row) =>
                    <Grid key={row} container item spacing={1}>
                        {Array.from({ length: columns }).map((_, col) => {
                            const seatKey = `${row}-${col}`;
                            return (
                                <Grid item key={seatKey}>
                                    <Button
                                        variant="contained"
                                        color={reservedSeats.includes(seatKey) ? "error" : selectedSeats.includes(seatKey) ? "primary" : "default"}
                                        onClick={() => toggleSeatSelection(row, col)}
                                        disabled={reservedSeats.includes(seatKey)}
                                    >
                                        {row + 1}-{col + 1}
                                    </Button>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Grid>
            <Button variant="contained" color="success" onClick={confirmReservation} sx={{ mt: 2 }}>
                Confirmar Reserva
            </Button>
        </div>
    );
};

export default SeatSelection;
