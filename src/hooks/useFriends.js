'use client'

import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/context/UserContext';

export const useFriends = () => {
  const { currentUser, refreshUser } = useContext(UserContext);
  const [friends, setFriends] = useState([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');

  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchFriends = async () => {
      try {
        const res = await fetch(`/api/friends/${currentUser._id}`);
        if (res.ok) {
          const data = await res.json();
          setFriends(data);
        }
      } catch (err) {
        console.error('Failed to fetch friends:', err);
      }
    };

    fetchFriends();
  }, [currentUser]);

  const addFriend = async () => {
    if (!newFriendName.trim() || !currentUser?._id) return;

    try {
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser._id,
          friendUsername: newFriendName,
        }),
      });

      if (res.ok) {
        setNewFriendName('');
        setShowAddFriend(false);
        const updatedRes = await fetch(`/api/friends/${currentUser._id}`);
        setFriends(await updatedRes.json());
        refreshUser();
      }
    } catch (err) {
      console.error('Failed to add friend:', err);
    }
  };

  const removeFriend = async (friendId) => {
    if (!currentUser?._id) return;

    try {
      const res = await fetch(`/api/friends/${currentUser._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId }),
      });

      if (res.ok) {
        const updatedRes = await fetch(`/api/friends/${currentUser._id}`);
        setFriends(await updatedRes.json());
        refreshUser()
      }
    } catch (err) {
      console.error('Failed to remove friend:', err);
    }
  };

  return {
    friends,
    showAddFriend,
    setShowAddFriend,
    newFriendName,
    setNewFriendName,
    addFriend,
    removeFriend,
  };
};