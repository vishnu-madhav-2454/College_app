import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, Sparkles, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onOpenLogin, onOpenAdmission, scrollToSection }) => {
  const { user, role, logout, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getRoleBadgeStyle = () => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'teacher': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'junior_lecturer': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const navLinks = [
    { label: 'About', section: 'about' },
    { label: 'Programs', section: 'programs' },
    { label: 'Achievements', section: 'achievements' },
    { label: 'Faculty', section: 'faculty' },
    { label: 'Campuses', section: 'branches' }
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg shadow-slate-200/50' 
          : 'bg-white border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/30">
              A
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight">
                APEX ACADEMY
              </h1>
              <p className="text-[10px] lg:text-xs text-slate-500 font-medium tracking-wider uppercase">
                JEE • NEET • EAMCET
              </p>
            </div>
            {isAuthenticated && (
              <span className={`hidden sm:inline-flex ml-2 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getRoleBadgeStyle()}`}>
                {role?.replace('_', ' ')}
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          {!isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.section}
                  onClick={() => scrollToSection?.(link.section)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            {!isAuthenticated ? (
              <>
                {/* Desktop Buttons */}
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={onOpenLogin}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </button>
                  <button
                    onClick={onOpenAdmission}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl hover:shadow-blue-600/30 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Apply Now
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              /* Authenticated User */
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-slate-900 leading-tight">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[140px]">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {!isAuthenticated && isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 py-4 animate-fade-in-down">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.section}
                  onClick={() => {
                    scrollToSection?.(link.section);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  onOpenLogin();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
              <button
                onClick={() => {
                  onOpenAdmission();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Apply Now
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
