// src/App.js
import { useContext } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AuthProvider, { AuthContext } from "./context/AuthProvider";
import CinePage from "./pages/CinePage";
import ConfirmationPage from './pages/ConfirmationPage';
import PaymentPage from './pages/PaymentPage';
import ReserveSeatsPage from './pages/ReserveSeatsPage';
import RoomPage from "./pages/RoomPage";

// Componente PrivateRoute mejorado
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // Guardamos la ubicación a la que intentaban acceder para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Componente para redirigir usuarios logueados lejos del login/register
const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  if (user) {
    return <Navigate to="/cine" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas (solo accesibles sin autenticación) */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <RegisterForm />
            </PublicRoute>
          } />

          {/* Ruta raíz: redirige a login o cine según autenticación */}
          <Route path="/" element={
            <PublicRoute>
              <Navigate to="/login" replace />
            </PublicRoute>
          } />

          {/* Rutas protegidas (requieren autenticación) */}
          <Route path="/cine" element={
            <PrivateRoute>
              <CinePage />
            </PrivateRoute>
          } />
          
          <Route path="/rooms/:id" element={
            <PrivateRoute>
              <RoomPage />
            </PrivateRoute>
          } />
          
          <Route path="/confirmar-reserva" element={
            <PrivateRoute>
              <ConfirmationPage />
            </PrivateRoute>
          } />
          
          <Route path="/rooms/:id/reservar" element={
            <PrivateRoute>
              <ReserveSeatsPage />
            </PrivateRoute>
          } />
          
          <Route path="/reservar-asientos/:id" element={
            <PrivateRoute>
              <ReserveSeatsPage />
            </PrivateRoute>
          } />
          
          <Route path="/confirmar-reserva/:id" element={
            <PrivateRoute>
              <ConfirmationPage />
            </PrivateRoute>
          } />
          
          <Route path="/simulacion-pago/:id" element={
            <PrivateRoute>
              <PaymentPage />
            </PrivateRoute>
          } />

          {/* Ruta de fallback para URLs no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;