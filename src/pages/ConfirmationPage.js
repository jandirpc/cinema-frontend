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
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ConfirmationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const qrRef = useRef(null);

    const {
        selectedSeats = [],
        roomName = "",
        room = {},
        totalPrice = 0,
        dateSelected = ""
    } = location.state || {};

    const movieName = room.movie_name || "Película no especificada";
    const schedule = room.hour ? `1970-01-01T${room.hour}` : null;

    const formatTime = (dateString) => {
        if (!dateString) return "Horario no especificado";
        const date = new Date(dateString);
        if (isNaN(date)) return dateString;
        let options = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        return date.toLocaleTimeString('en-US', options).toUpperCase();
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
        <Box sx={{
            background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[100]} 100%)`,
            minHeight: '100vh',
            py: 6,
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '300px',
                background: `linear-gradient(to bottom, ${theme.palette.success.dark} 0%, transparent 100%)`,
                zIndex: 0,
                opacity: 0.1
            }
        }}>
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Encabezado */}
                <Box sx={{ 
                    textAlign: 'center', 
                    mb: 6,
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '150px',
                        height: '4px',
                        background: `linear-gradient(90deg, transparent 0%, ${theme.palette.success.main} 50%, transparent 100%)`,
                        borderRadius: '2px'
                    }
                }}>
                    <Typography variant="h2" sx={{
                        fontWeight: 800,
                        mb: 2,
                        letterSpacing: '0.05em',
                        background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        ¡Reserva Confirmada!
                    </Typography>
                    <Typography variant="h5" sx={{
                        color: theme.palette.text.secondary,
                        fontStyle: 'italic',
                        fontWeight: 300
                    }}>
                        Gracias por tu compra. Aquí está tu confirmación.
                    </Typography>
                </Box>

                {/* Tarjeta de confirmación */}
                <Card elevation={4} sx={{ 
                    borderRadius: 3, 
                    mb: 4,
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.15)`,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-50%',
                        right: '-50%',
                        width: '200%',
                        height: '200%',
                        background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, transparent 70%)`,
                        opacity: 0.1,
                        zIndex: -1
                    }
                }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h4" sx={{ 
                            mb: 3, 
                            fontWeight: 700,
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-8px',
                                left: 0,
                                width: '60px',
                                height: '4px',
                                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                borderRadius: '2px'
                            }
                        }}>
                            {movieName}
                        </Typography>

                        <Divider sx={{ 
                            my: 2,
                            background: `linear-gradient(90deg, transparent 0%, ${theme.palette.grey[300]} 50%, transparent 100%)`,
                            height: '1px'
                        }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ 
                                    mb: 2,
                                    fontWeight: 600,
                                    color: theme.palette.primary.dark,
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&::before': {
                                        content: '""',
                                        display: 'inline-block',
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: theme.palette.primary.main,
                                        marginRight: '12px'
                                    }
                                }}>
                                    Detalles de la función
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: '8px',
                                        background: 'rgba(0, 0, 0, 0.02)',
                                        borderLeft: `4px solid ${theme.palette.primary.main}`
                                    }}>
                                        <Typography color="text.secondary" sx={{ mb: 0.5 }}>Sala:</Typography>
                                        <Typography sx={{ fontWeight: 500 }}>{roomName}</Typography>
                                    </Box>

                                    <Box sx={{
                                        p: 2,
                                        borderRadius: '8px',
                                        background: 'rgba(0, 0, 0, 0.02)',
                                        borderLeft: `4px solid ${theme.palette.secondary.main}`
                                    }}>
                                        <Typography color="text.secondary" sx={{ mb: 0.5 }}>Fecha:</Typography>
                                        <Typography sx={{ fontWeight: 500 }}>{formatDate(dateSelected)}</Typography>
                                    </Box>

                                    <Box sx={{
                                        p: 2,
                                        borderRadius: '8px',
                                        background: 'rgba(0, 0, 0, 0.02)',
                                        borderLeft: `4px solid ${theme.palette.success.main}`
                                    }}>
                                        <Typography color="text.secondary" sx={{ mb: 0.5 }}>Horario:</Typography>
                                        <Typography sx={{ fontWeight: 500 }}>{formatTime(schedule)}</Typography>
                                    </Box>

                                    <Box sx={{
                                        p: 2,
                                        borderRadius: '8px',
                                        background: 'rgba(0, 0, 0, 0.02)',
                                        borderLeft: `4px solid ${theme.palette.warning.main}`
                                    }}>
                                        <Typography color="text.secondary" sx={{ mb: 0.5 }}>Asientos:</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                            {selectedSeats.map((seat, index) => (
                                                <Box key={index} sx={{
                                                    px: 2,
                                                    py: 1,
                                                    backgroundColor: theme.palette.primary.light,
                                                    color: theme.palette.primary.contrastText,
                                                    borderRadius: 1,
                                                    fontWeight: 600,
                                                    boxShadow: `0 2px 4px ${theme.palette.primary.light}`,
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)'
                                                    }
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
                                    backgroundColor: 'rgba(255,255,255,0.7)',
                                    p: 3,
                                    borderRadius: 2,
                                    height: '100%',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    border: '1px solid rgba(0,0,0,0.05)'
                                }}>
                                    <Typography variant="h6" sx={{ 
                                        mb: 2,
                                        fontWeight: 600,
                                        color: theme.palette.primary.dark
                                    }}>
                                        Resumen de pago
                                    </Typography>

                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        mb: 2,
                                        p: 1,
                                        borderRadius: 1,
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.02)'
                                        }
                                    }}>
                                        <Typography>Asientos ({selectedSeats.length}):</Typography>
                                        <Typography>${(totalPrice / selectedSeats.length).toFixed(2)} c/u</Typography>
                                    </Box>

                                    <Divider sx={{ 
                                        my: 2,
                                        background: `linear-gradient(90deg, transparent 0%, ${theme.palette.grey[300]} 50%, transparent 100%)`,
                                        height: '1px'
                                    }} />

                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        p: 2,
                                        borderRadius: 1,
                                        backgroundColor: 'rgba(0,0,0,0.03)'
                                    }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Total:</Typography>
                                        <Typography variant="h4" sx={{ 
                                            fontWeight: 800,
                                            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}>
                                            ${totalPrice.toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Sección del QR */}
                <Box sx={{ 
                    textAlign: 'center', 
                    mb: 6,
                    position: 'relative'
                }}>
                    <Typography variant="h6" sx={{ 
                        mb: 3,
                        fontWeight: 600,
                        color: theme.palette.primary.dark,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '100px',
                            height: '4px',
                            background: `linear-gradient(90deg, transparent 0%, ${theme.palette.primary.main} 50%, transparent 100%)`,
                            borderRadius: '2px'
                        }
                    }}>
                        Muestra este código QR al llegar al cine
                    </Typography>

                    <Box ref={qrRef} sx={{
                        display: 'inline-block',
                        mb: 3,
                        p: 3,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: `0 10px 20px rgba(0,0,0,0.1)`,
                        border: '1px solid rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: `0 15px 30px rgba(0,0,0,0.2)`
                        }
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
                            mt: 2,
                            color: theme.palette.text.secondary,
                            fontWeight: 500,
                            letterSpacing: '0.05em'
                        }}>
                            {movieName}
                        </Typography>
                    </Box>

                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: 3,
                        mb: 4,
                        flexWrap: 'wrap'
                    }}>
                        <Button
                            variant="contained"
                            onClick={downloadQR}
                            sx={{
                                py: 1.5,
                                px: 4,
                                borderRadius: '12px',
                                fontWeight: 600,
                                fontSize: '1rem',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                boxShadow: `0 4px 6px ${theme.palette.primary.light}`,
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 8px 15px ${theme.palette.primary.light}`
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Descargar QR
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={goToHome}
                            sx={{
                                py: 1.5,
                                px: 4,
                                borderRadius: '12px',
                                fontWeight: 600,
                                fontSize: '1rem',
                                borderWidth: '2px',
                                borderColor: theme.palette.primary.main,
                                color: theme.palette.primary.main,
                                '&:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                    borderWidth: '2px',
                                    transform: 'translateY(-2px)'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Volver al inicio
                        </Button>
                    </Box>

                    <Typography variant="body1" sx={{
                        color: theme.palette.text.secondary,
                        fontStyle: 'italic',
                        maxWidth: '600px',
                        mx: 'auto',
                        px: 2
                    }}>
                        Presenta este código QR en taquilla para validar tu reserva.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default ConfirmationPage;