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
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const isAdmin = user?.role === 'admin';

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

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleOpenAddDialog = () => {
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
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (room) => {
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
            backgroundColor: '#f8f9fa',
            minHeight: '100vh'
        }}>
            <AppBar position="static" elevation={0} sx={{ 
                background: 'linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%)',
                mb: 6,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ 
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: 'white',
                        fontWeight: 600
                    }}>
                        <span style={{ fontSize: '1.8rem' }}>🎬</span>
                        CINEMA ACHERON
                    </Typography>

                    {isAdmin && (
                        <Button 
    variant="contained"
    onClick={handleOpenAddDialog}
    sx={{ 
        mr: 2,
        background: 'linear-gradient(135deg,rgb(254, 253, 255) 0%, #9d50bb 100%)',
        color: 'white',
        fontWeight: 600,
        borderRadius: '12px',
        px: 3,
        py: 1,
        textTransform: 'none',
        boxShadow: '0 4px 15px rgba(110, 72, 170, 0.3)',
        '&:hover': {
            background: 'linear-gradient(135deg, #5d3a9b 0%,rgb(191, 177, 199) 100%)',
            boxShadow: '0 6px 20px rgba(110, 72, 170, 0.4)',
            transform: 'translateY(-1px)'
        },
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 1
    }}
>
    <span style={{ fontSize: '1.2rem' }}>🎬</span>
    {!isMobile ? "Agregar Sala" : ""}
</Button>
                    )}
<Button 
    variant="contained"
    onClick={handleLogout}
    sx={{ 
        backgroundColor: 'white',
        color: '#6e48aa',
        fontWeight: 600,
        borderRadius: '12px',
        px: 3,
        textTransform: 'none',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        '&:hover': {
            backgroundColor: '#f5f5f5',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        },
        display: 'flex',
        alignItems: 'center',
        gap: 1
    }}
>
    <span style={{ fontSize: '1.2rem' }}>🚪</span>
    {!isMobile && "Cerrar Sesión"}
</Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ pb: 8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography 
        variant="h3"  
        gutterBottom 
        sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #6e48aa 30%, #4776E6 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.03em',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            textAlign: 'center',
            width: '100%'
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
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                                }
                            }}>
                                <CardMedia
                                    component="img"
                                    height="380"
                                    image={room.movie_poster_url || "https://via.placeholder.com/400x600"}
                                    alt={room.movie_name}
                                    sx={{ 
                                        objectFit: 'cover',
                                        width: '100%'
                                    }}
                                />
                                <CardContent sx={{ 
                                    flexGrow: 1,
                                    background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
                                    p: 3
                                }}>
                                    <Typography 
                                        variant="h5" 
                                        component="h2" 
                                        sx={{ 
                                            mb: 1.5,
                                            fontWeight: 700,
                                            color: '#2d3436',
                                            lineHeight: 1.3
                                        }}
                                    >
                                        {room.movie_name}
                                    </Typography>
                                    <Typography 
                                        variant="subtitle1" 
                                        sx={{ 
                                            mb: 2,
                                            color: '#6e48aa',
                                            fontWeight: 500
                                        }}
                                    >
                                        {room.name}
                                    </Typography>
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 3,
                                        color: '#636e72'
                                    }}>
                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '8px', fontSize: '1.1rem' }}>🕒</span>
                                            {room.duration} min
                                        </Typography>
                                        <Typography variant="body2" sx={{ 
                                            backgroundColor: '#dfe6e9',
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: '4px',
                                            fontWeight: 500
                                        }}>
                                            {room.genre}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions sx={{ 
                                    p: 2,
                                    justifyContent: 'space-between',
                                    borderTop: '1px solid #eee'
                                }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate(`/rooms/${room.id}`)}
                                        sx={{
                                            background: 'linear-gradient(135deg, #6e48aa 0%, #4776E6 100%)',
                                            color: 'white',
                                            fontWeight: '600',
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5d3a9b 0%, #3a62c4 100%)',
                                                boxShadow: '0 4px 8px rgba(110, 72, 170, 0.3)'
                                            }
                                        }}
                                    >
                                        Ver Detalles
                                    </Button>

                                    {isAdmin && (
                                        <Box>
                                            <IconButton 
                                                aria-label="edit" 
                                                onClick={() => handleOpenEditDialog(room)}
                                                sx={{ color: '#6e48aa' }}
                                            >
                                                <span style={{ fontSize: '1.2rem' }}>✏️</span>
                                            </IconButton>
                                            <IconButton 
                                                aria-label="delete" 
                                                onClick={() => handleOpenDeleteDialog(room)}
                                                sx={{ color: '#e74c3c' }}
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
                        background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
                        boxShadow: '0 10px 30px rgba(110, 72, 170, 0.2)'
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '1.5rem',
                    py: 2,
                    px: 3,
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px'
                }}>
                    {currentRoom?.id ? '✏️ Editar Sala' : '➕ Agregar Nueva Sala'}
                </DialogTitle>
                
                <DialogContent sx={{ p: 3 }}>
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
                                            borderColor: '#dfe6e9',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#6e48aa',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#636e72',
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
                                            borderColor: '#dfe6e9',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#6e48aa',
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
                                            borderColor: '#dfe6e9',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#6e48aa',
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
                                            <span style={{ color: '#6e48aa' }}>min</span>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '& fieldset': {
                                            borderColor: '#dfe6e9',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#6e48aa',
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
                                            borderColor: '#dfe6e9',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#6e48aa',
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
                                            borderColor: '#dfe6e9',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#6e48aa',
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
                                            <span style={{ color: '#6e48aa' }}>$</span>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '& fieldset': {
                                            borderColor: '#dfe6e9',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#6e48aa',
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '& fieldset': {
                                            borderColor: '#dfe6e9',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#6e48aa',
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '& fieldset': {
                                            borderColor: '#dfe6e9',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#6e48aa',
                                        },
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                
                <DialogActions sx={{ 
                    p: 3,
                    borderTop: '1px solid #eee',
                    justifyContent: 'space-between'
                }}>
                    <Button 
                        onClick={handleCloseDialog}
                        sx={{
                            color: '#636e72',
                            fontWeight: 600,
                            borderRadius: '12px',
                            px: 3,
                            py: 1,
                            '&:hover': {
                                backgroundColor: '#f5f5f5'
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #6e48aa 0%, #4776E6 100%)',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: '12px',
                            px: 4,
                            py: 1,
                            boxShadow: '0 4px 15px rgba(110, 72, 170, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5d3a9b 0%, #3a62c4 100%)',
                                boxShadow: '0 6px 20px rgba(110, 72, 170, 0.4)'
                            }
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
                        background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)'
                    }
                }}
            >
                <DialogTitle sx={{
                    color: '#2d3436',
                    fontWeight: 600,
                    fontSize: '1.3rem',
                    textAlign: 'center'
                }}>
                    🗑️ Confirmar Eliminación
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ textAlign: 'center', color: '#636e72' }}>
                        ¿Estás seguro que deseas eliminar la sala "{roomToDelete?.name}"?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
                    <Button 
                        onClick={handleCloseDeleteDialog}
                        sx={{
                            color: '#636e72',
                            fontWeight: 600,
                            borderRadius: '12px',
                            px: 3,
                            py: 1,
                            '&:hover': {
                                backgroundColor: '#f5f5f5'
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleDelete} 
                        variant="contained"
                        sx={{
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: '12px',
                            px: 4,
                            py: 1,
                            '&:hover': {
                                backgroundColor: '#c0392b'
                            }
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
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        alignItems: 'center',
                        fontSize: '0.95rem'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CinePage;