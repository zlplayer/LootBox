import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Login from "@/Login/Login";
import Register from "@/Register/Register";

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex items-center justify-between bg-neutral-800 text-white p-4">
      {/* Logo */}
      <NavLink to="/" className="text-xl font-bold">
        LootBox
      </NavLink>

      {/* Hamburger Menu (Mobile) */}
      <button
        className="sm:hidden p-2 border rounded-md"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Navigation Links */}
      <ul
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row gap-4 sm:gap-6 items-center absolute sm:static top-[4rem] right-0 sm:right-auto bg-neutral-800 sm:bg-transparent p-4 sm:p-0 w-full sm:w-auto z-10 shadow-lg sm:shadow-none`}
      >
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-neutral-400"
                : "hover:text-neutral-300"
            }
          >
            Cases
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/items"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-neutral-400"
                : "hover:text-neutral-300"
            }
          >
            Items
          </NavLink>
        </li>
        {userName ? (
          <li className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  {userName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2">
                <DropdownMenuItem>
                  <NavLink to="/profile" className="w-full">
                    Profile
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <NavLink to="/equipment" className="w-full">
                    Equipment
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <NavLink to="/users" className="w-full">
                    Users
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ) : (
          <>
            <li>
              <Register />
            </li>
            <li>
              <Login />
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
