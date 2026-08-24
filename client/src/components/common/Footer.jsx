import React, { useEffect, useState } from 'react';
import { MapPin, Globe, Share2, AtSign, Link2, Play, Heart } from 'lucide-react';

export const Footer = ({ onOpenAdmission, scrollToSection }) => {
  const currentYear = new Date().getFullYear();
  const [footerData, setFooterData] = useState({ programs: [], branches: [] });

  useEffect(() => {
    fetch('/api/public/home-data')
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('Footer data unavailable')))
      .then((data) => setFooterData({ programs: data.programs || [], branches: data.branches || [] }))
      .catch((error) => console.error('Failed to load footer data:', error));
  }, []);

  const quickLinks = [
    { label: 'About Us', section: 'about' },
    { label: 'Programs', section: 'programs' },
    { label: 'Achievements', section: 'achievements' },
    { label: 'Faculty', section: 'faculty' },
    { label: 'Campuses', section: 'branches' }
  ];

  const socialLinks = [
    { icon: Globe, href: '#', label: 'Facebook' },
    { icon: AtSign, href: '#', label: 'Twitter / X' },
    { icon: Share2, href: '#', label: 'Instagram' },
    { icon: Link2, href: '#', label: 'LinkedIn' },
    { icon: Play, href: '#', label: 'YouTube' }
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">APEX ACADEMY</h3>
                <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">
                  Excellence in Education
                </p>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed">
              South India's premier coaching institute for JEE, NEET, and EAMCET preparation. 
              Transforming dreams into achievements since 2008.
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.section}>
                  <button
                    onClick={() => scrollToSection?.(link.section)}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={onOpenAdmission}
                  className="text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  Apply for Admission →
                </button>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Our Programs
            </h4>
            <ul className="space-y-3">
              {footerData.programs.map((prog) => (
                <li key={prog.id}>
                  <button
                    onClick={onOpenAdmission}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {prog.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Campus Locations */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Campus Locations
            </h4>
            <ul className="space-y-4">
              {footerData.branches.map((campus) => (
                <li key={campus.id} className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-white font-medium">{campus.name}</p>
                    <p className="text-xs text-slate-500">{campus.phone}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {currentYear} Apex Academy. All rights reserved.
            </p>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for future IITians & Doctors
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
