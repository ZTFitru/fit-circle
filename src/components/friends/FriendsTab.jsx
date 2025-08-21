'use client'
import React from 'react';
import { UserPlus } from 'lucide-react';
import FriendCard from './FriendCard';
import AddFriendForm from './AddFriendForm';

const FriendsTab = ({ 
  friends, 
  showAddFriend, 
  setShowAddFriend, 
  newFriendName, 
  setNewFriendName, 
  addFriend,
  removeFriend
}) => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={() => setShowAddFriend(true)}
        className="bg-green-600 text-black p-2 rounded-lg"
        aria-label="Add a friend"
      >
        <UserPlus size={16} />
      </button>
    </div>

    <AddFriendForm
      showAddFriend={showAddFriend}
      setShowAddFriend={setShowAddFriend}
      newFriendName={newFriendName}
      setNewFriendName={setNewFriendName}
      addFriend={addFriend}
    />

    <div className="space-y-3">
      {friends.map(friend => (
        <FriendCard key={friend._id} friend={friend} onRemove={removeFriend} />
      ))}
    </div>
  </div>
);

export default FriendsTab;