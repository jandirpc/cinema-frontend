import { Button, Card, CardMedia, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Importar useNavigate

const RoomPage = () => {
    const { id } = useParams();  // Obtener el ID de la sala desde la URL
    const [room, setRoom] = useState(null);
    const navigate = useNavigate();  // Instanciar useNavigate

    useEffect(() => {
        axios.get(`http://localhost:3000/api/rooms/${id}`)
            .then(response => setRoom(response.data))
            .catch(error => console.error("Error al cargar la sala:", error));
    }, [id]);

    if (!room) return <Typography align="center">Cargando información de la sala...</Typography>;

    // Función para manejar la redirección cuando se hace click en el botón
    const handleReservation = () => {
        navigate(`/rooms/${id}/reservar`, { state: { room, pricePerSeat: room.price } });  // Redirigir a la página de selección de asientos con datos del precio y sala
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                🎬 {room.movie_name}
            </Typography>

            <Grid container spacing={3} justifyContent="center">
                {/* Imagen de la película */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="400"
                            image={room.movie_poster_url || "https://via.placeholder.com/400"}
                            alt={room.movie_name}
                        />
                    </Card>
                </Grid>

                {/* Información de la sala */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Sala: {room.name}</Typography>
                    <Typography variant="body1">
                        Duración: {room.duration} minutos
                    </Typography>
                    <Typography variant="body1">
                        Género: {room.genre}
                    </Typography>
                    <Typography variant="body1">
                        Asientos Disponibles: {room.num_rows * room.num_columns}
                    </Typography>
                    <Typography variant="body1">
                        Horario: {room.schedule || "No disponible"}
                    </Typography>
                    <Typography variant="body1">
                        Precio por asiento: ${room.price || "No especificado"}
                    </Typography>

                    {/* Botón para reservar */}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleReservation}  // Añadir evento de click
                    >
                        Reservar Asiento
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default RoomPage;
