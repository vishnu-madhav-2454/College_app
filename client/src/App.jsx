import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { StudentDashboard } from './pages/StudentDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { JuniorLecturerDashboard } from './pages/JuniorLecturerDashboard';
import { LoginModal } from './components/common/LoginModal';
import { AdmissionModal } from './components/common/AdmissionModal';

function AppContent() {
  const { isAuthenticated, role, logout, refreshMe, isLoading } = useAuth();
  
  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [admissionProgram, setAdmissionProgram] = useState('JEE');

  // Show spinner while checking auth session on startup
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading Apex Academy...</p>
        </div>
      </div>
    );
  }


  const handleOpenAdmissionWithProgram = (prog) => {
    setAdmissionProgram(prog || 'JEE');
    setIsAdmissionOpen(true);
  };

  const handleLoginSuccess = async (data) => {
    // Refresh auth context after successful login
    await refreshMe();
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If user is LOGGED IN: show ONLY their dedicated portal
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-blue-600 selection:text-white">
        <Navbar />

        <main className="flex-grow">
          {role === 'student' && <StudentDashboard />}
          {role === 'teacher' && <TeacherDashboard />}
          {role === 'junior_lecturer' && <JuniorLecturerDashboard />}
          {!['student', 'teacher', 'junior_lecturer'].includes(role) && <StudentDashboard />}
        </main>

        <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-xs">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Logged in as <strong>{role.replace('_', ' ').toUpperCase()}</strong> • Apex Academy Portal</span>
            <button
              onClick={logout}
              className="text-rose-400 hover:underline font-bold cursor-pointer"
            >
              Sign out from session
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // If NOT logged in: Show the complete Public Home Page and public footer
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Sticky Navigation Bar */}
      <Navbar
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAdmission={() => setIsAdmissionOpen(true)}
        scrollToSection={scrollToSection}
      />

      {/* Public Home Page */}
      <main className="flex-grow">
        <HomePage
          onOpenAdmission={() => setIsAdmissionOpen(true)}
          onOpenLogin={() => setIsLoginOpen(true)}
          onSelectProgramAdmission={handleOpenAdmissionWithProgram}
        />
      </main>

      {/* Public Footer */}
      <Footer
        onOpenAdmission={() => setIsAdmissionOpen(true)}
        scrollToSection={scrollToSection}
      />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AdmissionModal
        isOpen={isAdmissionOpen}
        preselectedProgram={admissionProgram}
        onClose={() => setIsAdmissionOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
