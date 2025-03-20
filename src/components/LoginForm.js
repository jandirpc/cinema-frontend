// src/components/LoginForm.js
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Aquí se manejará la lógica de autenticación en el futuro
    // Por ahora, redirigimos a la página de cine
    navigate('/cine');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Typography variant="h5">Acceder como Cliente</Typography>
        <Box
          component="form"
          noValidate
          sx={{
            mt: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            label="Correo Electrónico"
            variant="outlined"
            fullWidth
            required
            autoFocus
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            required
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{ mt: 2 }}
          >
            Acceder
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;
