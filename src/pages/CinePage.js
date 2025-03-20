import { Button, Card, CardContent, CardMedia, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CinePage = () => {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/api/rooms")
            .then(response => setRooms(response.data))
            .catch(error => console.error("Error al cargar las salas:", error));
    }, []);

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                🎬 Salas de Cine Disponibles
            </Typography>
            <Grid container spacing={3}>
                {rooms.map((room) => (
                    <Grid item xs={12} sm={6} md={4} key={room.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={room.movie_poster_url || "https://via.placeholder.com/200"}
                                alt={room.movie_name}
                            />
                            <CardContent>
                                <Typography variant="h6">{room.movie_name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                {room.name} - Duración: {room.duration} minutos - Género: {room.genre}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => navigate(`/rooms/${room.id}`)}
                                >
                                    Ver Detalles
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default CinePage;
