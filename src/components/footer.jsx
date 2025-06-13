import React from 'react';
import { FaEnvelope, FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from 'react-icons/fa6'; 

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#ffdb5e] via-[#ffdb60] to-[#ffdb70] text-[#2c2c2c] mt-10 ">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
        
        <div>
          <h2 className="text-lg font-semibold mb-2 bg-gradient-to-b from-[#e91c2a] to-[#9b0c0c] bg-clip-text text-transparent">About Us</h2>
          <p>
            We are dedicated to providing quality education, excellence in research, and fostering innovation through our campuses and courses.
          </p>
        </div>

        
        <div>
          <h2 className="text-lg font-semibold mb-2 bg-gradient-to-b from-[#e91c2a] to-[#9b0c0c] bg-clip-text text-transparent">Quick Links</h2>
          <ul className="space-y-1">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/achievements" className="hover:underline">Achievements</a></li>
            <li><a href="/faculty" className="hover:underline">Faculty</a></li>
            <li><a href="/campuses" className="hover:underline">Campuses</a></li>
            <li><a href="/courses" className="hover:underline">Courses</a></li>
          </ul>
        </div>

        
        <div>
          <h2 className="text-lg font-semibold mb-2 bg-gradient-to-b from-[#e91c2a] to-[#9b0c0c] bg-clip-text text-transparent">Connect With Us</h2>
          <p>Email: ssjccong@gmail.com</p>
          <p>Phone: +91 91761 62696</p>
          <p>Location: Pellore Ongole</p>

          
          <div className="flex space-x-4 mt-4 text-[#9b0c0c]">
            <a href="https://www.facebook.com/SRISARASWATHIGROUPS/" target="_blank" rel="noopener noreferrer" className="hover:text-[#e91c2a] transition">
              <FaFacebookF size={20} />
            </a>
            <a href="https://www.instagram.com/sri_saraswathi_edu_institution/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-[#e91c2a] transition">
              <FaInstagram size={20} />
            </a>
            <a href="https://www.youtube.com/@srisaraswathijuniorcollege" target="_blank" rel="noopener noreferrer" className="hover:text-[#e91c2a] transition">
              <FaYoutube size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center py-4 border-t border-[#e91c2a] text-xs">
        © {new Date().getFullYear()} College Name. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

