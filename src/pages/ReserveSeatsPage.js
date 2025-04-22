import {
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    IconButton,
    Paper,
    Typography,
    useTheme
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ReserveSeatsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const [room, setRoom] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [dateSelected, setDateSelected] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [reservedSeats, setReservedSeats] = useState([]);
    const [loadingReservations, setLoadingReservations] = useState(false);
    const [loadingRoom, setLoadingRoom] = useState(true);
    const [availableSeats, setAvailableSeats] = useState(0);
    const [totalSeats, setTotalSeats] = useState(0);

    // Cargar información de la sala
    useEffect(() => {
        setLoadingRoom(true);
        axios.get(`http://localhost:3000/api/rooms/${id}`)
            .then(response => {
                setRoom(response.data);
                const total = response.data.num_rows * response.data.num_columns;
                setTotalSeats(total);
                setAvailableSeats(total);
                setLoadingRoom(false);
            })
            .catch(error => {
                console.error("Error al cargar la sala:", error);
                setLoadingRoom(false);
            });
    }, [id]);

    // Cargar reservas cuando cambia la fecha seleccionada
    useEffect(() => {
        if (dateSelected && room) {
            const loadReservations = async () => {
                setLoadingReservations(true);
                try {
                    const response = await axios.get(`http://localhost:3000/api/reservations`, {
                        params: {
                            room_id: id,
                            date: dateSelected
                        }
                    });
                    
                    const reserved = response.data.map(res => ({
                        row: res.seat_row,
                        column: res.seat_column,
                        id: `${res.seat_row}-${res.seat_column}`
                    }));
                    
                    setReservedSeats(reserved);
                    const available = totalSeats - reserved.length;
                    setAvailableSeats(available > 0 ? available : 0);
                } catch (error) {
                    console.error("Error al cargar reservas:", error);
                    setReservedSeats([]);
                    setAvailableSeats(totalSeats);
                } finally {
                    setLoadingReservations(false);
                }
            };

            loadReservations();
        } else {
            setReservedSeats([]);
            setAvailableSeats(totalSeats);
        }
    }, [dateSelected, room, id, totalSeats]);

    const toggleSeatSelection = (seatId) => {
        if (reservedSeats.some(seat => seat.id === seatId)) {
            return;
        }
        
        setSelectedSeats(prev => prev.includes(seatId) 
            ? prev.filter(seat => seat !== seatId)
            : [...prev, seatId]);
    };

    const confirmReservation = () => {
        if (!dateSelected) {
            setErrorMessage("Por favor selecciona una fecha válida");
            return;
        }
        if (selectedSeats.length === 0) {
            setErrorMessage("Por favor selecciona al menos un asiento");
            return;
        }
        
        navigate(`/simulacion-pago/${id}`, {
            state: { 
                selectedSeats, 
                room, 
                totalPrice: selectedSeats.length * room.price,
                dateSelected
            }
        });
    };

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 8);
        maxDate.setHours(0, 0, 0, 0);

        const selectedDateObj = new Date(selectedDate);
        selectedDateObj.setHours(0, 0, 0, 0);

        if (selectedDateObj <= maxDate && selectedDateObj >= today) {
            setDateSelected(selectedDate);
            setErrorMessage("");
        } else {
            setDateSelected("");
            setErrorMessage("Selecciona una fecha dentro de los próximos 8 días");
        }
    };

    const seatStyles = (isSelected, isReserved) => ({
        width: 40,
        height: 40,
        minWidth: 40,
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        backgroundColor: isReserved 
            ? '#ffcdd2'
            : isSelected 
                ? '#bbdefb'
                : '#c8e6c9',
        color: isReserved 
            ? '#d32f2f'
            : isSelected 
                ? '#1976d2'
                : '#388e3c',
        border: `2px solid ${
            isReserved 
                ? '#d32f2f' 
                : isSelected 
                    ? '#1976d2' 
                    : '#388e3c'
        }`,
        '&:hover': {
            transform: !isReserved ? 'scale(1.1)' : 'none',
            opacity: !isReserved ? 0.8 : 1
        },
        transition: 'all 0.2s ease',
        cursor: isReserved ? 'not-allowed' : 'pointer'
    });

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        const date = new Date(year, month - 1, day);
        
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        return date.toLocaleDateString('es-ES', options);
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${period}`;
    };

    if (loadingRoom) {
        return (
            <Container sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '80vh'
            }}>
                <CircularProgress size={60} />
            </Container>
        );
    }

    if (!room) {
        return (
            <Container sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '80vh'
            }}>
                <Typography variant="h5" color="error">
                    Error al cargar la sala. Intenta nuevamente.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header con botón de regreso */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                    <span style={{ fontSize: '1.5rem' }}>←</span>
                </IconButton>
                <Typography variant="h4" sx={{ 
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Reserva de Asientos
                </Typography>
            </Box>

            {/* Información de la película */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Box
                            component="img"
                            src={room.movie_poster_url || "https://via.placeholder.com/400x600"}
                            alt={room.movie_name}
                            sx={{ 
                                borderRadius: 2,
                                width: '100%',
                                height: 'auto',
                                objectFit: 'cover'
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            {room.movie_name}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Sala:</strong> {room.name}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Duración:</strong> {room.duration} minutos
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Precio por asiento:</strong> ${room.price || "0.00"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Hora:</strong> {formatTime(room.hour)}
                        </Typography>

                        {dateSelected && (
                            <>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Fecha:</strong> {formatDate(dateSelected)}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Asientos disponibles:</strong> {availableSeats} de {totalSeats}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                    ({Math.round((availableSeats / totalSeats) * 100)}% de disponibilidad)
                                </Typography>
                            </>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            {/* Selector de fecha */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Selecciona la fecha de tu función
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <input
                        type="date"
                        value={dateSelected}
                        onChange={handleDateChange}
                        min={new Date().toISOString().split("T")[0]}
                        max={new Date(new Date().setDate(new Date().getDate() + 8)).toISOString().split("T")[0]}
                        style={{ 
                            padding: '10px',
                            borderRadius: '4px',
                            border: `1px solid ${theme.palette.divider}`,
                            fontSize: '1rem'
                        }}
                    />
                    {loadingReservations && <CircularProgress size={24} />}
                    {errorMessage && (
                        <Typography color="error" variant="body2">
                            {errorMessage}
                        </Typography>
                    )}
                </Box>
            </Paper>

            {/* Mapa de asientos */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
                    Selecciona tus asientos
                </Typography>
                
                {/* Pantalla del cine */}
                <Box sx={{ 
                    width: '100%',
                    height: '20px',
                    background: 'linear-gradient(to right, #bdc3c7, #2c3e50)',
                    mb: 4,
                    borderRadius: '50%',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    textAlign: 'center',
                    color: 'white',
                    fontSize: '0.8rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    PANTALLA
                </Box>

                {/* Asientos */}
                {loadingReservations ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={1} justifyContent="center">
                        {Array.from({ length: room.num_rows }, (_, rowIndex) => (
                            <Grid item xs={12} key={`row-${rowIndex}`}>
                                <Grid container spacing={1} justifyContent="center">
                                    {Array.from({ length: room.num_columns }, (_, colIndex) => {
                                        const seatId = `${rowIndex + 1}-${colIndex + 1}`;
                                        const isSelected = selectedSeats.includes(seatId);
                                        const isReserved = reservedSeats.some(seat => seat.id === seatId);
                                        
                                        return (
                                            <Grid item key={seatId}>
                                                <Box
                                                    onClick={() => toggleSeatSelection(seatId)}
                                                    sx={seatStyles(isSelected, isReserved)}
                                                >
                                                    {seatId}
                                                </Box>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Leyenda de colores */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 4, 
                    mt: 4,
                    flexWrap: 'wrap'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: '#c8e6c9',
                            border: '2px solid #388e3c',
                            borderRadius: '4px'
                        }} />
                        <Typography>Disponible</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: '#bbdefb',
                            border: '2px solid #1976d2',
                            borderRadius: '4px'
                        }} />
                        <Typography>Seleccionado</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: '#ffcdd2',
                            border: '2px solid #d32f2f',
                            borderRadius: '4px'
                        }} />
                        <Typography>Reservado</Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Resumen y botón de confirmación */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Resumen de tu reserva
                </Typography>
                <Typography sx={{ mb: 1 }}>
                    <strong>Asientos seleccionados:</strong> {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Ninguno"}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                    <strong>Total a pagar:</strong> ${(selectedSeats.length * room.price).toFixed(2)}
                </Typography>
                {dateSelected && (
                    <>
                        <Typography sx={{ mb: 1 }}>
                            <strong>Fecha:</strong> {formatDate(dateSelected)}
                        </Typography>
                        {room.hour && (
                            <Typography sx={{ mb: 3 }}>
                                <strong>Hora:</strong> {formatTime(room.hour)}
                            </Typography>
                        )}
                    </>
                )}

                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={confirmReservation}
                    disabled={!dateSelected || selectedSeats.length === 0 || loadingReservations}
                    sx={{
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
                    {loadingReservations ? 'Cargando...' : 'Confirmar Reserva'}
                </Button>
            </Paper>
        </Container>
    );
};

export default ReserveSeatsPage;