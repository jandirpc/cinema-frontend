// import { AppBar, Button, Toolbar, Typography } from '@mui/material';
// import React from 'react';
// import { Link } from 'react-router-dom';

// const NavBar = () => {
//   return (
//     <AppBar position="static">
//       <Toolbar>
//         <Typography variant="h6" style={{ flexGrow: 1 }}>
//           Mi Aplicación
//         </Typography>
//         <Button color="inherit" component={Link} to="/">
//           Inicio
//         </Button>
//         {/* Agrega más botones de navegación según sea necesario */}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default NavBar;

import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#333", color: "white" }}>
            <Link to="/cine" style={{ color: "white", textDecoration: "none" }}>
                🎬 CineApp
            </Link>
            <div>
                {user ? (
                    <>
                        <span style={{ marginRight: "10px" }}>Bienvenido, {user.email}</span>
                        <button onClick={logout} style={{ cursor: "pointer" }}>Salir</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ marginRight: "10px", color: "white", textDecoration: "none" }}>Iniciar Sesión</Link>
                        <Link to="/register" style={{ color: "white", textDecoration: "none" }}>Registrarse</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
