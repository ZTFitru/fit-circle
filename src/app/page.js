'use client'

import React, { useEffect, useContext } from 'react';
import AuthPage from '@/components/auth/AuthPage';
import { UserContext } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { currentUser, setCurrentUser, loading } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/workouts');
    }
  }, [currentUser, router]);

  if (loading) {
    return (
      <div className='max-w-md mx-auto bg-white min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AuthPage
        onLogin={(user, token) => {
          setCurrentUser(user);
          localStorage.setItem('fittracker_user', JSON.stringify(user));
          if (token) localStorage.setItem('fittracker_token', token);
        }}
      />
    );
  }

  return null;
}