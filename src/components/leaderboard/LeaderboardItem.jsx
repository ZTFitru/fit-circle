'use client'
import React from 'react';

const LeaderboardItem = ({ user, currentUser }) => {
  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-yellow-500';
      case 2: return 'bg-gray-400';
      case 3: return 'bg-orange-600';
      default: return 'bg-gray-500';
    }
  };

  const isCurrentUser = user.name === currentUser.name;

  return (
    <div className={`p-4 rounded-lg border ${
      isCurrentUser 
        ? 'bg-blue-50 border-blue-200' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getRankColor(user.rank)}`}>
            {user.rank}
          </div>
          <div className="text-2xl">{user.avatar}</div>
          <div>
            <h3 className={`font-medium ${isCurrentUser ? 'text-blue-700' : ''}`}>
              {user.name} {isCurrentUser && '(You)'}
            </h3>
            <p className="text-sm text-gray-500">{user.metric}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-lg">{user.value}</div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardItem;