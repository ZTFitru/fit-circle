'use client'
import React from 'react';
import { TrendingUp } from 'lucide-react';

const FriendCard = ({ friend, onRemove }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{friend.avatar}</div>
        <div>
          <h3 className="font-medium text-black">{friend.username}</h3>
          <p className="text-sm text-gray-500">
            {friend.totalWeight.toLocaleString()} lbs • {friend.bestRun}
          </p>
        </div>
      </div>
      <button
        onClick={()=> onRemove(friend._id)}
        className='text-red-500 hover:text-red700'
      >
        Remove
      </button>
      <TrendingUp className="text-blue-500" size={20} />
    </div>
  </div>
);

export default FriendCard;