import { Button, Container, Grid, Paper, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const ConfirmationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Extraer los datos de la reserva pasados en el estado
    const { selectedSeats, roomName, totalPrice, dateSelected } = location.state;

    const goToHome = () => {
        navigate("/cine");  // Redirigir a la página principal
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom sx={{ mt: 4 }}>
                ¡Reserva Confirmada! 🎉
            </Typography>

            <Typography variant="h6" align="center" gutterBottom>
                Gracias por tu reserva. Aquí están los detalles:
            </Typography>

            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: 3, backgroundColor: "#f0f0f0", borderRadius: 2 }}>
                        <Typography variant="h6">Película: {roomName}</Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Asientos seleccionados: {selectedSeats.join(", ")}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Precio Total: ${totalPrice}
                        </Typography>

                        <Typography variant="body1" sx={{ mt: 2 }}>
                           Fecha de la Reserva: {dateSelected}
                </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 4 }}
                        onClick={goToHome}
                    >
                        Regresar a la Página Principal
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ConfirmationPage;
