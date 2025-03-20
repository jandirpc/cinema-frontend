import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import CinePage from "./pages/CinePage";
import ConfirmationPage from './pages/ConfirmationPage';
import PaymentPage from './pages/PaymentPage';
import ReserveSeatsPage from './pages/ReserveSeatsPage';
import RoomPage from "./pages/RoomPage";



function App() {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/cine" element={<CinePage />} />
            <Route path="/rooms/:id" element={<RoomPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/confirmar-reserva" element={<ConfirmationPage />} />
            <Route path="/rooms/:id/reservar" element={<ReserveSeatsPage />}  />
            <Route path="/reservar-asientos/:id" element={<ReserveSeatsPage />} />
            <Route path="/confirmar-reserva/:id" element={<ConfirmationPage />} />
            <Route path="/simulacion-pago/:id" element={<PaymentPage />} />
            </Routes>
        </Router>
    );
}

export default App;

