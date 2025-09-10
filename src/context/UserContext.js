'use client';
import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true)
  
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Failed to fetch current user:", err);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const refreshUser = fetchCurrentUser;

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, refreshUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};