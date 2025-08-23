'use client'
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/context/UserContext';

export const useLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('daily');
  const { currentUser } = useContext(UserContext);

  const fetchLeaderboard = async (selectedPeriod = period) => {
    setLoading(true);
    try {
      let url = `/api/leaderboard?period=${selectedPeriod}`;
      if (currentUser?._id) {
        url += `&userId=${currentUser._id}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const ranked = data.map((u, idx) => ({
          rank: idx + 1,
          name: u.username,
          avatar: u.avatar,
          metric: 'Total Weight',
          value: u.totalWeight,
          _id: u._id,
        }));
        setLeaderboardData(ranked);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(period);
  }, [period, currentUser?._id]);

  return {
    leaderboardData,
    loading,
    period,
    setPeriod,
    refreshLeaderboard: () => fetchLeaderboard(period),
    currentUser,
  };
};