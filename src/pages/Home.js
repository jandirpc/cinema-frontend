import { Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Home = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api')
      .then(response => setMessage(response.data.message))
      .catch(error => console.error('Hubo un error al obtener el mensaje:', error));
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {message}
      </Typography>
      <Button variant="contained" color="primary">
        Acción
      </Button>
    </Container>
  );
};

export default Home;
