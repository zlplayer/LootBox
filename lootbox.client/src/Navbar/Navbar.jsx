import { NavLink } from 'react-router-dom';
import './Navbar.css'; // Dla stylów, opcjonalne

function Navbar() {
    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item">
                    <NavLink to="/" exact activeClassName="active-link">
                        Home
                    </NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/case/create" activeClassName="active-link">
                        Create Case
                    </NavLink>
                </li>
                {/* Dodaj wiêcej linków w miarê potrzeby */}
            </ul>
        </nav>
    );
}

export default Navbar;
