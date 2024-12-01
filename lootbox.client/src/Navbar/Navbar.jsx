import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useState } from 'react';

function Navbar() {
    const navigate = useNavigate();

    // Stan do kontrolowania, czy menu rozwijane jest widoczne
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Sprawd�, czy u�ytkownik jest zalogowany
    const userName = localStorage.getItem('userName');  // Pobierz nazw� u�ytkownika z localStorage

    // Funkcja wylogowania
    const handleLogout = () => {
        localStorage.removeItem('token');  // Usu� token JWT
        localStorage.removeItem('userName');  // Usu� nazw� u�ytkownika
        navigate('/login');  // Przekierowanie na stron� logowania
    };

    // Funkcja do prze��czania widoczno�ci menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item">
                    <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
                        Home
                    </NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/case/create" className={({ isActive }) => (isActive ? "active-link" : "")}>
                        Create Case
                    </NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/items" className={({ isActive }) => (isActive ? "active-link" : "")}>
                        Items
                    </NavLink>
                </li>
                {userName ? (
                    // Je�li u�ytkownik jest zalogowany, poka� nazw� u�ytkownika
                    <li className="navbar-item">
                        <span
                            className="user-name"
                            style={{ color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                            onClick={toggleMenu}
                        >
                            Hello, {userName}
                        </span>
                        {/* Je�li menu jest otwarte, poka� opcj� logout */}
                        {isMenuOpen && (
                            <div className="dropdown-menu">
                                <button onClick={handleLogout} className="logout-button">
                                    Logout
                                </button>
                            </div>
                        )}
                    </li>
                ) : (
                    // Je�li u�ytkownik nie jest zalogowany, poka� linki do logowania i rejestracji
                    <>
                        <li className="navbar-item">
                            <NavLink to="/register" className={({ isActive }) => (isActive ? "active-link" : "")}>
                                Register
                            </NavLink>
                        </li>
                        <li className="navbar-item">
                            <NavLink to="/login" className={({ isActive }) => (isActive ? "active-link" : "")}>
                                Login
                            </NavLink>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
