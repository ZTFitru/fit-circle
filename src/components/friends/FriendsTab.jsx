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
  removeFriend,
  requests,
  acceptRequest,
  rejectRequest,
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
      {requests.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-600">Pending Requests</h3>
          {requests.map(req => (
            <div key={req._id} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
              <span className="text-black">{req.from?.username || "Unknown"}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => acceptRequest(req._id)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectRequest(req._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {friends.map(friend => (
        <FriendCard key={friend._id} friend={friend} onRemove={removeFriend} />
      ))}
    </div>
  </div>
);

export default FriendsTab;