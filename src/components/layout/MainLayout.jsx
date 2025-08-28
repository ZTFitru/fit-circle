import React from 'react';
import Header from '../common/Header';
import { Toaster } from 'react-hot-toast';

const MainLayout = ({ children, currentUser, onLogout }) => (
  <div className="max-w-md mx-auto bg-white min-h-screen">
    <Header currentUser={currentUser} onLogout={onLogout} />
    <div className="p-4 pb-24">
      {children}
      <Toaster position='top-right' />
    </div>
  </div>
);

export default MainLayout;