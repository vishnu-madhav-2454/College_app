import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/logo.png';
import { COLORS } from '../../constants/colors';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Achievements', path: '/achievements' },
  { name: 'Faculty', path: '/faculty' },
  { name: 'Campuses', path: '/campuses' },
  { name: 'Courses', path: '/courses' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-gradient-to-r from-[#ffdb5e] via-[#ffdb60] to-[#ffdb70] w-full rounded-b-[5px] shadow-lg">
      <div className="flex justify-between items-center h-[80px] px-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="College Logo" className="h-[60px] mr-2" />
        </div>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-black/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex space-x-6 text-[18px] font-medium">
          {navItems.map((item) => (
            <li className="relative group" key={item.name}>
              <NavLink
                to={item.path}
                className="bg-gradient-to-b from-[#e91c2a] to-[#9b0c0c] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                {item.name}
              </NavLink>
              <span className="absolute left-0 -bottom-1 h-[3px] w-0 bg-gradient-to-b from-[#e91c2a] to-[#9b0c0c] transition-all duration-300 group-hover:w-full rounded-[3px]" />
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-[#ffdb5e] via-[#ffdb60] to-[#ffdb70] border-t border-[#e91c2a]/20">
          <ul className="flex flex-col items-center space-y-4 py-4 text-[18px] font-medium">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className="bg-gradient-to-b from-[#e91c2a] to-[#9b0c0c] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                  onClick={closeMenu}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;