'use client'
import React from 'react';
import { Medal } from 'lucide-react';
import LeaderboardItem from './LeaderboardItem';
import { LEADERBOARD_DATA } from '../../data/constants';
import { CURRENT_USER } from '../../data/mockData';

const LeaderboardTab = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
    
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-lg text-white mb-4">
      <div className="flex items-center gap-3">
        <Medal size={24} />
        <div>
          <h3 className="font-bold text-black">Total Weight Lifted</h3>
          <p className="text-sm opacity-90 text-black">All-time rankings</p>
        </div>
      </div>
    </div>

    <div className="space-y-3">
      {LEADERBOARD_DATA.map(user => (
        <LeaderboardItem 
          key={user.rank} 
          user={user} 
          currentUser={CURRENT_USER}
        />
      ))}
    </div>
  </div>
);

export default LeaderboardTab;