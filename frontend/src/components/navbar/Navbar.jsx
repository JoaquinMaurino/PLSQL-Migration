// src/components/Navbar.jsx
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-link" activeclassname="active">
        Inicio
      </NavLink>
      <NavLink to="/empleados" className="nav-link" activeclassname="active">
        Empleados
      </NavLink>
    </nav>
  );
};

export default Navbar;
