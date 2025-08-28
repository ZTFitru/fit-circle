'use client'
import React from 'react';
import { Medal, AlertCircle, RefreshCw } from 'lucide-react';
import LeaderboardItem from './LeaderboardItem';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';

const LeaderboardTab = () => {
  const { leaderboardData, loading, error, period, setPeriod, refreshLeaderboard } = useLeaderboard();
  const { currentUser } = useContext(UserContext);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-black">Leaderboard</h2>

      <div className="flex gap-2 mb-4 text-black">
        {['daily', 'weekly', 'monthly'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 rounded ${
              period === p ? 'bg-green-200 text-black' : 'bg-gray-200'
            }`}
            disabled={loading}
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

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} />
            <div>
              <p className="font-semibold">Error loading leaderboard</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={refreshLeaderboard}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-red-600"
                disabled={loading}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <p className="mt-2">Loading leaderboard...</p>
        </div>
      ) : !error && leaderboardData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No leaderboard data available</p>
          <p className="text-sm">Complete some workouts to see rankings!</p>
        </div>
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