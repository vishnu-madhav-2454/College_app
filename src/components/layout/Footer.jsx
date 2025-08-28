import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa6';

const socialLinks = [
  {
    icon: FaFacebookF,
    url: 'https://www.facebook.com/SRISARASWATHIGROUPS/',
    label: 'Facebook'
  },
  {
    icon: FaInstagram,
    url: 'https://www.instagram.com/sri_saraswathi_edu_institution/?hl=en',
    label: 'Instagram'
  },
  {
    icon: FaYoutube,
    url: 'https://www.youtube.com/@srisaraswathijuniorcollege',
    label: 'YouTube'
  }
];

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Achievements', path: '/achievements' },
  { name: 'Faculty', path: '/faculty' },
  { name: 'Campuses', path: '/campuses' },
  { name: 'Courses', path: '/courses' },
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#ffdb5e] via-[#ffdb60] to-[#ffdb70] text-[#2c2c2c] mt-10">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
        
        {/* About Us Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2 bg-gradient-to-b from-[#e91c2a] to-[#9b0c0c] bg-clip-text text-transparent">
            About Us
          </h2>
          <p className="leading-relaxed">
            We are dedicated to providing quality education, excellence in research, and fostering innovation through our campuses and courses.
          </p>
        </div>

        {/* Quick Links Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2 bg-gradient-to-b from-[#e91c2a] to-[#9b0c0c] bg-clip-text text-transparent">
            Quick Links
          </h2>
          <ul className="space-y-1">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <a href={link.path} className="hover:underline transition-all duration-200">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2 bg-gradient-to-b from-[#e91c2a] to-[#9b0c0c] bg-clip-text text-transparent">
            Connect With Us
          </h2>
          <div className="space-y-1 mb-4">
            <p>Email: ssjccong@gmail.com</p>
            <p>Phone: +91 91761 62696</p>
            <p>Location: Pellore Ongole</p>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-4 text-[#9b0c0c]">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e91c2a] transition-colors duration-200"
                aria-label={social.label}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center py-4 border-t border-[#e91c2a] text-xs">
        © {new Date().getFullYear()} Sri Saraswathi Educational Institutions. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;