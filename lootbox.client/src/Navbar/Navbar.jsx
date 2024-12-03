import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useState } from 'react';

function Navbar() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Główne menu
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown użytkownika

    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <nav className="nav">
            <NavLink to="/" className="site-title">
                LootBox
            </NavLink>
            <button
                className="menu-toggle"
                onClick={toggleMenu}
                aria-label="Toggle menu">
                ☰
            </button>
            <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                <li>
                    <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
                        Cases
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/items" className={({ isActive }) => (isActive ? "active-link" : "")}>
                        Items
                    </NavLink>
                </li>
                {userName ? (
                    <li className="user-section">
                        <button
                            className={`user-dropdown-toggle ${isDropdownOpen ? 'open' : ''}`}
                            onClick={toggleDropdown}>
                            {userName}
                        </button>
                        {isDropdownOpen && (
                            <ul className="user-dropdown">
                                <li onClick={closeDropdown}>
                                    <NavLink to="/profile">Profile</NavLink>
                                </li>
                                <li onClick={closeDropdown}>
                                    <NavLink to="/equipment">Equipment</NavLink>
                                </li>
                                <li>
                                    <button className="logout-btn" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        )}
                    </li>
                ) : (
                    <>
                        <li>
                            <NavLink to="/register" className={({ isActive }) => (isActive ? "active-link" : "")}>
                                Register
                            </NavLink>
                        </li>
                        <li>
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
