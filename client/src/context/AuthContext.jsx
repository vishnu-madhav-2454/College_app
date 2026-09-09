import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('apex_token') || null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth session on startup
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('apex_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setStudentProfile(data.studentProfile);
          setTeacherProfile(data.teacherProfile);
          setToken(storedToken);
        } else {
          localStorage.removeItem('apex_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('apex_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setStudentProfile(data.studentProfile);
    setTeacherProfile(data.teacherProfile);

    return data;
  };

  const logout = () => {
    localStorage.removeItem('apex_token');
    setToken(null);
    setUser(null);
    setStudentProfile(null);
    setTeacherProfile(null);
  };

  const refreshMe = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setStudentProfile(data.studentProfile);
        setTeacherProfile(data.teacherProfile);
      }
    } catch (err) {
      console.error('Refresh error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        token,
        studentProfile,
        teacherProfile,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshMe
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
