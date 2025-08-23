'use client'
import React from 'react';
import { Medal } from 'lucide-react';
import LeaderboardItem from './LeaderboardItem';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';

const LeaderboardTab = () => {
  const { leaderboardData, loading, period, setPeriod } = useLeaderboard();
  const { currentUser } = useContext(UserContext);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>

      <div className="flex gap-2 mb-4">
        {['daily', 'weekly', 'monthly'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 rounded ${period === p ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-lg text-white mb-4">
        <div className="flex items-center gap-3">
          <Medal size={24} />
          <div>
            <h3 className="font-bold text-black">Total Weight Lifted</h3>
            <p className="text-sm opacity-90 text-black">
              {period.charAt(0).toUpperCase() + period.slice(1)} rankings
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading leaderboard...</p>
      ) : (
        <div className="space-y-3">
          {leaderboardData.map((user) => (
            <LeaderboardItem
              key={user._id}
              user={user}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaderboardTab;