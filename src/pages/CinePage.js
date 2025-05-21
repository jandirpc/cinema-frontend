import {
    Alert,
    AppBar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Snackbar,
    TextField,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const CinePage = () => {
    const [rooms, setRooms] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [anchorEl, setAnchorEl] = useState(null);
    const [hasReservations, setHasReservations] = useState(false);
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const isAdmin = user?.role === 'admin';
    const openMenu = Boolean(anchorEl);

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = () => {
        axios.get("http://localhost:3000/api/rooms")
            .then(response => setRooms(response.data))
            .catch(error => {
                console.error("Error al cargar las salas:", error);
                setSnackbar({ open: true, message: 'Error al cargar salas', severity: 'error' });
            });
    };

    const checkRoomReservations = async (roomId) => {
        try {
            const response = await axios.get("http://localhost:3000/api/reservations", {
                params: { room_id: roomId }
            });
            return response.data.length > 0;
        } catch (error) {
            console.error("Error al verificar reservas:", error);
            return false;
        }
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
        navigate('/login');
    };

    const handleOpenAddDialog = () => {
        handleMenuClose();
        setCurrentRoom({
            name: '',
            movie_name: '',
            movie_poster_url: '',
            duration: '',
            genre: '',
            hour: '',
            price: '',
            num_rows: '',
            num_columns: ''
        });
        setHasReservations(false);
        setOpenDialog(true);
    };

    const handleNavigateToUsers = () => {
        handleMenuClose();
        navigate('/admin/users');
    };

    const handleOpenEditDialog = async (room) => {
        const reservationsExist = await checkRoomReservations(room.id);
        setHasReservations(reservationsExist);
        setCurrentRoom(room);
        setOpenDialog(true);
    };

    const handleOpenDeleteDialog = (room) => {
        setRoomToDelete(room);
        setOpenDeleteDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentRoom(null);
        setHasReservations(false);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setRoomToDelete(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentRoom(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const method = currentRoom.id ? 'put' : 'post';
        const url = currentRoom.id 
            ? `http://localhost:3000/api/rooms/${currentRoom.id}`
            : 'http://localhost:3000/api/rooms';

        axios[method](url, currentRoom)
            .then(() => {
                loadRooms();
                setOpenDialog(false);
                setSnackbar({ 
                    open: true, 
                    message: currentRoom.id ? 'Sala actualizada' : 'Sala creada', 
                    severity: 'success' 
                });
            })
            .catch(error => {
                console.error("Error al guardar sala:", error);
                setSnackbar({ open: true, message: 'Error al guardar sala', severity: 'error' });
            });
    };

    const handleDelete = () => {
        axios.delete(`http://localhost:3000/api/rooms/${roomToDelete.id}`)
            .then(() => {
                loadRooms();
                setOpenDeleteDialog(false);
                setSnackbar({ open: true, message: 'Sala eliminada', severity: 'success' });
            })
            .catch(error => {
                console.error("Error al eliminar sala:", error);
                setSnackbar({ open: true, message: 'Error al eliminar sala', severity: 'error' });
            });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Box sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[100]} 100%)`,
            minHeight: '100vh',
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
            <AppBar position="static" elevation={0} sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                mb: 6,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                position: 'relative',
                zIndex: 1
            }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ 
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        color: 'white',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        fontSize: { xs: '1.1rem', sm: '1.3rem' }
                    }}>
                        <Box sx={{
                            background: 'rgba(255,255,255,0.2)',
                            p: 1,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40
                        }}>
                            🎬
                        </Box>
                        CINEMA ACHERON
                    </Typography>

                    {isAdmin ? (
                        <>
                            <IconButton
                                onClick={handleMenuClick}
                                sx={{
                                    color: 'white',
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                        transform: 'rotate(90deg)'
                                    },
                                    borderRadius: '12px',
                                    p: 1.5,
                                    mr: 1,
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>⋮</span>
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    elevation: 4,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.25))',
                                        mt: 1.5,
                                        borderRadius: '12px',
                                        minWidth: 200,
                                        background: 'rgba(255,255,255,0.95)',
                                        backdropFilter: 'blur(12px)',
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={handleOpenAddDialog} sx={{ 
                                    py: 1.5,
                                    '&:hover': {
                                        backgroundColor: 'rgba(110, 72, 170, 0.1)'
                                    }
                                }}>
                                    <Box sx={{
                                        background: 'rgba(110, 72, 170, 0.1)',
                                        p: 1,
                                        borderRadius: '8px',
                                        mr: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <span style={{ fontSize: '1.2rem', color: theme.palette.primary.main }}>🎬</span>
                                    </Box>
                                    Agregar Sala
                                </MenuItem>
                                <MenuItem onClick={handleNavigateToUsers} sx={{ 
                                    py: 1.5,
                                    '&:hover': {
                                        backgroundColor: 'rgba(110, 72, 170, 0.1)'
                                    }
                                }}>
                                    <Box sx={{
                                        background: 'rgba(110, 72, 170, 0.1)',
                                        p: 1,
                                        borderRadius: '8px',
                                        mr: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <span style={{ fontSize: '1.2rem', color: theme.palette.primary.main }}>👥</span>
                                    </Box>
                                    Gestión Usuarios
                                </MenuItem>
                                <MenuItem onClick={handleLogout} sx={{ 
                                    py: 1.5,
                                    '&:hover': {
                                        backgroundColor: 'rgba(110, 72, 170, 0.1)'
                                    }
                                }}>
                                    <Box sx={{
                                        background: 'rgba(110, 72, 170, 0.1)',
                                        p: 1,
                                        borderRadius: '8px',
                                        mr: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <span style={{ fontSize: '1.2rem', color: theme.palette.primary.main }}>🚪</span>
                                    </Box>
                                    Cerrar Sesión
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button 
                            variant="contained"
                            onClick={handleLogout}
                            sx={{ 
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                                color: theme.palette.primary.dark,
                                fontWeight: 600,
                                borderRadius: '12px',
                                px: 3,
                                textTransform: 'none',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    background: 'rgba(255,255,255,1)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    transform: 'translateY(-2px)'
                                },
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>🚪</span>
                            {!isMobile && "Cerrar Sesión"}
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ pb: 8, position: 'relative', zIndex: 1 }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 6,
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '150px',
                        height: '4px',
                        background: `linear-gradient(90deg, transparent 0%, ${theme.palette.secondary.main} 50%, transparent 100%)`,
                        borderRadius: '2px'
                    }
                }}>
                    <Typography 
                        variant="h3"  
                        gutterBottom 
                        sx={{ 
                            fontWeight: 800,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '0.03em',
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            textAlign: 'center',
                            width: '100%',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        NUESTRA CARTELERA
                    </Typography>
                </Box>
                
                <Grid container spacing={6}>
                    {rooms.map((room) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={room.id}>
                            <Card sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.3s ease',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                background: 'rgba(255,255,255,0.85)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                position: 'relative',
                                '&:hover': {
                                    transform: 'translateY(-10px)',
                                    boxShadow: '0 16px 32px rgba(0,0,0,0.2)',
                                    '&::before': {
                                        opacity: 0.2
                                    }
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '-50%',
                                    right: '-50%',
                                    width: '200%',
                                    height: '200%',
                                    background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, transparent 70%)`,
                                    opacity: 0.1,
                                    zIndex: -1,
                                    transition: 'opacity 0.3s ease'
                                }
                            }}>
                                <Box sx={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover img': {
                                        transform: 'scale(1.05)'
                                    }
                                }}>
                                    <CardMedia
                                        component="img"
                                        height="380"
                                        image={room.movie_poster_url || "https://via.placeholder.com/400x600"}
                                        alt={room.movie_name}
                                        sx={{ 
                                            objectFit: 'cover',
                                            width: '100%',
                                            transition: 'transform 0.5s ease'
                                        }}
                                    />
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: '60px',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)'
                                    }} />
                                </Box>
                                <CardContent sx={{ 
                                    flexGrow: 1,
                                    p: 3
                                }}>
                                    <Typography 
                                        variant="h5" 
                                        component="h2" 
                                        sx={{ 
                                            mb: 1.5,
                                            fontWeight: 700,
                                            color: theme.palette.text.primary,
                                            lineHeight: 1.3,
                                            minHeight: '3.6em',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {room.movie_name}
                                    </Typography>
                                    <Typography 
                                        variant="subtitle1" 
                                        sx={{ 
                                            mb: 2,
                                            color: theme.palette.primary.main,
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            '&::before': {
                                                content: '""',
                                                display: 'inline-block',
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: theme.palette.primary.main,
                                                marginRight: '8px'
                                            }
                                        }}
                                    >
                                        {room.name}
                                    </Typography>
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 3,
                                        color: theme.palette.text.secondary
                                    }}>
                                        <Typography variant="body2" sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            fontWeight: 500
                                        }}>
                                            <span style={{ 
                                                marginRight: '8px', 
                                                fontSize: '1.1rem',
                                                color: theme.palette.primary.main
                                            }}>🕒</span>
                                            {room.duration} min
                                        </Typography>
                                        <Typography variant="body2" sx={{ 
                                            backgroundColor: 'rgba(110, 72, 170, 0.1)',
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: '12px',
                                            fontWeight: 500,
                                            color: theme.palette.primary.dark
                                        }}>
                                            {room.genre}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions sx={{ 
                                    p: 2,
                                    justifyContent: 'space-between',
                                    borderTop: '1px solid rgba(0,0,0,0.05)'
                                }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate(`/rooms/${room.id}`)}
                                        sx={{
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                            color: 'white',
                                            fontWeight: '600',
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            boxShadow: '0 4px 12px rgba(110, 72, 170, 0.3)',
                                            px: 3,
                                            '&:hover': {
                                                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                                                boxShadow: '0 6px 16px rgba(110, 72, 170, 0.4)',
                                                transform: 'translateY(-2px)'
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        Ver Detalles
                                    </Button>

                                    {isAdmin && (
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton 
                                                aria-label="edit" 
                                                onClick={() => handleOpenEditDialog(room)}
                                                sx={{ 
                                                    color: theme.palette.primary.main,
                                                    backgroundColor: 'rgba(110, 72, 170, 0.1)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(110, 72, 170, 0.2)',
                                                        transform: 'rotate(15deg)'
                                                    },
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <span style={{ fontSize: '1.2rem' }}>✏️</span>
                                            </IconButton>
                                            <IconButton 
                                                aria-label="delete" 
                                                onClick={() => handleOpenDeleteDialog(room)}
                                                sx={{ 
                                                    color: theme.palette.error.main,
                                                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(231, 76, 60, 0.2)',
                                                        transform: 'scale(1.1)'
                                                    },
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <span style={{ fontSize: '1.2rem' }}>🗑️</span>
                                            </IconButton>
                                        </Box>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Dialog para agregar/editar sala */}
            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 12px 40px rgba(110, 72, 170, 0.25)',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    py: 2,
                    px: 3,
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, transparent 100%)`,
                        opacity: 0.7
                    }
                }}>
                    {currentRoom?.id ? '✏️ Editar Sala' : '➕ Agregar Nueva Sala'}
                </DialogTitle>
                
                <DialogContent sx={{ p: 4 }}>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nombre de la sala"
                                name="name"
                                value={currentRoom?.name || ''}
                                onChange={handleInputChange}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '& fieldset': {
                                            borderColor: 'rgba(0,0,0,0.1)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: theme.palette.text.secondary,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Película"
                                name="movie_name"
                                value={currentRoom?.movie_name || ''}
                                onChange={handleInputChange}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '& fieldset': {
                                            borderColor: 'rgba(0,0,0,0.1)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="URL del póster"
                                name="movie_poster_url"
                                value={currentRoom?.movie_poster_url || ''}
                                onChange={handleInputChange}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '& fieldset': {
                                            borderColor: 'rgba(0,0,0,0.1)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Duración (min)"
                                name="duration"
                                type="number"
                                value={currentRoom?.duration || ''}
                                onChange={handleInputChange}
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <span style={{ color: theme.palette.primary.main }}>min</span>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '& fieldset': {
                                            borderColor: 'rgba(0,0,0,0.1)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Género"
                                name="genre"
                                value={currentRoom?.genre || ''}
                                onChange={handleInputChange}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '& fieldset': {
                                            borderColor: 'rgba(0,0,0,0.1)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Hora (HH:MM)"
                                name="hour"
                                value={currentRoom?.hour || ''}
                                onChange={handleInputChange}
                                variant="outlined"
                                placeholder="Ej: 14:30"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '& fieldset': {
                                            borderColor: 'rgba(0,0,0,0.1)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Precio"
                                name="price"
                                type="number"
                                value={currentRoom?.price || ''}
                                onChange={handleInputChange}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <span style={{ color: theme.palette.primary.main }}>$</span>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '& fieldset': {
                                            borderColor: 'rgba(0,0,0,0.1)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Filas"
                                name="num_rows"
                                type="number"
                                value={currentRoom?.num_rows || ''}
                                onChange={handleInputChange}
                                variant="outlined"
                                disabled={hasReservations}
                                helperText={hasReservations ? "No se puede modificar porque hay reservas existentes" : ""}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '& fieldset': {
                                            borderColor: 'rgba(0,0,0,0.1)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Columnas"
                                name="num_columns"
                                type="number"
                                value={currentRoom?.num_columns || ''}
                                onChange={handleInputChange}
                                variant="outlined"
                                disabled={hasReservations}
                                helperText={hasReservations ? "No se puede modificar porque hay reservas existentes" : ""}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '& fieldset': {
                                            borderColor: 'rgba(0,0,0,0.1)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                
                <DialogActions sx={{ 
                    p: 3,
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    justifyContent: 'space-between'
                }}>
                    <Button 
                        onClick={handleCloseDialog}
                        sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: 600,
                            borderRadius: '12px',
                            px: 3,
                            py: 1,
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.05)',
                                color: theme.palette.text.primary
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained"
                        sx={{
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: '12px',
                            px: 4,
                            py: 1,
                            boxShadow: '0 4px 15px rgba(110, 72, 170, 0.3)',
                            '&:hover': {
                                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                                boxShadow: '0 6px 20px rgba(110, 72, 170, 0.4)',
                                transform: 'translateY(-2px)'
                            },
                            '&:active': {
                                transform: 'translateY(0)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {currentRoom?.id ? 'Actualizar Sala' : 'Crear Sala'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog para confirmar eliminación */}
            <Dialog 
                open={openDeleteDialog} 
                onClose={handleCloseDeleteDialog}
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        padding: '20px',
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                    }
                }}
            >
                <DialogTitle sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    textAlign: 'center',
                    py: 2,
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80px',
                        height: '4px',
                        background: theme.palette.error.main,
                        borderRadius: '2px'
                    }
                }}>
                    <Box sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        p: 1.5,
                        borderRadius: '50%',
                        mb: 1
                    }}>
                        <span style={{ fontSize: '1.8rem', color: theme.palette.error.main }}>🗑️</span>
                    </Box>
                    <br />
                    Confirmar Eliminación
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ 
                        textAlign: 'center', 
                        color: theme.palette.text.secondary,
                        mt: 2,
                        fontSize: '1.1rem'
                    }}>
                        ¿Estás seguro que deseas eliminar la sala "{roomToDelete?.name}"?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ 
                    justifyContent: 'center', 
                    gap: 2,
                    pt: 0,
                    pb: 3
                }}>
                    <Button 
                        onClick={handleCloseDeleteDialog}
                        sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: 600,
                            borderRadius: '12px',
                            px: 4,
                            py: 1,
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.05)',
                                color: theme.palette.text.primary
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleDelete} 
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.error.main,
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: '12px',
                            px: 4,
                            py: 1,
                            boxShadow: `0 4px 12px ${theme.palette.error.light}`,
                            '&:hover': {
                                backgroundColor: theme.palette.error.dark,
                                boxShadow: `0 6px 16px ${theme.palette.error.light}`,
                                transform: 'translateY(-2px)'
                            },
                            '&:active': {
                                transform: 'translateY(0)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar para mensajes */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ 
                        width: '100%',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        alignItems: 'center',
                        fontSize: '0.95rem',
                        backdropFilter: 'blur(12px)',
                        background: 'rgba(255,255,255,0.95)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '& .MuiAlert-icon': {
                            fontSize: '1.5rem'
                        }
                    }}
                    iconMapping={{
                        success: '✅',
                        error: '❌',
                        warning: '⚠️',
                        info: 'ℹ️'
                    }}
                >
                    <Typography sx={{ fontWeight: 500 }}>
                        {snackbar.message}
                    </Typography>
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CinePage;