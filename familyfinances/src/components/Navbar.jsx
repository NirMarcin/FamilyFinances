import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import LogoutButton from "./buttons/LogoutButton";
import DarkModeToggle from "./buttons/DarkModeToggle"; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-orange-600 font-semibold dark:text-orange-400"
      : "text-gray-700 hover:text-orange-500 dark:text-orange-300 dark:hover:text-orange-400";

  const navLinks = [
    { to: "/dashboard", label: "Podsumowanie" },
    { to: "/expenses", label: "Zarządzanie wydatkami" },
    { to: "/charts", label: "Wykresy i statystyki" },
    { to: "/budget", label: "Budżet" },
    { to: "/settings", label: "Ustawienia" },
  ];

  return (
    <nav className="bg-white dark:bg-black shadow-md fixed top-0 left-0 w-full z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-orange-600 dark:text-orange-400 tracking-wide"
            >
              FamilyFinances
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Dark mode toggle & User */}
          <div className="flex items-center space-x-4">
            
            <LogoutButton variant="desktop" />
            <DarkModeToggle variant="desktop" />
            {/* Hamburger menu na mobile */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-700 hover:text-orange-600 dark:text-orange-300 dark:hover:text-orange-400 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 shadow-inner animate-fade-in transition-colors duration-300">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              onClick={() => setIsOpen(false)}
              to={link.to}
              className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 dark:text-orange-300 dark:hover:bg-gray-900 dark:hover:text-orange-400 transition"
            >
              {link.label}
            </NavLink>
          ))}
          <LogoutButton
            variant="mobile"
            onClickExtra={() => setIsOpen(false)}
          />
          <DarkModeToggle variant="mobile" onClickExtra={() => setIsOpen(false)} />
        </div>
      )}
    </nav>
  );
}
