import { NavLink } from 'react-router-dom';
import './Navbar.css'; // Dla styl�w, opcjonalne

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
                {/* Dodaj wi�cej link�w w miar� potrzeby */}
            </ul>
        </nav>
    );
}

export default Navbar;
