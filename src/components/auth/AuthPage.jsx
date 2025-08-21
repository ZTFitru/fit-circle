'use client'
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Dumbbell } from 'lucide-react';

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-purple-600 text-white p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Dumbbell size={32} />
          <h1 className="text-3xl font-bold">Fit-Circle</h1>
        </div>
        <p className="text-white text-sm">
          Track your workouts, compete with friends
        </p>
      </div>

      {/* Auth Form Container */}
      <div className="flex-1 p-6 flex flex-col justify-center">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            {isLogin ? 'Welcome Back!' : 'Join Fit-Circle'}
          </h2>
          <p className="text-gray-600 text-center text-sm">
            {isLogin 
              ? 'Sign in to continue your fitness journey' 
              : 'Create an account to start tracking'
            }
          </p>
        </div>

        {/* Auth Forms */}
        {isLogin ? (
          <LoginForm onLogin={onLogin} />
        ) : (
          <RegisterForm onRegister={onLogin} />
        )}

        {/* Switch Between Login/Register */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-red-600 font-medium hover:text-green-700 transition-colors mt-1"
          >
            {isLogin ? 'Sign up here' : 'Sign in here'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-gray-500 border-t">
        <p>By continuing, you agree to our Terms & Privacy Policy</p>
      </div>
    </div>
  );
};

export default AuthPage;