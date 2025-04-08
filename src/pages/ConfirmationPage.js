import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    Grid,
    Typography,
    useTheme
} from "@mui/material";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

const ConfirmationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const qrRef = useRef(null);
    
    // Extraer los datos de la reserva
    const { 
        selectedSeats = [], 
        roomName = "", 
        room = {},
        totalPrice = 0, 
        dateSelected = "" 
    } = location.state || {};

    const movieName = room.movie_name || "Película no especificada";
    const schedule = room.schedule || "Horario no especificado";

    const formatTime = (dateString) => {
        if (!dateString) return "Horario no especificado";
        const date = new Date(dateString);
        return isNaN(date) ? dateString : date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Fecha no especificada";
        const date = new Date(dateString);
        return isNaN(date) ? dateString : date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const generateQRText = () => {
        return JSON.stringify({
            pelicula: movieName,
            sala: roomName,
            fecha: formatDate(dateSelected),
            horario: formatTime(schedule),
            asientos: selectedSeats,
            total: `$${totalPrice.toFixed(2)}`
        }, null, 2);
    };

    const downloadQR = () => {
        const svgElement = qrRef.current.querySelector("svg");
        if (svgElement) {
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();
            
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const pngFile = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.download = `reserva-${movieName.replace(/ /g, '_')}.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
            };
            
            img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
        }
    };

    const goToHome = () => navigate("/cine");

    useEffect(() => {
        if (!location.state) navigate("/cine");
    }, [location.state, navigate]);

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h2" sx={{ 
                    fontWeight: 700,
                    mb: 2,
                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    ¡Reserva Confirmada!
                </Typography>
                <Typography variant="h5" color="text.secondary">
                    Gracias por tu compra. Aquí está tu confirmación.
                </Typography>
                <Box sx={{ mt: 3, fontSize: '4rem' }}>🎬🎉</Box>
            </Box>

            <Card elevation={4} sx={{ borderRadius: 3, mb: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                        {movieName}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Detalles de la función:
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Typography color="text.secondary">Sala:</Typography>
                                    <Typography>{roomName}</Typography>
                                </Box>
                                
                                <Box>
                                    <Typography color="text.secondary">Fecha:</Typography>
                                    <Typography>{formatDate(dateSelected)}</Typography>
                                </Box>

                                <Box>
                                    <Typography color="text.secondary">Horario:</Typography>
                                    <Typography>{formatTime(schedule)}</Typography>
                                </Box>
                                
                                <Box>
                                    <Typography color="text.secondary">Asientos:</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                        {selectedSeats.map((seat, index) => (
                                            <Box key={index} sx={{
                                                px: 2,
                                                py: 1,
                                                backgroundColor: theme.palette.primary.light,
                                                color: theme.palette.primary.contrastText,
                                                borderRadius: 1,
                                                fontWeight: 500
                                            }}>
                                                {seat}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Box sx={{ 
                                backgroundColor: theme.palette.grey[100],
                                p: 3,
                                borderRadius: 2,
                                height: '100%'
                            }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Resumen de pago
                                </Typography>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography>Asientos ({selectedSeats.length}):</Typography>
                                    <Typography>${(totalPrice / selectedSeats.length).toFixed(2)} c/u</Typography>
                                </Box>
                                
                                <Divider sx={{ my: 2 }} />
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6">Total:</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        ${totalPrice.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Muestra este código QR al llegar al cine:
                </Typography>
                
                <Box ref={qrRef} sx={{ 
                    display: 'inline-block', 
                    mb: 3,
                    p: 2,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: 3
                }}>
                    <QRCodeSVG 
                        value={generateQRText()} 
                        size={200}
                        level="H"
                        includeMargin={true}
                        fgColor={theme.palette.primary.dark}
                    />
                    <Typography variant="caption" sx={{ 
                        display: 'block', 
                        mt: 1, 
                        color: 'text.secondary',
                        fontWeight: 500
                    }}>
                        {movieName}
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button 
                        variant="contained"
                        onClick={downloadQR}
                        sx={{ mb: 3 }}
                    >
                        Descargar QR
                    </Button>
                    <Button 
                        variant="outlined"
                        onClick={goToHome}
                        sx={{ mb: 3 }}
                    >
                        Volver al inicio
                    </Button>
                </Box>
                
                <Typography variant="body1" color="text.secondary">
                    Presenta este código QR en taquilla para validar tu reserva.
                </Typography>
            </Box>
        </Container>
    );
};

export default ConfirmationPage;