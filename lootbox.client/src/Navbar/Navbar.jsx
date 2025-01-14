import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { 
  Package, 
  BoxIcon, 
  UserCircle2, 
  Users, 
  LogOut, 
  Trophy, 
  Wallet, 
  Repeat,
  Menu,
  ArrowUpFromLine
} from 'lucide-react';
import Login from "@/Login/Login";
import Register from "@/Register/Register";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const fetchWalletBalance = async () => {
    if (!userId || !token) return;
    
    try {
      const response = await fetch(`/api/wallet?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch wallet balance');
      const data = await response.json();
      setWalletBalance(data.money);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  useEffect(() => {
    fetchWalletBalance();
    const intervalId = setInterval(fetchWalletBalance, 5000);
    return () => clearInterval(intervalId);
  }, [userId, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("id");
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigationLinks = [
    { path: '/', label: 'Skrzynki', icon: <Package className="w-4 h-4" /> },
    { path: '/items', label: 'Przedmioty', icon: <BoxIcon className="w-4 h-4" /> },
    { path: '/ranking', label: 'Ranking', icon: <Trophy className="w-4 h-4" /> },
  ];

  const userLinks = [
    { path: '/profile', label: 'Profil', icon: <UserCircle2 className="w-4 h-4" /> },
    { path: '/equipment', label: 'Ekwipunek', icon: <Package className="w-4 h-4" /> },
    { path: '/wallet', label: 'Portfel', icon: <Wallet className="w-4 h-4" /> },
    { path: '/contracts', label: 'Kontrakty', icon: <Repeat className="w-4 h-4" /> },
  ];

  const adminLinks = [
    { path: '/users', label: 'Użytkownicy', icon: <Users className="w-4 h-4" /> },
    { path: '/withdrawals', label: 'Wypłaty', icon: <ArrowUpFromLine className="w-4 h-4" /> }
  ];

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="text-xl font-bold">
              CS Lootbox
            </NavLink>

            <div className="hidden md:flex items-center gap-6">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    }`
                  }
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {userName ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md bg-accent/50">
                  <Wallet className="w-4 h-4" />
                  <span className="font-medium">{walletBalance.toFixed(2)} zł</span>
                </div>
                
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{userName[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{userName}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {userLinks.map((link) => (
                        <DropdownMenuItem
                          key={link.path}
                          onClick={() => navigate(link.path)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          {link.icon}
                          {link.label}
                        </DropdownMenuItem>
                      ))}
                      {userRole === "Admin" && (
                        <>
                          <DropdownMenuSeparator />
                          {adminLinks.map((link) => (
                            <DropdownMenuItem
                              key={link.path}
                              onClick={() => navigate(link.path)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              {link.icon}
                              {link.label}
                            </DropdownMenuItem>
                          ))}
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="flex items-center gap-2 cursor-pointer text-destructive"
                      >
                        <LogOut className="w-4 h-4" />
                        Wyloguj się
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="flex flex-col gap-4 mt-6">
                      <div className="flex items-center gap-4 px-2">
                        <Avatar>
                          <AvatarFallback>{userName[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{userName}</p>
                          <p className="text-sm text-muted-foreground">{walletBalance.toFixed(2)} zł</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {navigationLinks.map((link) => (
                          <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                isActive
                                  ? "bg-accent text-accent-foreground"
                                  : "hover:bg-accent/50"
                              }`
                            }
                          >
                            {link.icon}
                            {link.label}
                          </NavLink>
                        ))}
                        {userLinks.map((link) => (
                          <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                isActive
                                  ? "bg-accent text-accent-foreground"
                                  : "hover:bg-accent/50"
                              }`
                            }
                          >
                            {link.icon}
                            {link.label}
                          </NavLink>
                        ))}
                        {userRole === "Admin" &&
                          adminLinks.map((link) => (
                            <NavLink
                              key={link.path}
                              to={link.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                  isActive
                                    ? "bg-accent text-accent-foreground"
                                    : "hover:bg-accent/50"
                                }`
                              }
                            >
                              {link.icon}
                              {link.label}
                            </NavLink>
                          ))}
                        <Button
                          variant="ghost"
                          className="flex items-center gap-2 w-full justify-start text-destructive"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4" />
                          Wyloguj się
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Register />
                <Login />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;