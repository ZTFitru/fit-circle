'use client'
import { useState, useEffect } from 'react';
import { LEADERBOARD_DATA } from '../data/constants';

export const useLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('totalWeight');

  useEffect(() => {
    // api call
    setTimeout(() => {
      setLeaderboardData(LEADERBOARD_DATA);
      setLoading(false);
    }, 500);
  }, []);

  const sortByMetric = (metric) => {
    setSelectedMetric(metric);
    // add api call to get sorted data
  };

  const refreshLeaderboard = async () => {
    setLoading(true);
    // api refreash
    setTimeout(() => {
      setLeaderboardData([...LEADERBOARD_DATA]);
      setLoading(false);
    }, 1000);
  };

  return {
    leaderboardData,
    loading,
    selectedMetric,
    sortByMetric,
    refreshLeaderboard
  };
};