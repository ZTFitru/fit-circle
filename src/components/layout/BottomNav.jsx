import React from 'react';
import { Dumbbell, Calendar, Users, Trophy } from 'lucide-react';
import TabButton from '../common/TabButton';

const BottomNav = ({ activeTab, setActiveTab }) => (
  <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 flex justify-around p-2">
    <TabButton
      id="workout"
      icon={<Dumbbell size={20} />}
      label="Workout"
      active={activeTab === 'workout'}
      onClick={() => setActiveTab('workout')}
    />
    <TabButton
      id="plan"
      icon={<Calendar size={20} />}
      label="Plan"
      active={activeTab === 'plan'}
      onClick={() => setActiveTab('plan')}
    />
    <TabButton
      id="friends"
      icon={<Users size={20} />}
      label="Friends"
      active={activeTab === 'friends'}
      onClick={() => setActiveTab('friends')}
    />
    <TabButton
      id="leaderboard"
      icon={<Trophy size={20} />}
      label="Rankings"
      active={activeTab === 'leaderboard'}
      onClick={() => setActiveTab('leaderboard')}
    />
  </div>
);

export default BottomNav;