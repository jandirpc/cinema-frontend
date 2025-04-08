import { Box, Button, Container, TextField, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
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
        setErrorMessage('Credenciales incorrectas');
      }
    } catch (error) {
      setErrorMessage('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5">Inicio de sesión</Typography>
        
        {errorMessage && (
          <Typography color="error" sx={{ mt: 2 }}>{errorMessage}</Typography>
        )}
        
        {successMessage && (
          <Typography color="green" sx={{ mt: 2 }}>{successMessage}</Typography>
        )}

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 3, width: '100%' }}>
          <TextField
            label="Nombre de usuario"
            fullWidth
            margin="normal"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </Button>
          
          <Button
            fullWidth
            variant="outlined"
            onClick={handleRegisterRedirect}
          >
            Crear nueva cuenta
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;