'use client'

import React, { useEffect, useState, useContext } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import BottomNav from '@/components/layout/BottomNav';
import WorkoutTab from '@/components/workout/WorkoutTab';
import PlanTab from '@/components/plan/PlanTab';
import FriendsTab from '@/components/friends/FriendsTab';
import LeaderboardTab from '@/components/leaderboard/LeaderboardTab';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useFriends } from '@/hooks/useFriends';
import AuthPage from '@/components/auth/AuthPage';
import { UserContext } from '@/context/UserContext';

export default function Home() {
  const [activeTab, setActiveTab] = useState('workout');
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true)
  const workoutHook = useWorkouts(currentUser, setCurrentUser) 
  const friendsHook = useFriends()

  useEffect(()=> {
    const checkSession = ()=> {
      const savedUser = localStorage.getItem('fittracker_user')
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (e) {
          localStorage.removeItem('fittracker_user')
        }
      }
      setLoading(false)
    }
    checkSession()
  }, [setCurrentUser])

  const handleLogin = (userData, token)=> {
    const backendUser = {
      _id: userData._id,
      username: userData.username,
      email: userData.email,
      totalWorkouts: userData.totalWorkouts || 0,
      totalWeight: userData.totalWeight || 0,
      avatar: "👤",
    }
    setCurrentUser(backendUser)
    localStorage.setItem('fittracker_user', JSON.stringify(backendUser))
    if (token) {
      localStorage.setItem('fittracker_token', token)
    }
  }

  const handleLogout = ()=> {
    setCurrentUser(null)
    localStorage.removeItem('fittracker_user')
    setActiveTab('workout')
  }
  
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'workout':
        return <WorkoutTab {...workoutHook} />;
      case 'plan':
        return <PlanTab {...workoutHook} />;
      case 'friends':
        return (
          <FriendsTab
            friends={friendsHook.friends}
            showAddFriend={friendsHook.showAddFriend}
            setShowAddFriend={friendsHook.setShowAddFriend}
            newFriendName={friendsHook.newFriendName}
            setNewFriendName={friendsHook.setNewFriendName}
            addFriend={friendsHook.addFriend}
            removeFriend={friendsHook.removeFriend}
            requests={friendsHook.requests}
            acceptRequest={friendsHook.acceptRequest}
            rejectRequest={friendsHook.rejectRequest}
          />
        );
      case 'leaderboard':
        return <LeaderboardTab />;
      default:
        return <WorkoutTab {...workoutHook} />;
    }
  };

  if (loading) {
    return (
      <div className='max-w-md mx-auto bg-white min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'>
            <p className='text-gray-600'>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />
  }

  return (
    <MainLayout currentUser={currentUser} onLogout={handleLogout}>
      {renderActiveTab()}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </MainLayout>
  );
};