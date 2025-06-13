import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Menu, X } from 'lucide-react'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gradient-to-r from-[#ffdb5e] via-[#ffdb60] to-[#ffdb70] w-full rounded-b-[5px] basic-shadow-lg">
      <div className="flex justify-between items-center h-[80px] px-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="College Logo" className="h-[60px] mr-2" />
        </div>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex space-x-6 text-[18px] font-anston font-medium">
          {['Home', 'Achievements', 'Faculty', 'Campuses', 'Courses'].map((item) => (
            <li className="relative group" key={item}>
              <NavLink
                to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                className="bg-gradient-to-b from-[#e91c2a] to-[#9b0c0c] bg-clip-text text-transparent"
              >
                {item}
              </NavLink>
              <span className="absolute left-0 -bottom-1 h-[3px] w-0 bg-gradient-to-b from-[#e91c2a] to-[#9b0c0c] transition-all duration-300 group-hover:w-full rounded-[3px]" />
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden flex flex-col items-center space-y-4 pb-4 text-[18px] font-anston font-medium">
          {['Home', 'Achievements', 'Faculty', 'Campuses', 'Courses'].map((item) => (
            <li key={item}>
              <NavLink
                to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                className="bg-gradient-to-b from-[#e91c2a] to-[#9b0c0c] bg-clip-text text-transparent"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;

