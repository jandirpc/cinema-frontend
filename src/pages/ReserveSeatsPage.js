import {
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    IconButton,
    Paper,
    TextField,
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
        width: 50,
        height: 50,
        minWidth: 50,
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1rem',
        fontWeight: 'bold',
        backgroundColor: isReserved 
            ? theme.palette.error.light
            : isSelected 
                ? theme.palette.primary.light
                : theme.palette.success.light,
        color: isReserved 
            ? theme.palette.error.dark
            : isSelected 
                ? theme.palette.primary.dark
                : theme.palette.success.dark,
        border: `2px solid ${
            isReserved 
                ? theme.palette.error.main 
                : isSelected 
                    ? theme.palette.primary.main 
                    : theme.palette.success.main
        }`,
        boxShadow: isSelected ? `0 0 15px ${theme.palette.primary.main}` : 'none',
        transform: isSelected ? 'translateY(-5px)' : 'none',
        '&:hover': {
            transform: !isReserved ? (isSelected ? 'translateY(-5px) scale(1.05)' : 'translateY(-3px)') : 'none',
            boxShadow: !isReserved ? `0 4px 12px rgba(0,0,0,0.3)` : 'none'
        },
        transition: 'all 0.2s ease',
        cursor: isReserved ? 'not-allowed' : 'pointer',
        position: 'relative',
        '&:after': isSelected ? {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 20,
            height: 8,
            backgroundColor: theme.palette.primary.main,
            borderRadius: '50%',
            filter: 'blur(4px)',
            opacity: 0.7
        } : {}
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
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[100]} 100%)`
            }}>
                <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
            </Box>
        );
    }

    if (!room) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[100]} 100%)`
            }}>
                <Typography variant="h5" color="error" sx={{ fontWeight: 600 }}>
                    Error al cargar la sala. Intenta nuevamente.
                </Typography>
            </Box>
        );
    }

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
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
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
                        onClick={() => navigate(-1)} 
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
                    <Typography variant="h4" sx={{ 
                        fontWeight: 800,
                        letterSpacing: '0.05em',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        Reserva de Asientos
                    </Typography>
                </Box>

                {/* Información de la película */}
                <Paper elevation={3} sx={{ 
                    p: 4, 
                    mb: 4, 
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
                        background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, transparent 70%)`,
                        opacity: 0.1,
                        zIndex: -1
                    }
                }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box
                                component="img"
                                src={room.movie_poster_url || "https://via.placeholder.com/400x600"}
                                alt={room.movie_name}
                                sx={{ 
                                    borderRadius: 3,
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
                                    transform: 'translateZ(0)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px) translateZ(0)',
                                        boxShadow: '0 16px 32px rgba(0,0,0,0.25)'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h4" sx={{ 
                                mb: 3, 
                                fontWeight: 800,
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
                                {room.movie_name}
                            </Typography>
                            <Box sx={{ 
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                p: 3,
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                borderLeft: `4px solid ${theme.palette.primary.main}`
                            }}>
                                <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                                    <Box component="span" sx={{ 
                                        fontWeight: 700,
                                        color: theme.palette.primary.dark,
                                        mr: 1
                                    }}>Sala:</Box> {room.name}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                                    <Box component="span" sx={{ 
                                        fontWeight: 700,
                                        color: theme.palette.primary.dark,
                                        mr: 1
                                    }}>Duración:</Box> {room.duration} minutos
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                                    <Box component="span" sx={{ 
                                        fontWeight: 700,
                                        color: theme.palette.primary.dark,
                                        mr: 1
                                    }}>Precio por asiento:</Box> ${room.price || "0.00"}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                                    <Box component="span" sx={{ 
                                        fontWeight: 700,
                                        color: theme.palette.primary.dark,
                                        mr: 1
                                    }}>Hora:</Box> {formatTime(room.hour)}
                                </Typography>

                                {dateSelected && (
                                    <>
                                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                                            <Box component="span" sx={{ 
                                                fontWeight: 700,
                                                color: theme.palette.primary.dark,
                                                mr: 1
                                            }}>Fecha:</Box> {formatDate(dateSelected)}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                                            <Box component="span" sx={{ 
                                                fontWeight: 700,
                                                color: theme.palette.primary.dark,
                                                mr: 1
                                            }}>Asientos disponibles:</Box> {availableSeats} de {totalSeats}
                                        </Typography>
                                        <Box sx={{ 
                                            width: '100%',
                                            height: 10,
                                            backgroundColor: theme.palette.grey[200],
                                            borderRadius: 5,
                                            overflow: 'hidden',
                                            mt: 2
                                        }}>
                                            <Box sx={{ 
                                                width: `${(availableSeats / totalSeats) * 100}%`,
                                                height: '100%',
                                                background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
                                                transition: 'width 0.5s ease',
                                                boxShadow: `inset 0 0 8px rgba(0,0,0,0.1)`
                                            }} />
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Selector de fecha */}
                <Paper elevation={3} sx={{ 
                    p: 4, 
                    mb: 4, 
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.15)`
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
                        Selecciona la fecha de tu función
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <TextField
                            type="date"
                            value={dateSelected}
                            onChange={handleDateChange}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                                min: new Date().toISOString().split("T")[0],
                                max: new Date(new Date().setDate(new Date().getDate() + 8)).toISOString().split("T")[0]
                            }}
                            sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
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
                        {loadingReservations && <CircularProgress size={28} sx={{ color: theme.palette.primary.main }} />}
                    </Box>
                    {errorMessage && (
                        <Typography color="error" variant="body2" sx={{ 
                            mt: 2,
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: 'rgba(255,0,0,0.05)',
                            display: 'inline-block'
                        }}>
                            {errorMessage}
                        </Typography>
                    )}
                </Paper>

                {/* Mapa de asientos */}
                <Paper elevation={3} sx={{ 
                    p: 4, 
                    mb: 4, 
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.15)`
                }}>
                    <Typography variant="h5" sx={{ 
                        mb: 4, 
                        textAlign: 'center',
                        fontWeight: 700,
                        color: theme.palette.primary.dark,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '100px',
                            height: '4px',
                            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            borderRadius: '2px'
                        }
                    }}>
                        Selecciona tus asientos
                    </Typography>
                    
                    {/* Pantalla del cine */}
                    <Box sx={{ 
                        width: '80%',
                        height: '40px',
                        background: `linear-gradient(to right, ${theme.palette.grey[400]}, ${theme.palette.grey[700]})`,
                        mb: 5,
                        mx: 'auto',
                        borderRadius: '50%/20px',
                        boxShadow: `0 10px 20px rgba(0,0,0,0.3), inset 0 -5px 10px rgba(0,0,0,0.2)`,
                        textAlign: 'center',
                        color: 'white',
                        fontSize: '1rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: '3px',
                        fontWeight: 600,
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: 0,
                            right: 0,
                            height: '1px',
                            backgroundColor: 'rgba(255,255,255,0.2)'
                        }
                    }}>
                        Pantalla
                    </Box>

                    {/* Asientos */}
                    {loadingReservations ? (
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            py: 6,
                            '& > *': {
                                color: theme.palette.primary.main
                            }
                        }}>
                            <CircularProgress size={60} thickness={4} />
                        </Box>
                    ) : (
                        <Grid container spacing={2} justifyContent="center">
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
                                                        {rowIndex + 1}-{colIndex + 1}
                                                    </Box>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: 4, 
                        mt: 6,
                        flexWrap: 'wrap',
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        p: 3,
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                                width: 28,
                                height: 28,
                                backgroundColor: theme.palette.success.light,
                                border: `2px solid ${theme.palette.success.main}`,
                                borderRadius: '6px',
                                boxShadow: `0 2px 4px ${theme.palette.success.light}`
                            }} />
                            <Typography sx={{ fontWeight: 500 }}>Disponible</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                                width: 28,
                                height: 28,
                                backgroundColor: theme.palette.primary.light,
                                border: `2px solid ${theme.palette.primary.main}`,
                                borderRadius: '6px',
                                boxShadow: `0 0 8px ${theme.palette.primary.main}`
                            }} />
                            <Typography sx={{ fontWeight: 500 }}>Seleccionado</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                                width: 28,
                                height: 28,
                                backgroundColor: theme.palette.error.light,
                                border: `2px solid ${theme.palette.error.main}`,
                                borderRadius: '6px'
                            }} />
                            <Typography sx={{ fontWeight: 500 }}>Reservado</Typography>
                        </Box>
                    </Box>
                </Paper>

                <Paper elevation={3} sx={{ 
                    p: 4, 
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.15)`
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
                        Resumen de tu reserva
                    </Typography>
                    <Box sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        p: 3,
                        borderRadius: 2,
                        mb: 4,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        borderLeft: `4px solid ${theme.palette.primary.main}`
                    }}>
                        <Typography sx={{ mb: 2, fontWeight: 500 }}>
                            <Box component="span" sx={{ 
                                fontWeight: 700,
                                color: theme.palette.primary.dark,
                                mr: 1
                            }}>Asientos seleccionados:</Box> 
                            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Ninguno"}
                        </Typography>
                        <Typography sx={{ mb: 2, fontWeight: 500 }}>
                            <Box component="span" sx={{ 
                                fontWeight: 700,
                                color: theme.palette.primary.dark,
                                mr: 1
                            }}>Total a pagar:</Box> 
                            ${(selectedSeats.length * room.price).toFixed(2)}
                        </Typography>
                        {dateSelected && (
                            <>
                                <Typography sx={{ mb: 2, fontWeight: 500 }}>
                                    <Box component="span" sx={{ 
                                        fontWeight: 700,
                                        color: theme.palette.primary.dark,
                                        mr: 1
                                    }}>Fecha:</Box> 
                                    {formatDate(dateSelected)}
                                </Typography>
                                {room.hour && (
                                    <Typography sx={{ mb: 2, fontWeight: 500 }}>
                                        <Box component="span" sx={{ 
                                            fontWeight: 700,
                                            color: theme.palette.primary.dark,
                                            mr: 1
                                        }}>Hora:</Box> 
                                        {formatTime(room.hour)}
                                    </Typography>
                                )}
                            </>
                        )}
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={confirmReservation}
                        disabled={!dateSelected || selectedSeats.length === 0 || loadingReservations}
                        sx={{
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
                        {loadingReservations ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'CONFIRMAR RESERVA →'
                        )}
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
};

export default ReserveSeatsPage;