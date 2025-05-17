import {
    Alert,
    AppBar,
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import { blue, deepPurple, green, orange, red } from '@mui/material/colors';
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const colors = {
        primary: '#4a69bd',
        primaryLight: '#6a89cc',
        primaryDark: '#1e3799',
        secondary: '#f3e5f5',
        textOnPrimary: '#ffffff',
        textOnSecondary: '#4a148c',
        error: '#d32f2f',
        background: '#f8f9fa'
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        axios.get("http://localhost:3000/api/users")
            .then(response => setUsers(response.data))
            .catch(error => {
                console.error("Error al cargar los usuarios:", error);
                setSnackbar({ open: true, message: 'Error al cargar usuarios', severity: 'error' });
            });
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!currentUser.username) {
            newErrors.username = 'Nombre de usuario requerido';
        }
        
        if (!currentUser.email) {
            newErrors.email = 'Email requerido';
        } else if (!/\S+@\S+\.\S+/.test(currentUser.email)) {
            newErrors.email = 'Email no válido';
        }
        
        if (!currentUser.id && !currentUser.password) {
            newErrors.password = 'Contraseña requerida';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleOpenAddDialog = () => {
        setCurrentUser({
            username: '',
            email: '',
            password: '',
            role: 'client',
            status: 'active'
        });
        setErrors({});
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (user) => {
        setCurrentUser({ ...user, password: '' });
        setErrors({});
        setOpenDialog(true);
    };

    const handleOpenDeleteDialog = (user) => {
        setUserToDelete(user);
        setOpenDeleteDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentUser(null);
        setErrors({});
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setUserToDelete(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const method = currentUser.id ? 'put' : 'post';
        const url = currentUser.id 
            ? `http://localhost:3000/api/users/${currentUser.id}`
            : 'http://localhost:3000/api/users';

        const userToSend = currentUser.id && !currentUser.password
            ? { ...currentUser, password: undefined }
            : currentUser;

        axios[method](url, userToSend)
            .then(() => {
                loadUsers();
                setOpenDialog(false);
                setSnackbar({ 
                    open: true, 
                    message: currentUser.id ? 'Usuario actualizado' : 'Usuario creado', 
                    severity: 'success' 
                });
            })
            .catch(error => {
                console.error("Error al guardar usuario:", error);
                setSnackbar({ open: true, message: 'Error al guardar usuario', severity: 'error' });
            });
    };

    const handleDelete = () => {
        axios.delete(`http://localhost:3000/api/users/${userToDelete.id}`)
            .then(() => {
                loadUsers();
                setOpenDeleteDialog(false);
                setSnackbar({ open: true, message: 'Usuario eliminado', severity: 'success' });
            })
            .catch(error => {
                console.error("Error al eliminar usuario:", error);
                setSnackbar({ open: true, message: 'Error al eliminar usuario', severity: 'error' });
            });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const getAvatarColor = (username) => {
        const colors = [deepPurple[500], blue[500], green[500], red[500], orange[500]];
        const charCode = username.charCodeAt(0) || 0;
        return colors[charCode % colors.length];
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'active': return green[500];
            case 'inactive': return orange[500];
            default: return blue[500];
        }
    };

    const primaryButtonStyle = {
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
        color: colors.textOnPrimary,
        fontWeight: 600,
        borderRadius: '12px',
        px: 3,
        py: 1,
        textTransform: 'none',
        boxShadow: '0 4px 15px rgba(74, 105, 189, 0.3)',
        '&:hover': {
            background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`,
            boxShadow: '0 6px 20px rgba(74, 105, 189, 0.4)',
            transform: 'translateY(-1px)'
        },
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 1
    };

    const secondaryButtonStyle = {
        backgroundColor: colors.secondary,
        color: colors.textOnSecondary,
        fontWeight: 600,
        borderRadius: '12px',
        px: 3,
        py: 1,
        textTransform: 'none',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        '&:hover': {
            backgroundColor: '#e1bee7',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        },
        display: 'flex',
        alignItems: 'center',
        gap: 1
    };

    return (
        <Box sx={{ 
            backgroundColor: colors.background,
            minHeight: '100vh'
        }}>
            <AppBar position="static" elevation={0} sx={{ 
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
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
                        fontWeight: 600,
                        fontFamily: '"Roboto Condensed", sans-serif'
                    }}>
                        <span style={{ fontSize: '1.8rem' }}>👥</span>
                        GESTIÓN DE USUARIOS
                    </Typography>

                    <Button 
                        variant="contained"
                        onClick={() => navigate('/')}
                        sx={primaryButtonStyle}
                    >
                        <span style={{ fontSize: '1.2rem' }}>🎬</span>
                        {!isMobile ? "Volver a Salas" : ""}
                    </Button>

                    <Button 
                        variant="contained"
                        onClick={handleLogout}
                        sx={{
                            ...secondaryButtonStyle,
                            ml: 2
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
                            background: `linear-gradient(45deg, ${colors.primary} 30%, ${colors.primaryLight} 90%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '0.03em',
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            textAlign: 'center',
                            width: '100%',
                            fontFamily: '"Roboto Condensed", sans-serif'
                        }}
                    >
                        ADMINISTRACIÓN DE USUARIOS
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
                    <Button 
                        variant="contained"
                        onClick={handleOpenAddDialog}
                        sx={primaryButtonStyle}
                    >
                        <span style={{ fontSize: '1.2rem' }}>➕</span>
                        Agregar Nuevo Usuario
                    </Button>
                </Box>
                
                <Grid container spacing={4}>
                    {users.map((user) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
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
                                <Box sx={{ 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    p: 3,
                                    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
                                }}>
                                    <Avatar 
                                        sx={{ 
                                            width: 80, 
                                            height: 80, 
                                            fontSize: '2rem',
                                            bgcolor: getAvatarColor(user.username),
                                            mb: 2
                                        }}
                                    >
                                        {user.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Typography 
                                        variant="h5" 
                                        component="h2" 
                                        sx={{ 
                                            fontWeight: 700,
                                            color: '#2d3436',
                                            textAlign: 'center',
                                            fontFamily: '"Roboto Condensed", sans-serif'
                                        }}
                                    >
                                        {user.username}
                                    </Typography>
                                    <Typography 
                                        variant="subtitle1" 
                                        sx={{ 
                                            color: '#636e72',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {user.email}
                                    </Typography>
                                </Box>
                                
                                <CardContent sx={{ 
                                    flexGrow: 1,
                                    p: 3
                                }}>
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 2
                                    }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            Rol:
                                        </Typography>
                                        <Typography variant="body1">
                                            {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 2
                                    }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            Estado:
                                        </Typography>
                                        <Box sx={{ 
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            borderRadius: '12px',
                                            px: 1.5,
                                            py: 0.5,
                                            backgroundColor: getStatusColor(user.status) + '20',
                                            color: getStatusColor(user.status)
                                        }}>
                                            <span style={{ 
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                backgroundColor: getStatusColor(user.status),
                                                marginRight: '8px'
                                            }}></span>
                                            {user.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </Box>
                                    </Box>
                                    
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            ID:
                                        </Typography>
                                        <Typography variant="body1">
                                            {user.id}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                
                                <CardActions sx={{ 
                                    p: 2,
                                    justifyContent: 'flex-end',
                                    borderTop: '1px solid #eee'
                                }}>
                                    <IconButton 
                                        aria-label="edit" 
                                        onClick={() => handleOpenEditDialog(user)}
                                        sx={{ 
                                            color: colors.primary,
                                            '&:hover': {
                                                backgroundColor: `${colors.secondary}80`
                                            }
                                        }}
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>✏️</span>
                                    </IconButton>
                                    <IconButton 
                                        aria-label="delete" 
                                        onClick={() => handleOpenDeleteDialog(user)}
                                        sx={{ 
                                            color: colors.error,
                                            '&:hover': {
                                                backgroundColor: '#ffcdd280'
                                            }
                                        }}
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>🗑️</span>
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Dialog para agregar/editar usuario */}
            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
                        boxShadow: `0 10px 30px ${colors.primary}20`
                    }
                }}
            >
                <DialogTitle sx={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '1.5rem',
                    py: 2,
                    px: 3,
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                    fontFamily: '"Roboto Condensed", sans-serif'
                }}>
                    {currentUser?.id ? '✏️ Editar Usuario' : '➕ Agregar Nuevo Usuario'}
                </DialogTitle>
                
                <DialogContent sx={{ p: 3 }}>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nombre de usuario *"
                                name="username"
                                value={currentUser?.username || ''}
                                onChange={handleInputChange}
                                variant="outlined"
                                error={!!errors.username}
                                helperText={errors.username}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '& fieldset': {
                                            borderColor: '#dfe6e9',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: colors.primary,
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
                                label="Email *"
                                name="email"
                                type="email"
                                value={currentUser?.email || ''}
                                onChange={handleInputChange}
                                variant="outlined"
                                error={!!errors.email}
                                helperText={errors.email}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '& fieldset': {
                                            borderColor: '#dfe6e9',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: colors.primary,
                                        },
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={currentUser?.id ? "Nueva contraseña (dejar en blanco para no cambiar)" : "Contraseña *"}
                                name="password"
                                type="password"
                                value={currentUser?.password || ''}
                                onChange={handleInputChange}
                                variant="outlined"
                                error={!!errors.password}
                                helperText={errors.password}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '& fieldset': {
                                            borderColor: '#dfe6e9',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: colors.primary,
                                        },
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '& fieldset': {
                                        borderColor: '#dfe6e9',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: colors.primary,
                                    },
                                }
                            }}>
                                <InputLabel>Rol *</InputLabel>
                                <Select
                                    label="Rol *"
                                    name="role"
                                    value={currentUser?.role || 'client'}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="admin">Administrador</MenuItem>
                                    <MenuItem value="client">Cliente</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '& fieldset': {
                                        borderColor: '#dfe6e9',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: colors.primary,
                                    },
                                }
                            }}>
                                <InputLabel>Estado *</InputLabel>
                                <Select
                                    label="Estado *"
                                    name="status"
                                    value={currentUser?.status || 'active'}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="active">Activo</MenuItem>
                                    <MenuItem value="inactive">Inactivo</MenuItem>
                                </Select>
                            </FormControl>
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
                        sx={secondaryButtonStyle}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained"
                        sx={primaryButtonStyle}
                    >
                        {currentUser?.id ? 'Actualizar Usuario' : 'Crear Usuario'}
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
                    textAlign: 'center',
                    fontFamily: '"Roboto Condensed", sans-serif'
                }}>
                    🗑️ Confirmar Eliminación
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ textAlign: 'center', color: '#636e72', mb: 2 }}>
                        ¿Estás seguro que deseas eliminar al usuario "{userToDelete?.username}"?
                    </Typography>
                    <Typography sx={{ textAlign: 'center', color: colors.error, fontWeight: 500 }}>
                        Esta acción no se puede deshacer
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
                    <Button 
                        onClick={handleCloseDeleteDialog}
                        sx={secondaryButtonStyle}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleDelete} 
                        variant="contained"
                        sx={{
                            backgroundColor: colors.error,
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: '12px',
                            px: 4,
                            py: 1,
                            '&:hover': {
                                backgroundColor: '#b71c1c'
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
                        fontSize: '0.95rem',
                        fontFamily: '"Roboto Condensed", sans-serif'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UsersPage;