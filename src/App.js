// src/App.js
import { useContext } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AuthProvider, { AuthContext } from "./context/AuthProvider";
import CinePage from "./pages/CinePage";
import ConfirmationPage from './pages/ConfirmationPage';
import PaymentPage from './pages/PaymentPage';
import ReserveSeatsPage from './pages/ReserveSeatsPage';
import RoomPage from "./pages/RoomPage";
import UsersPage from "./pages/usersPage";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

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
          {/* Rutas protegidas (requieren autenticación) */}
          <Route path="/cine" element={
            <PrivateRoute>
              <CinePage />
            </PrivateRoute>
          } />
          
          {/* Rutas protegidas (requieren autenticación) */}
         <Route path="/admin/users" element={
         <PrivateRoute>
         <UsersPage />
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

         <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPasswordForm />
            </PublicRoute>
          } />

          {/* Ruta de fallback para URLs no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;