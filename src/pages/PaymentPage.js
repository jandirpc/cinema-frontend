import {
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Paper,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const { user } = useContext(AuthContext);

    const { selectedSeats, room, totalPrice, dateSelected } = location.state || {};
    
    const roomName = room?.name || "Sala no especificada";
    const movieName = room?.movie_name || "Película no especificada";
    const schedule = room?.hour || "Horario no especificado";
    
    const [formData, setFormData] = useState({
        name: "",
        cardNumber: "",
        expiryDate: "",
        cvv: ""
    });
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handlePayment = async () => {
        // Validar campos del formulario
        if (!formData.name || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
            setPaymentError("Por favor, completa todos los campos del formulario.");
            return;
        }

        // Validar formato de tarjeta (simplificado)
        if (formData.cardNumber.length !== 16 || !/^\d+$/.test(formData.cardNumber)) {
            setPaymentError("Por favor ingresa un número de tarjeta válido (16 dígitos).");
            return;
        }

        // Validar formato de fecha (MM/AA)
        if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            setPaymentError("Por favor ingresa una fecha de vencimiento válida (MM/AA).");
            return;
        }

        // Validar CVV
        if (formData.cvv.length !== 3 || !/^\d+$/.test(formData.cvv)) {
            setPaymentError("Por favor ingresa un CVV válido (3 dígitos).");
            return;
        }

        setIsProcessing(true);
        setPaymentError(null);

        try {
            // Usar el ID del usuario autenticado
            const user_id = user?.id;
            
            if (!user_id) {
                throw new Error("No se pudo identificar al usuario. Por favor inicia sesión nuevamente.");
            }

            // Crear reservas para cada asiento seleccionado
            const reservationPromises = selectedSeats.map(seat => {
                const [seat_row, seat_column] = seat.split('-').map(Number);
                
                return axios.post('http://localhost:3000/api/reservations', {
                    user_id,
                    room_id: room.id,
                    seat_row,
                    seat_column,
                    reservation_date: dateSelected
                });
            });

            // Esperar a que todas las reservas se completen
            await Promise.all(reservationPromises);
            
            // Redirigir a página de confirmación con éxito
            navigate('/confirmar-reserva', { 
                state: { 
                    selectedSeats, 
                    roomName: room.name,
                    movieName: room.movie_name,
                    room,
                    totalPrice,
                    dateSelected,
                    success: true
                }
            });
        } catch (error) {
            console.error("Error al crear reservas:", error);
            
            let errorMessage = "Ocurrió un error al procesar tu reserva. Por favor intenta nuevamente.";
            
            if (error.response) {
                if (error.response.status === 400) {
                    errorMessage = error.response.data.message || "Algunos asientos ya están reservados. Por favor selecciona otros asientos.";
                } else if (error.response.status === 500) {
                    errorMessage = "Error del servidor. Por favor intenta más tarde.";
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setPaymentError(errorMessage);
        } finally {
            setIsProcessing(false);
        }
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
                    No hay información de reserva disponible. Por favor selecciona asientos primero.
                </Typography>
            </Container>
        );
    }

    const formatScheduleTime = (timeString) => {
        if (!timeString) return "Horario no especificado";
        try {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours, 10);
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${minutes} ${period}`;
        } catch {
            return timeString;
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
                <Typography variant="subtitle1" color="text.secondary">
                    Completa tus datos de pago para confirmar la reserva
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
                                {formatScheduleTime(schedule)}
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

                {/* Formulario de pago */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                            Información de pago
                        </Typography>

                        {paymentError && (
                            <Box sx={{ 
                                backgroundColor: theme.palette.error.light,
                                color: theme.palette.error.contrastText,
                                p: 2,
                                mb: 3,
                                borderRadius: 1
                            }}>
                                <Typography>{paymentError}</Typography>
                            </Box>
                        )}

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nombre en la tarjeta"
                                    variant="outlined"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={isProcessing}
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
                                    disabled={isProcessing}
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
                                    disabled={isProcessing}
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
                                    type="password"
                                    inputProps={{ maxLength: 3 }}
                                    disabled={isProcessing}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handlePayment}
                            disabled={isProcessing}
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
                            {isProcessing ? (
                                <>
                                    <CircularProgress size={24} sx={{ color: 'white', mr: 2 }} />
                                    Procesando pago...
                                </>
                            ) : (
                                'Confirmar Pago'
                            )}
                        </Button>

                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
                            Tus datos de pago están protegidos con encriptación SSL. No almacenamos información de tarjetas.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default PaymentPage;