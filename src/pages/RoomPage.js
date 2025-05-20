import {
    Box,
    Button,
    CardMedia,
    Chip,
    Container,
    Divider,
    Grid,
    Paper,
    Typography,
    useTheme
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const RoomPage = () => {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        axios.get(`http://localhost:3000/api/rooms/${id}`)
            .then(response => setRoom(response.data))
            .catch(error => console.error("Error al cargar la sala:", error));
    }, [id]);

    const formatTime = (timeString) => {
        if (!timeString) return "Horario no disponible";
        
        try {
            if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
                const [hours, minutes] = timeString.split(':');
                const hour = parseInt(hours, 10);
                const period = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour % 12 || 12;
                return `${displayHour}:${minutes} ${period}`;
            }
            
            const date = new Date(timeString);
            return date.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch {
            return timeString;
        }
    };

    if (!room) return (
        <Container sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '80vh'
        }}>
            <Typography variant="h5" color="textSecondary">
                Cargando información de la sala...
            </Typography>
        </Container>
    );

    const handleReservation = () => {
        navigate(`/rooms/${id}/reservar`, { 
            state: { 
                room, 
                pricePerSeat: room.price || 0
            } 
        });
    };

    const handleBackToCine = () => {
        navigate('/cine');
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
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ 
                    textAlign: 'center', 
                    mb: 6,
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '150px',
                        height: '4px',
                        background: `linear-gradient(90deg, transparent 0%, ${theme.palette.secondary.main} 50%, transparent 100%)`,
                        borderRadius: '2px'
                    }
                }}>
                    <Typography variant="h2" component="h1" sx={{ 
                        fontWeight: 800,
                        letterSpacing: '0.05em',
                        mb: 1,
                        textShadow: `0 2px 10px rgba(0,0,0,0.1)`,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        {room.movie_name}
                    </Typography>
                    <Typography variant="h5" sx={{
                        color: theme.palette.text.secondary,
                        fontStyle: 'italic',
                        fontWeight: 300
                    }}>
                        {room.genre}
                    </Typography>
                </Box>

                <Grid container spacing={6}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            position: 'relative',
                            height: '100%',
                            '&:hover': {
                                '&::before': {
                                    transform: 'rotate(5deg) translateY(10px)'
                                }
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: `linear-gradient(45deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                                borderRadius: '16px',
                                transform: 'rotate(3deg)',
                                zIndex: -1,
                                transition: 'transform 0.3s ease'
                            }
                        }}>
                            <Paper elevation={8} sx={{ 
                                borderRadius: 3,
                                overflow: 'hidden',
                                height: '100%',
                                display: 'flex',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: `0 15px 30px -5px ${theme.palette.primary.light}`
                                }
                            }}>
                                <CardMedia
                                    component="img"
                                    image={room.movie_poster_url || "https://via.placeholder.com/600x900"}
                                    alt={room.movie_name}
                                    sx={{
                                        width: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </Paper>
                        </Box>
                    </Grid>

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
                            <Typography variant="h4" component="h2" sx={{ 
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
                                Detalles de la Sala
                            </Typography>

                            <Box sx={{ mb: 3 }}>
                                <Chip 
                                    label={`Sala ${room.name}`} 
                                    color="primary" 
                                    size="medium"
                                    sx={{ 
                                        mr: 1,
                                        mb: 1,
                                        fontSize: '1rem',
                                        padding: '8px 16px',
                                        fontWeight: 600,
                                        boxShadow: `0 2px 4px ${theme.palette.primary.light}`
                                    }} 
                                />
                                <Chip 
                                    label={`${room.duration} min`} 
                                    variant="outlined"
                                    sx={{ 
                                        mr: 1,
                                        mb: 1,
                                        fontSize: '1rem',
                                        padding: '8px 16px',
                                        fontWeight: 600,
                                        borderColor: theme.palette.secondary.main,
                                        color: theme.palette.secondary.dark
                                    }} 
                                />
                            </Box>

                            <Divider sx={{ 
                                my: 3,
                                background: `linear-gradient(90deg, transparent 0%, ${theme.palette.grey[300]} 50%, transparent 100%)`,
                                height: '1px'
                            }} />

                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ 
                                    mb: 2, 
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&::before': {
                                        content: '""',
                                        display: 'inline-block',
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: theme.palette.primary.main,
                                        marginRight: '12px'
                                    }
                                }}>
                                    Información de la Función
                                </Typography>
                                
                                <Box sx={{ 
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                    gap: 3,
                                    mb: 3
                                }}>
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: '8px',
                                        background: 'rgba(0, 0, 0, 0.02)',
                                        borderLeft: `4px solid ${theme.palette.primary.main}`
                                    }}>
                                        <Typography variant="body1" color="textSecondary">
                                            Capacidad:
                                        </Typography>
                                        <Typography variant="body1" sx={{ 
                                            fontWeight: 600,
                                            color: theme.palette.primary.dark
                                        }}>
                                            {room.num_rows * room.num_columns} asientos
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: '8px',
                                        background: 'rgba(0, 0, 0, 0.02)',
                                        borderLeft: `4px solid ${theme.palette.secondary.main}`
                                    }}>
                                        <Typography variant="body1" color="textSecondary">
                                            Horario:
                                        </Typography>
                                        <Typography variant="body1" sx={{ 
                                            fontWeight: 600,
                                            color: theme.palette.secondary.dark
                                        }}>
                                            {formatTime(room.hour)}
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: '8px',
                                        background: 'rgba(0, 0, 0, 0.02)',
                                        borderLeft: `4px solid ${theme.palette.success.main}`
                                    }}>
                                        <Typography variant="body1" color="textSecondary">
                                            Precio por asiento:
                                        </Typography>
                                        <Typography variant="body1" sx={{ 
                                            fontWeight: 600,
                                            color: theme.palette.success.dark
                                        }}>
                                            ${room.price || "No especificado"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Divider sx={{ 
                                my: 3,
                                background: `linear-gradient(90deg, transparent 0%, ${theme.palette.grey[300]} 50%, transparent 100%)`,
                                height: '1px'
                            }} />

                            <Box sx={{ 
                                display: 'flex', 
                                gap: 2,
                                '& > *': {
                                    flex: 1
                                }
                            }}>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={handleBackToCine}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        borderWidth: 2,
                                        borderColor: theme.palette.grey[400],
                                        color: theme.palette.text.primary,
                                        '&:hover': {
                                            borderWidth: 2,
                                            borderColor: theme.palette.primary.main,
                                            color: theme.palette.primary.main,
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 4px 12px ${theme.palette.grey[300]}`
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Volver
                                </Button>
                                
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleReservation}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                        boxShadow: `0 4px 6px ${theme.palette.primary.light}`,
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 8px 15px ${theme.palette.primary.light}`,
                                            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Reservar Asientos
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default RoomPage;