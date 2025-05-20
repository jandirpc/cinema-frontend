import {
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    Grid,
    IconButton,
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
        if (!formData.name || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
            setPaymentError("Por favor, completa todos los campos del formulario.");
            return;
        }

        if (formData.cardNumber.length !== 16 || !/^\d+$/.test(formData.cardNumber)) {
            setPaymentError("Por favor ingresa un número de tarjeta válido (16 dígitos).");
            return;
        }

        if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            setPaymentError("Por favor ingresa una fecha de vencimiento válida (MM/AA).");
            return;
        }

        if (formData.cvv.length !== 3 || !/^\d+$/.test(formData.cvv)) {
            setPaymentError("Por favor ingresa un CVV válido (3 dígitos).");
            return;
        }

        setIsProcessing(true);
        setPaymentError(null);

        try {
            const user_id = user?.id;
            
            if (!user_id) {
                throw new Error("No se pudo identificar al usuario. Por favor inicia sesión nuevamente.");
            }

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

            await Promise.all(reservationPromises);
            
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

    const handleBackClick = () => {
        navigate(-1);
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
        <Box sx={{
            background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[100]} 100%)`,
            minHeight: '100vh',
            py: 6,
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '300px',
                background: `linear-gradient(to bottom, ${theme.palette.primary.dark} 0%, transparent 100%)`,
                zIndex: 0,
                opacity: 0.1
            }
        }}>
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 4,
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-10px',
                        left: 0,
                        width: '100px',
                        height: '4px',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        borderRadius: '2px'
                    }
                }}>
                    <IconButton 
                        onClick={handleBackClick}
                        sx={{ 
                            mr: 2,
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,1)',
                                transform: 'translateX(-2px)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <span style={{ 
                            fontSize: '1.5rem',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>←</span>
                    </IconButton>
                    <Typography variant="h3" sx={{ 
                        fontWeight: 800,
                        letterSpacing: '0.05em',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        Confirmación de Pago
                    </Typography>
                </Box>

                <Typography variant="subtitle1" color="text.secondary" sx={{ 
                    mb: 4,
                    textAlign: 'center',
                    fontStyle: 'italic'
                }}>
                    Completa tus datos de pago para confirmar la reserva
                </Typography>

                <Grid container spacing={4}>
                    {/* Resumen de la compra */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ 
                            p: 4, 
                            borderRadius: 3, 
                            height: '100%',
                            background: 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.15)`,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '-50%',
                                right: '-50%',
                                width: '200%',
                                height: '200%',
                                background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, transparent 70%)`,
                                opacity: 0.1,
                                zIndex: -1
                            }
                        }}>
                            <Typography variant="h5" sx={{ 
                                mb: 3, 
                                fontWeight: 700,
                                color: theme.palette.primary.dark,
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-8px',
                                    left: 0,
                                    width: '60px',
                                    height: '4px',
                                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    borderRadius: '2px'
                                }
                            }}>
                                Detalles de la función
                            </Typography>
                            
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" color="text.secondary">
                                    Película:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {movieName}
                                </Typography>
                            </Box>
                            
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" color="text.secondary">
                                    Sala:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {roomName}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" color="text.secondary">
                                    Horario:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {formatScheduleTime(schedule)}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" color="text.secondary">
                                    Fecha:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {formatSelectedDate(dateSelected)}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                    Asientos seleccionados:
                                </Typography>
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexWrap: 'wrap', 
                                    gap: 1.5,
                                    mb: 2
                                }}>
                                    {selectedSeats.map((seat, index) => (
                                        <Box key={index} sx={{
                                            px: 2,
                                            py: 1,
                                            backgroundColor: theme.palette.primary.light,
                                            color: theme.palette.primary.contrastText,
                                            borderRadius: 1,
                                            fontWeight: 600,
                                            boxShadow: `0 2px 4px ${theme.palette.primary.light}`,
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 4px 8px ${theme.palette.primary.light}`
                                            }
                                        }}>
                                            {seat}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            <Divider sx={{ 
                                my: 3,
                                background: `linear-gradient(90deg, transparent 0%, ${theme.palette.grey[300]} 50%, transparent 100%)`,
                                height: '1px'
                            }} />

                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mt: 3
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Total a pagar:
                                </Typography>
                                <Typography variant="h4" sx={{ 
                                    fontWeight: 800,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    ${totalPrice.toFixed(2)}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Formulario de pago */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ 
                            p: 4, 
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.15)`,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '-50%',
                                right: '-50%',
                                width: '200%',
                                height: '200%',
                                background: `radial-gradient(circle, ${theme.palette.secondary.light} 0%, transparent 70%)`,
                                opacity: 0.1,
                                zIndex: -1
                            }
                        }}>
                            <Typography variant="h5" sx={{ 
                                mb: 3, 
                                fontWeight: 700,
                                color: theme.palette.primary.dark,
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-8px',
                                    left: 0,
                                    width: '60px',
                                    height: '4px',
                                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    borderRadius: '2px'
                                }
                            }}>
                                Información de pago
                            </Typography>

                            {paymentError && (
                                <Box sx={{ 
                                    backgroundColor: theme.palette.error.light,
                                    color: theme.palette.error.contrastText,
                                    p: 2,
                                    mb: 3,
                                    borderRadius: 1,
                                    borderLeft: `4px solid ${theme.palette.error.main}`,
                                    boxShadow: `0 2px 8px ${theme.palette.error.light}`
                                }}>
                                    <Typography sx={{ fontWeight: 500 }}>{paymentError}</Typography>
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
                                        InputProps={{
                                            sx: {
                                                borderRadius: '12px',
                                                backgroundColor: 'rgba(255,255,255,0.9)',
                                                '& fieldset': {
                                                    borderColor: theme.palette.grey[300]
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: theme.palette.primary.light
                                                }
                                            }
                                        }}
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
                                        InputProps={{
                                            sx: {
                                                borderRadius: '12px',
                                                backgroundColor: 'rgba(255,255,255,0.9)',
                                                '& fieldset': {
                                                    borderColor: theme.palette.grey[300]
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: theme.palette.primary.light
                                                }
                                            }
                                        }}
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
                                        InputProps={{
                                            sx: {
                                                borderRadius: '12px',
                                                backgroundColor: 'rgba(255,255,255,0.9)',
                                                '& fieldset': {
                                                    borderColor: theme.palette.grey[300]
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: theme.palette.primary.light
                                                }
                                            }
                                        }}
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
                                        InputProps={{
                                            sx: {
                                                borderRadius: '12px',
                                                backgroundColor: 'rgba(255,255,255,0.9)',
                                                '& fieldset': {
                                                    borderColor: theme.palette.grey[300]
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: theme.palette.primary.light
                                                }
                                            }
                                        }}
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
                                    fontWeight: 700,
                                    borderRadius: '12px',
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    boxShadow: `0 4px 6px ${theme.palette.primary.light}`,
                                    letterSpacing: '0.05em',
                                    '&:hover': {
                                        transform: 'translateY(-3px)',
                                        boxShadow: `0 8px 15px ${theme.palette.primary.light}`,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)'
                                    },
                                    '&:disabled': {
                                        background: theme.palette.grey[400],
                                        transform: 'none',
                                        boxShadow: 'none'
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
                                    'CONFIRMAR PAGO →'
                                )}
                            </Button>

                            <Typography variant="body2" color="text.secondary" sx={{ 
                                mt: 3, 
                                textAlign: 'center',
                                fontStyle: 'italic',
                                opacity: 0.8
                            }}>
                                Tus datos de pago están protegidos con encriptación SSL. No almacenamos información de tarjetas.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default PaymentPage;