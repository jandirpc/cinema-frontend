import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Fade,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const loginSuccess = await login(username, password);
      
      if (loginSuccess) {
        setSuccessMessage('Inicio de sesión exitoso. Redirigiendo...');
        setTimeout(() => navigate('/cine'), 1500);
      } else {
        setErrorMessage('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      setErrorMessage('Error al conectar con el servidor. Por favor, intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  const handleForgotPasswordRedirect = () => {
    navigate('/forgot-password');
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.96)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Avatar
              sx={{
                m: 1,
                bgcolor: 'secondary.main',
                width: 60,
                height: 60,
              }}
            >
              🔒
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
              Iniciar Sesión
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Ingresa tus credenciales para continuar
            </Typography>
          </Box>

          {errorMessage && (
            <Fade in>
              <Typography
                color="error"
                align="center"
                sx={{
                  mt: 1,
                  mb: 2,
                  p: 1,
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 0, 0, 0.05)',
                }}
              >
                {errorMessage}
              </Typography>
            </Fade>
          )}

          {successMessage && (
            <Fade in>
              <Typography
                color="green"
                align="center"
                sx={{
                  mt: 1,
                  mb: 2,
                  p: 1,
                  borderRadius: '4px',
                  backgroundColor: 'rgba(0, 200, 0, 0.05)',
                }}
              >
                {successMessage}
              </Typography>
            </Fade>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nombre de usuario"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span style={{ opacity: 0.7 }}>👤</span>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span style={{ opacity: 0.7 }}>🔑</span>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
                mt: 2,
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <Button
                onClick={handleForgotPasswordRedirect}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  p: 0,
                  '&:hover': {
                    textDecoration: 'underline',
                    backgroundColor: 'transparent',
                  }
                }}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1rem',
                background: 'linear-gradient(45deg, #1976d2 0%, #2196f3 100%)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                },
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Iniciar Sesión →'
              )}
            </Button>
            
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 2,
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                ¿No tienes una cuenta?
              </Typography>
              <Button
                color="secondary"
                onClick={handleRegisterRedirect}
                sx={{
                  ml: 1,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Regístrate
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginForm;