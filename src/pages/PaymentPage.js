import { Box, Button, Container, Divider, Grid, Paper, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();

    const { selectedSeats, room, totalPrice, dateSelected } = location.state || {};
    
    const roomName = room?.name || "Sala no especificada";
    const movieName = room?.movie_name || "Película no especificada";
    const schedule = room?.schedule || "Horario no especificado";
    const [formData, setFormData] = useState({
        name: "",
        cardNumber: "",
        expiryDate: "",
        cvv: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handlePayment = () => {
        if (!formData.name || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
            alert("Por favor, completa todos los campos del formulario.");
            return;
        }
    
        navigate(`/confirmar-reserva`, { 
            state: { 
                selectedSeats, 
                roomName: room.name,
                room,
                totalPrice,
                dateSelected,
            }
        });
    };    

    if (!selectedSeats || selectedSeats.length === 0 || totalPrice === 0 || !room) {
        return (
            <Container sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '80vh'
            }}>
                <Typography variant="h5" color="textSecondary">
                    No hay información disponible para mostrar.
                </Typography>
            </Container>
        );
    }

    const formatScheduleTime = (scheduleString) => {
        if (!scheduleString) return "Horario no especificado";
        try {
            const date = new Date(scheduleString);
            return date.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch {
            return scheduleString;
        }
    };

    const formatSelectedDate = (dateString) => {
        if (!dateString) return "Fecha no especificada";
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Encabezado */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ 
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2
                }}>
                    Confirmación de Pago
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Resumen de la compra */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                            Detalles de la función
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" color="text.secondary">
                                Película:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {movieName}
                            </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" color="text.secondary">
                                Sala:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {roomName}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" color="text.secondary">
                                Horario:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {formatScheduleTime(schedule)} {/* Mostramos el horario de la sala */}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" color="text.secondary">
                                Fecha:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {formatSelectedDate(dateSelected)}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Asientos seleccionados:
                            </Typography>
                            <Box sx={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                gap: 1,
                                mb: 2
                            }}>
                                {selectedSeats.map((seat, index) => (
                                    <Box key={index} sx={{
                                        px: 2,
                                        py: 1,
                                        backgroundColor: theme.palette.primary.light,
                                        color: theme.palette.primary.contrastText,
                                        borderRadius: 1,
                                        fontWeight: 500
                                    }}>
                                        {seat}
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 3
                        }}>
                            <Typography variant="h6">
                                Total a pagar:
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                ${totalPrice.toFixed(2)}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Formulario de pago (se mantiene igual) */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                            Información de pago
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nombre en la tarjeta"
                                    variant="outlined"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Número de tarjeta"
                                    variant="outlined"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    inputProps={{ maxLength: 16 }}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="MM/AA"
                                    variant="outlined"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    placeholder="MM/AA"
                                    sx={{ mb: 2 }}
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
                                    inputProps={{ maxLength: 3 }}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handlePayment}
                            sx={{
                                mt: 3,
                                py: 2,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 4px 12px ${theme.palette.primary.light}`
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Confirmar Pago
                        </Button>

                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
                            Tu información de pago está protegida con encriptación SSL
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default PaymentPage;