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
  
      // Formatear fecha y hora
      const formatDateTime = (isoString) => {
          if (!isoString) return "Horario no disponible";
          
          try {
              const date = new Date(isoString);
              return date.toLocaleString('es-ES', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
              }).replace(",", "");
          } catch {
              return isoString;
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
  
      return (
          <Container maxWidth="lg" sx={{ py: 6 }}>
              <Box sx={{ 
                  textAlign: 'center', 
                  mb: 6,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
              }}>
                  <Typography variant="h2" component="h1" sx={{ 
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      mb: 1
                  }}>
                      {room.movie_name}
                  </Typography>
                  <Typography variant="h5" color="textSecondary">
                      {room.genre}
                  </Typography>
              </Box>
  
              <Grid container spacing={6}>
                  <Grid item xs={12} md={6}>
                      <Paper elevation={8} sx={{ 
                          borderRadius: 3,
                          overflow: 'hidden',
                          height: '100%',
                          display: 'flex'
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
                  </Grid>
  
                  <Grid item xs={12} md={6}>
                      <Paper elevation={3} sx={{ 
                          p: 4, 
                          borderRadius: 3,
                          height: '100%',
                          background: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(10px)'
                      }}>
                          <Typography variant="h4" component="h2" sx={{ 
                              mb: 3,
                              fontWeight: 600,
                              color: theme.palette.primary.dark
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
                                      padding: '8px 12px'
                                  }} 
                              />
                              <Chip 
                                  label={`${room.duration} min`} 
                                  variant="outlined"
                                  sx={{ 
                                      mr: 1,
                                      mb: 1,
                                      fontSize: '1rem',
                                      padding: '8px 12px'
                                  }} 
                              />
                          </Box>
  
                          <Divider sx={{ my: 3 }} />
  
                          <Box sx={{ mb: 4 }}>
                              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                                  Información de la Función
                              </Typography>
                              
                              <Box sx={{ 
                                  display: 'grid',
                                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                  gap: 2,
                                  mb: 3
                              }}>
                                  <Box>
                                      <Typography variant="body1" color="textSecondary">
                                          Capacidad:
                                      </Typography>
                                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                          {room.num_rows * room.num_columns} asientos
                                      </Typography>
                                  </Box>
                                  
                                  <Box>
                                      <Typography variant="body1" color="textSecondary">
                                          Asientos disponibles:
                                      </Typography>
                                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                          {room.num_rows * room.num_columns} asientos
                                      </Typography>
                                  </Box>
                                  
                                  <Box>
                                      <Typography variant="body1" color="textSecondary">
                                          Horario:
                                      </Typography>
                                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                          {formatDateTime(room.schedule)}
                                      </Typography>
                                  </Box>
                                  
                                  <Box>
                                      <Typography variant="body1" color="textSecondary">
                                          Precio por asiento:
                                      </Typography>
                                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                          ${room.price || "No especificado"}
                                      </Typography>
                                  </Box>
                              </Box>
                          </Box>
  
                          <Divider sx={{ my: 3 }} />
  
                          <Button
                              variant="contained"
                              size="large"
                              fullWidth
                              onClick={handleReservation}
                              sx={{
                                  py: 2,
                                  borderRadius: 2,
                                  fontSize: '1.1rem',
                                  fontWeight: 600,
                                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                  '&:hover': {
                                      transform: 'translateY(-2px)',
                                      boxShadow: `0 4px 12px ${theme.palette.primary.light}`
                                  },
                                  transition: 'all 0.3s ease'
                              }}
                          >
                              RESERVAR ASIENTOS
                          </Button>
                      </Paper>
                  </Grid>
              </Grid>
          </Container>
      );
  };
  
  export default RoomPage;