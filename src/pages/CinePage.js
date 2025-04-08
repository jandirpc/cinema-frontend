import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    Grid,
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
      const navigate = useNavigate();
      const { logout } = useContext(AuthContext);
      const theme = useTheme();
      const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
      useEffect(() => {
          axios.get("http://localhost:3000/api/rooms")
              .then(response => setRooms(response.data))
              .catch(error => console.error("Error al cargar las salas:", error));
      }, []);
  
      const handleLogout = () => {
          logout();
          navigate('/login');
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
                          <Box component="span" sx={{ fontSize: '1.8rem' }}>🎬</Box>
                          CINEMA ACHERON
                      </Typography>
                      <Button 
                          variant="outlined"
                          onClick={handleLogout}
                          sx={{ 
                              color: 'white',
                              borderColor: 'rgba(255,255,255,0.7)',
                              '&:hover': {
                                  backgroundColor: 'rgba(255,255,255,0.1)',
                                  borderColor: 'white'
                              }
                          }}
                      >
                          <Box component="span" sx={{ fontSize: '1.2rem', mr: 1 }}>🚪</Box>
                          {!isMobile && "Cerrar Sesión"}
                      </Button>
                  </Toolbar>
              </AppBar>
  
              <Container maxWidth="xl" sx={{ pb: 8 }}>
                  <Typography 
                      variant="h2" 
                      align="center" 
                      gutterBottom 
                      sx={{ 
                          mb: 8,
                          fontWeight: 700,
                          background: 'linear-gradient(45deg, #6e48aa 30%, #4776E6 90%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          letterSpacing: '0.03em'
                      }}
                  >
                      NUESTRA CARTELERA
                  </Typography>
                  
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
                                              <Box component="span" sx={{ mr: 1, fontSize: '1.1rem' }}>🕒</Box>
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
                                      <Button
                                          variant="contained"
                                          fullWidth
                                          onClick={() => navigate(`/rooms/${room.id}`)}
                                          sx={{
                                              mt: 'auto',
                                              background: 'linear-gradient(135deg, #6e48aa 0%, #4776E6 100%)',
                                              color: 'white',
                                              fontWeight: '600',
                                              py: 1.5,
                                              borderRadius: '8px',
                                              fontSize: '1rem',
                                              letterSpacing: '0.03em',
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
                                  </CardContent>
                              </Card>
                          </Grid>
                      ))}
                  </Grid>
              </Container>
          </Box>
      );
  };
  
  export default CinePage;