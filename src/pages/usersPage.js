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
    Menu,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import Chip from '@mui/material/Chip';
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
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const openMenu = Boolean(anchorEl);

    const colors = {
        primary: '#4a69bd',
        primaryLight: '#6a89cc',
        primaryDark: '#1e3799',
        secondary: '#f3e5f5',
        textOnPrimary: '#ffffff',
        textOnSecondary: '#4a148c',
        error: '#d32f2f',
        background: '#f8f9fa',
        glassBackground: 'rgba(255, 255, 255, 0.85)',
        glassBorder: '1px solid rgba(255, 255, 255, 0.3)',
        glassShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
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
            transform: 'translateY(-2px)'
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
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)'
        },
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 1
    };

    return (
        <Box sx={{ 
            background: `linear-gradient(135deg, ${colors.background} 0%, #e2e6ea 100%)`,
            minHeight: '100vh',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '300px',
                background: `linear-gradient(to bottom, ${colors.primaryDark} 0%, transparent 100%)`,
                zIndex: 0,
                opacity: 0.1
            }
        }}>
            <AppBar position="static" elevation={0} sx={{ 
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
                mb: 6,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                position: 'relative',
                zIndex: 1
            }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ 
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: 'white',
                        fontWeight: 700,
                        fontFamily: '"Roboto Condensed", sans-serif',
                        letterSpacing: '0.05em',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <span style={{ fontSize: '1.8rem' }}>👥</span>
                        GESTIÓN DE USUARIOS
                    </Typography>

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
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                borderRadius: '12px',
                                minWidth: 200,
                                background: colors.glassBackground,
                                backdropFilter: 'blur(12px)',
                                border: colors.glassBorder,
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: colors.glassBackground,
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem 
                            onClick={() => { handleMenuClose(); navigate('/'); }} 
                            sx={{ 
                                py: 1.5,
                                '&:hover': {
                                    background: 'rgba(0,0,0,0.05)'
                                }
                            }}
                        >
                            <span style={{ marginRight: '10px', fontSize: '1.2rem' }}>🎬</span>
                            Volver a Salas
                        </MenuItem>
                        <MenuItem 
                            onClick={handleLogout} 
                            sx={{ 
                                py: 1.5,
                                '&:hover': {
                                    background: 'rgba(0,0,0,0.05)'
                                }
                            }}
                        >
                            <span style={{ marginRight: '10px', fontSize: '1.2rem' }}>🚪</span>
                            Cerrar Sesión
                        </MenuItem>
                    </Menu>
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
                        bottom: '-15px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '150px',
                        height: '4px',
                        background: `linear-gradient(90deg, transparent 0%, ${colors.primary} 50%, transparent 100%)`,
                        borderRadius: '2px'
                    }
                }}>
                    <Typography 
                        variant="h3"  
                        gutterBottom 
                        sx={{ 
                            fontWeight: 800,
                            background: `linear-gradient(45deg, ${colors.primary} 30%, ${colors.primaryLight} 90%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '0.03em',
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            textAlign: 'center',
                            width: '100%',
                            fontFamily: '"Roboto Condensed", sans-serif',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        ADMINISTRACIÓN DE USUARIOS
                    </Typography>
                </Box>
                
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    mb: 6,
                    position: 'relative'
                }}>
                    <Button 
                        variant="contained"
                        onClick={handleOpenAddDialog}
                        sx={{
                            ...primaryButtonStyle,
                            '&:hover': {
                                ...primaryButtonStyle['&:hover'],
                                '&::before': {
                                    opacity: 1
                                }
                            },
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: `linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)`,
                                transform: 'rotate(45deg)',
                                transition: 'all 0.5s ease',
                                opacity: 0
                            }
                        }}
                    >
                        <span style={{ fontSize: '1.2rem', zIndex: 1 }}>➕</span>
                        <span style={{ zIndex: 1 }}>Agregar Nuevo Usuario</span>
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
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                                background: colors.glassBackground,
                                backdropFilter: 'blur(12px)',
                                border: colors.glassBorder,
                                position: 'relative',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: `0 15px 30px rgba(0,0,0,0.2), 0 0 0 2px ${colors.primary}20`,
                                    '&::before': {
                                        opacity: 1
                                    }
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.secondary}10 100%)`,
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease',
                                    zIndex: -1
                                }
                            }}>
                                <Box sx={{ 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    p: 4,
                                    background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.secondary}10 100%)`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '-50%',
                                        right: '-50%',
                                        width: '200%',
                                        height: '200%',
                                        background: `radial-gradient(circle, ${colors.primaryLight}20 0%, transparent 70%)`,
                                        opacity: 0.3,
                                        zIndex: -1
                                    }
                                }}>
                                    <Avatar 
                                        sx={{ 
                                            width: 90, 
                                            height: 90, 
                                            fontSize: '2.5rem',
                                            bgcolor: getAvatarColor(user.username),
                                            mb: 3,
                                            boxShadow: `0 4px 12px ${getAvatarColor(user.username)}80`,
                                            border: `2px solid white`
                                        }}
                                    >
                                        {user.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Typography 
                                        variant="h5" 
                                        component="h2" 
                                        sx={{ 
                                            fontWeight: 700,
                                            color: colors.primaryDark,
                                            textAlign: 'center',
                                            fontFamily: '"Roboto Condensed", sans-serif',
                                            position: 'relative',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: '-8px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: '40px',
                                                height: '3px',
                                                background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
                                                borderRadius: '2px'
                                            }
                                        }}
                                    >
                                        {user.username}
                                    </Typography>
                                    <Typography 
                                        variant="subtitle1" 
                                        sx={{ 
                                            color: '#636e72',
                                            textAlign: 'center',
                                            mt: 1
                                        }}
                                    >
                                        {user.email}
                                    </Typography>
                                </Box>
                                
                                <CardContent sx={{ 
                                    flexGrow: 1,
                                    p: 3,
                                    background: 'rgba(255,255,255,0.7)'
                                }}>
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 2,
                                        alignItems: 'center'
                                    }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: colors.primaryDark }}>
                                            Rol:
                                        </Typography>
                                        <Chip 
                                            label={user.role === 'admin' ? 'Administrador' : 'Cliente'} 
                                            size="small"
                                            sx={{ 
                                                fontWeight: 600,
                                                backgroundColor: user.role === 'admin' ? `${colors.primary}20` : `${colors.secondary}80`,
                                                color: user.role === 'admin' ? colors.primaryDark : colors.textOnSecondary
                                            }}
                                        />
                                    </Box>
                                    
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 2,
                                        alignItems: 'center'
                                    }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: colors.primaryDark }}>
                                            Estado:
                                        </Typography>
                                        <Box sx={{ 
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            borderRadius: '12px',
                                            px: 1.5,
                                            py: 0.5,
                                            backgroundColor: getStatusColor(user.status) + '20',
                                            color: getStatusColor(user.status),
                                            boxShadow: `0 2px 4px ${getStatusColor(user.status)}20`,
                                            border: `1px solid ${getStatusColor(user.status)}30`
                                        }}>
                                            <span style={{ 
                                                width: '10px',
                                                height: '10px',
                                                borderRadius: '50%',
                                                backgroundColor: getStatusColor(user.status),
                                                marginRight: '8px',
                                                boxShadow: `0 0 6px ${getStatusColor(user.status)}`
                                            }}></span>
                                            {user.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </Box>
                                    </Box>
                                    
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: colors.primaryDark }}>
                                            ID:
                                        </Typography>
                                        <Typography variant="body1" sx={{ 
                                            fontFamily: 'monospace',
                                            color: '#636e72'
                                        }}>
                                            {user.id}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                
                                <CardActions sx={{ 
                                    p: 2,
                                    justifyContent: 'flex-end',
                                    borderTop: '1px solid rgba(0,0,0,0.05)',
                                    background: 'rgba(255,255,255,0.5)'
                                }}>
                                    <IconButton 
                                        aria-label="edit" 
                                        onClick={() => handleOpenEditDialog(user)}
                                        sx={{ 
                                            color: colors.primary,
                                            backgroundColor: `${colors.primary}10`,
                                            '&:hover': {
                                                backgroundColor: `${colors.primary}20`,
                                                transform: 'scale(1.1)'
                                            },
                                            transition: 'all 0.2s ease',
                                            borderRadius: '10px',
                                            p: 1.5
                                        }}
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>✏️</span>
                                    </IconButton>
                                    <IconButton 
                                        aria-label="delete" 
                                        onClick={() => handleOpenDeleteDialog(user)}
                                        sx={{ 
                                            color: colors.error,
                                            backgroundColor: `${colors.error}10`,
                                            '&:hover': {
                                                backgroundColor: `${colors.error}20`,
                                                transform: 'scale(1.1)'
                                            },
                                            transition: 'all 0.2s ease',
                                            borderRadius: '10px',
                                            p: 1.5
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
                        background: colors.glassBackground,
                        backdropFilter: 'blur(12px)',
                        border: colors.glassBorder,
                        boxShadow: colors.glassShadow,
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '5px',
                            background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`
                        }
                    }
                }}
            >
                <DialogTitle sx={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    py: 3,
                    px: 4,
                    fontFamily: '"Roboto Condensed", sans-serif',
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80px',
                        height: '4px',
                        background: 'rgba(255,255,255,0.5)',
                        borderRadius: '2px'
                    }
                }}>
                    {currentUser?.id ? '✏️ Editar Usuario' : '➕ Agregar Nuevo Usuario'}
                </DialogTitle>
                
                <DialogContent sx={{ p: 4 }}>
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
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.5)'
                }}>
                    <Button 
                        onClick={handleCloseDialog}
                        sx={{
                            ...secondaryButtonStyle,
                            px: 4,
                            py: 1.2
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained"
                        sx={{
                            ...primaryButtonStyle,
                            px: 4,
                            py: 1.2
                        }}
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
                        padding: '0',
                        background: colors.glassBackground,
                        backdropFilter: 'blur(12px)',
                        border: colors.glassBorder,
                        boxShadow: colors.glassShadow,
                        overflow: 'hidden',
                        maxWidth: '500px'
                    }
                }}
            >
                <DialogTitle sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    textAlign: 'center',
                    fontFamily: '"Roboto Condensed", sans-serif',
                    background: `linear-gradient(135deg, ${colors.error} 0%, ${red[700]} 100%)`,
                    py: 3,
                    px: 4,
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80px',
                        height: '4px',
                        background: 'rgba(255,255,255,0.3)',
                        borderRadius: '2px'
                    }
                }}>
                    🗑️ Confirmar Eliminación
                </DialogTitle>
                <DialogContent sx={{ p: 4 }}>
                    <Typography sx={{ 
                        textAlign: 'center', 
                        color: colors.primaryDark, 
                        mb: 2,
                        fontWeight: 500,
                        fontSize: '1.1rem'
                    }}>
                        ¿Estás seguro que deseas eliminar al usuario "{userToDelete?.username}"?
                    </Typography>
                    <Typography sx={{ 
                        textAlign: 'center', 
                        color: colors.error, 
                        fontWeight: 600,
                        fontSize: '1rem'
                    }}>
                        Esta acción no se puede deshacer
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ 
                    justifyContent: 'center', 
                    gap: 3,
                    p: 3,
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    background: 'rgba(255,255,255,0.5)'
                }}>
                    <Button 
                        onClick={handleCloseDeleteDialog}
                        sx={{
                            ...secondaryButtonStyle,
                            px: 4,
                            py: 1.2
                        }}
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
                            py: 1.2,
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#b71c1c',
                                transform: 'translateY(-2px)',
                                boxShadow: `0 4px 12px ${colors.error}80`
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
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        alignItems: 'center',
                        fontSize: '0.95rem',
                        fontFamily: '"Roboto Condensed", sans-serif',
                        background: colors.glassBackground,
                        backdropFilter: 'blur(12px)',
                        border: colors.glassBorder,
                        color: snackbar.severity === 'error' ? colors.error : colors.primaryDark,
                        '& .MuiAlert-icon': {
                            fontSize: '1.5rem'
                        }
                    }}
                    iconMapping={{
                        success: <span style={{ fontSize: '1.2rem' }}>✅</span>,
                        error: <span style={{ fontSize: '1.2rem' }}>❌</span>,
                        warning: <span style={{ fontSize: '1.2rem' }}>⚠️</span>,
                        info: <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UsersPage;