import { Button, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ReserveSeatsPage = () => {
    const { id } = useParams();  // Obtener el ID de la sala desde la URL
    const navigate = useNavigate();  // Usamos useNavigate para redirigir
    const [room, setRoom] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [dateSelected, setDateSelected] = useState("");  // Nueva variable para la fecha seleccionada
    const [errorMessage, setErrorMessage] = useState("");  // Mensaje de error para fecha

    // Cargar la información de la sala y los asientos
    useEffect(() => {
        axios.get(`http://localhost:3000/api/rooms/${id}`)
            .then(response => setRoom(response.data))
            .catch(error => console.error("Error al cargar la sala:", error));
    }, [id]);

    // Función para manejar la selección de asientos
    const toggleSeatSelection = (seatId) => {
        setSelectedSeats((prevSelectedSeats) => {
            if (prevSelectedSeats.includes(seatId)) {
                return prevSelectedSeats.filter((seat) => seat !== seatId);  // Deseleccionar
            } else {
                return [...prevSelectedSeats, seatId];  // Seleccionar
            }
        });
    };

    // Confirmar la reserva de los asientos
    const confirmReservation = () => {
        if (selectedSeats.length === 0) {
            alert("Por favor selecciona al menos un asiento.");
        } else {
            const totalPrice = selectedSeats.length * room.price; // Calcula el precio total

            // Redirigir a la página de confirmación, pasando los datos
            navigate(`/simulacion-pago/${room.movie_name}`, {
                state: { 
                    selectedSeats, 
                    roomName: room.movie_name, 
                    totalPrice,
                    dateSelected // Agregar la fecha seleccionada al estado
                }
            });
        }
    };

    // Cambiar la fecha seleccionada y validar el rango de fechas
    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        const today = new Date();
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 8); // Fecha máxima es 8 días a partir de hoy

        const selectedDateObj = new Date(selectedDate);

        // Validar que la fecha esté dentro del rango de 8 días
        if (selectedDateObj <= maxDate && selectedDateObj >= today) {
            setDateSelected(selectedDate);
            setErrorMessage("");  // Limpiar mensaje de error
        } else {
            setDateSelected("");  // Limpiar selección si la fecha está fuera de rango
            setErrorMessage("No hay asientos disponibles para esta fecha. Por favor selecciona una fecha dentro de los próximos 8 días.");
        }
    };

    if (!room) return <Typography align="center">Cargando información de la sala...</Typography>;

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                🎬 Reserva tus Asientos - {room.movie_name}
            </Typography>

            <Grid container spacing={3} justifyContent="center">
                {/* Imagen de la película */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <img
                                src={room.movie_poster_url || "https://via.placeholder.com/400"}
                                alt={room.movie_name}
                                style={{ width: "100%", height: "auto" }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Información de la sala */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Sala: {room.name}</Typography>
                    <Typography variant="body1">
                        Asientos Disponibles: {room.num_rows * room.num_columns}
                    </Typography>
                    <Typography variant="body1">
                        Horario: {room.schedule || "No disponible"}
                    </Typography>
                    <Typography variant="body1">
                        Precio por asiento: ${room.price || "No especificado"}
                    </Typography>
                </Grid>
            </Grid>

            {/* Selección de fecha */}
            <Typography variant="h5" align="center" gutterBottom sx={{ mt: 4 }}>
                Selecciona una fecha para tu reserva
            </Typography>
            <input
                type="date"
                value={dateSelected}
                onChange={handleDateChange}
                min={new Date().toISOString().split("T")[0]} // Solo fechas futuras
                max={new Date(new Date().setDate(new Date().getDate() + 8)).toISOString().split("T")[0]} // Solo hasta 8 días
            />

            {errorMessage && (
                <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
                    {errorMessage}
                </Typography>
            )}

            {/* Mapa de asientos */}
            <Typography variant="h5" align="center" gutterBottom sx={{ mt: 4 }}>
                Selecciona tus asientos
            </Typography>

            <Grid container spacing={1} justifyContent="center">
                {/* Mapeamos los asientos */}
                {Array.from({ length: room.num_rows }, (_, rowIndex) => (
                    <Grid item xs={12} key={rowIndex}>
                        <Grid container spacing={1} justifyContent="center">
                            {Array.from({ length: room.num_columns }, (_, colIndex) => {
                                const seatId = `${rowIndex + 1}-${colIndex + 1}`;
                                const isSelected = selectedSeats.includes(seatId);
                                const isReserved = false;
                                let seatColor = "default";
                                if (isReserved) {
                                    seatColor = "error";  // Rojo para reservados
                                } else if (isSelected) {
                                    seatColor = "primary";  // Azul para seleccionados
                                } else {
                                    seatColor = "success";  // Verde para disponibles
                                }

                                return (
                                    <Grid item key={seatId}>
                                        <Button
                                            variant="outlined"
                                            color={seatColor}
                                            disabled={isReserved}
                                            onClick={() => !isReserved && toggleSeatSelection(seatId)}
                                        >
                                            {seatId}
                                        </Button>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Grid>
                ))}
            </Grid>

            {/* Confirmar reserva */}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={confirmReservation}
            >
                Confirmar Reserva
            </Button>
        </Container>
    );
};

export default ReserveSeatsPage;
