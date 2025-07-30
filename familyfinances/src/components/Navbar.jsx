import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import LogoutButton from "./buttons/LogoutButton";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-orange-600 font-semibold"
      : "text-gray-700 hover:text-orange-500";

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-orange-600">
              FamilyFinances
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6">
            <NavLink to="/dashboard" className={linkClass}>
              Podsumowanie
            </NavLink>
            <NavLink to="/expenses" className={linkClass}>
              Zarządzanie wydatkami
            </NavLink>
            <NavLink to="/charts" className={linkClass}>
              Wykresy i statystki
            </NavLink>
            <NavLink to="/budget" className={linkClass}>
              Budżet
            </NavLink>
            <NavLink to="/reports" className={linkClass}>
              Raporty
            </NavLink>
            <NavLink to="/settings" className={linkClass}>
              Ustawienia
            </NavLink>
          </div>

          {/* User & Hamburger */}
          <div className="flex items-center space-x-4">
            {/* Przycisk wylogowania lub użytkownik */}
            <LogoutButton variant="desktop" />

            {/* Hamburger menu na mobile */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-700 hover:text-orange-600 focus:outline-none"
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
        <div className="md:hidden bg-white border-t border-gray-200 shadow-inner">
          <NavLink
            onClick={() => setIsOpen(false)}
            to="/dashboard"
            className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
          >
            Podsumowanie
          </NavLink>
          <NavLink
            onClick={() => setIsOpen(false)}
            to="/expenses"
            className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
          >
            Zarządzanie wydatkami
          </NavLink>
          <NavLink
            onClick={() => setIsOpen(false)}
            to="/income"
            className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
          >
            Przychody
          </NavLink>
          <NavLink
            onClick={() => setIsOpen(false)}
            to="/budget"
            className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
          >
            Budżet
          </NavLink>
          <NavLink
            onClick={() => setIsOpen(false)}
            to="/reports"
            className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
          >
            Raporty
          </NavLink>
          <NavLink
            onClick={() => setIsOpen(false)}
            to="/settings"
            className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
          >
            Ustawienia
          </NavLink>
          <LogoutButton
            variant="mobile"
            onClickExtra={() => setIsOpen(false)}
          />
        </div>
      )}
    </nav>
  );
}
