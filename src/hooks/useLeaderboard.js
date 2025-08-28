'use client'
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/context/UserContext';

export const useLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('daily');
  const { currentUser } = useContext(UserContext);

  const fetchLeaderboard = async (selectedPeriod = period) => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `/api/leaderboard?period=${selectedPeriod}`;
      if (currentUser?._id) {
        url += `&userId=${currentUser._id}`;
      }
      
      const res = await fetch(url);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.warn('Expected array but got:', typeof data, data);
        setLeaderboardData([]);
        return;
      }
      
      const ranked = data.map((u, idx) => ({
        rank: idx + 1,
        name: u.username,
        avatar: u.avatar,
        metric: 'Total Weight',
        value: u.totalWeight,
        _id: u._id,
      }));
      
      setLeaderboardData(ranked);
      
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setError(err.message);
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser !== undefined) { 
      fetchLeaderboard(period);
    }
  }, [period, currentUser]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  return {
    leaderboardData,
    loading,
    error,
    period,
    setPeriod: handlePeriodChange,
    refreshLeaderboard: () => fetchLeaderboard(period),
    currentUser,
  };
};