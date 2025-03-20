import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Desestructuración de los datos pasados desde la página anterior
    const { selectedSeats, roomName, totalPrice, dateSelected } = location.state || {};

    // Estado para los datos del formulario
    const [formData, setFormData] = useState({
        name: "",
        cardNumber: "",
        expiryDate: "",
        cvv: ""
    });

    // Función para manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Función para procesar el pago
    const handlePayment = () => {
        // Verifica si el formulario tiene los datos completos
        if (!formData.name || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
            alert("Por favor, completa todos los campos del formulario.");
            return;
        }
    
        // Redirige automáticamente a la página de confirmación
        navigate(`/confirmar-reserva`, { 
            state: { 
                selectedSeats, 
                roomName, 
                totalPrice,
                dateSelected,  // Pasamos la fecha seleccionada
            }
        });
    };    

    // Si no hay información de asientos o precio, muestra un mensaje de error
    if (!selectedSeats || selectedSeats.length === 0 || totalPrice === 0) {
        return <Typography align="center">No hay información disponible para mostrar.</Typography>;
    }

    return (
        <Box sx={{ padding: 4 }}>
            {/* Título de la página */}
            <Typography variant="h4" align="center" gutterBottom>
                🎬 Confirmación de Reserva - {roomName}
            </Typography>

            {/* Resumen de los asientos seleccionados */}
            <Paper sx={{ padding: 3, marginBottom: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Asientos Seleccionados:
                </Typography>
                <Grid container spacing={1}>
                    {selectedSeats.map((seat, index) => (
                        <Grid item xs={4} key={index}>
                            <Button variant="outlined" disabled>
                                {seat}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* Resumen de pago */}
            <Paper sx={{ padding: 3, marginBottom: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Resumen de Pago
                </Typography>
                <Typography variant="body1">
                    Total a Pagar: <strong>${totalPrice.toFixed(2)}</strong>
                </Typography>
                <Typography variant="body1">
                    Fecha de la Reserva: <strong>{dateSelected}</strong>
                </Typography>
            </Paper>

            {/* Formulario de pago */}
            <Paper sx={{ padding: 3, marginBottom: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Información de Pago
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Nombre Completo"
                            variant="outlined"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Número de Tarjeta"
                            variant="outlined"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Fecha de Expiración"
                            variant="outlined"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="CVV"
                            variant="outlined"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            type="number"
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Botón para proceder con el pago */}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 3 }}
                onClick={handlePayment}
            >
                Proceder con el Pago
            </Button>
        </Box>
    );
};

export default PaymentPage;
