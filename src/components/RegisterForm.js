import { Box, Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await axios.post('http://localhost:3000/api/auth/register', {
        username,
        password
      });

      setSuccessMessage('Registro exitoso. Redirigiendo...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Hubo un error al registrar el usuario. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ 
        mt: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Typography variant="h5">Registro de Usuario</Typography>
        
        {errorMessage && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}
        
        {successMessage && (
          <Typography color="green" sx={{ mt: 2 }}>
            {successMessage}
          </Typography>
        )}

        <Box 
          component="form" 
          onSubmit={handleRegister} 
          sx={{ 
            mt: 3, 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <TextField
            label="Nombre de Usuario"
            variant="outlined"
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            margin="normal"
          />
          
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          
          <TextField
            label="Confirmar Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Registrarse'}
          </Button>
        </Box>
        
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate('/login')}
          sx={{ mt: 1 }}
        >
          ¿Ya tienes cuenta? Inicia sesión aquí
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterForm;