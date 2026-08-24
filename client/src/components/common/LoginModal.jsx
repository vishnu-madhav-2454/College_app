import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, UserCheck, AlertCircle, Sparkles, GraduationCap, School, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginModal = ({ isOpen, onClose, onOpenAdmission }) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please enter your email or enrollment number and password.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await login(identifier.trim(), password);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid login credentials. Please verify and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoId, demoPass) => {
    setIdentifier(demoId);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 pb-7">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Unified Smart Portal Access</span>
          </div>
          <h2 className="text-2xl font-bold font-serif">Sign In to Apex</h2>
          <p className="text-xs text-slate-300 mt-1">
            Enter your credentials. Our system automatically identifies your role (Student, Teacher, Junior Lecturer).
          </p>
        </div>

        {/* Body */}
        <div className="p-6 md:p-7 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email / Enrollment Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. rohan.jee@apex.edu or APEX-JEE-2025-0101"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">
                  Default: password123
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
              1-Click Instant Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('rohan.jee@apex.edu', 'password123')}
                className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-left font-medium transition cursor-pointer border border-blue-100 flex items-center space-x-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="truncate">JEE Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('ananya.neet@apex.edu', 'password123')}
                className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-left font-medium transition cursor-pointer border border-emerald-100 flex items-center space-x-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span className="truncate">NEET Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('karthik.eamcetmpc@apex.edu', 'password123')}
                className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-left font-medium transition cursor-pointer border border-amber-100 flex items-center space-x-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <span className="truncate">EAMCET MPC</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('sneha.eamcetbipc@apex.edu', 'password123')}
                className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-left font-medium transition cursor-pointer border border-rose-100 flex items-center space-x-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                <span className="truncate">EAMCET BiPC</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('teacher.radhakrishnan@apex.edu', 'password123')}
                className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 text-left font-medium transition cursor-pointer border border-purple-100 flex items-center space-x-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <span className="truncate">Senior Teacher</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('jl.suresh@apex.edu', 'password123')}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-left font-medium transition cursor-pointer border border-slate-200 flex items-center space-x-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                <span className="truncate">Junior Lecturer</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-slate-500">
            Don't have an enrollment yet?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdmission();
              }}
              className="font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Take Admission Now
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
