'use client';
import React, { useContext, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import Image from 'next/image';
import { availableBadges } from '@/data/badges';

const BadgesSection = () => {
  const { currentUser } = useContext(UserContext);
  const [flippedBadges, setFlippedBadges] = useState(new Set());

  const toggleBadgeFlip = (badgeId) => {
    setFlippedBadges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(badgeId)) {
        newSet.delete(badgeId);
      } else {
        newSet.add(badgeId);
      }
      return newSet;
    });
  };

  if (!currentUser) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm border p-4 text-center">
        <div className="text-gray-500">No badge information available.</div>
      </div>
    );
  }

  const userBadgesMap = (currentUser.badges || []).reduce((map, badge) => {
    map[badge.id] = badge;
    return map;
  }, {});

  const badgesWithStatus = availableBadges.map((badge) => {
    const userBadge = userBadgesMap[badge.id];
    
    const conditionMet = badge.condition({
      totalWorkouts: currentUser.totalWorkouts || 0,
      totalWeight: currentUser.totalWeight || 0
    })

    const isEarned = (userBadge?.earned) || conditionMet;
    const progress = badge.type === "workouts"
      ? currentUser.totalWorkouts || 0
      : currentUser.totalWeight || 0;

    return {
      ...badge,
      earned: isEarned,
      earnedDate: isEarned ? (userBadge?.earnedDate || new Date().toISOString()) : null,
      progress: isEarned ? badge.target : progress,
    };
  });

  const earnedBadges = badgesWithStatus.filter((b) => b.earned);
  const inProgressBadges = badgesWithStatus.filter((b) => !b.earned);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Earned Badges ({earnedBadges.length})
        </h3>
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {earnedBadges.map((badge) => {
              const isFlipped = flippedBadges.has(badge.id);
              return (
                <div
                  key={badge.id}
                  className="bg-green-50 border-2 border-green-200 rounded-lg p-3 sm:p-4 text-center relative overflow-hidden flex flex-col justify-between"
                  style={{ minHeight: '180px' }}
                >
                  <div
                    className={`absolute inset-0 p-3 sm:p-4 flex flex-col items-center justify-center transition-all duration-500 transform ${
                      isFlipped ? 'opacity-0 rotate-y-180' : 'opacity-100 rotate-y-0'
                    }`}
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3 sm:mb-4 mx-auto">
                      <Image
                        src={badge.image || '/images/badges/first-workout.png'}
                        alt={badge.description || 'Badge'}
                        width={100}
                        height={100}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <button
                      onClick={() => toggleBadgeFlip(badge.id)}
                      className="bg-green-600 text-white px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm rounded-full font-medium hover:bg-green-700 transition-colors shadow-sm"
                    >
                      View Details
                    </button>
                  </div>
                  <div
                    className={`absolute inset-0 p-3 sm:p-4 flex flex-col items-center justify-center transition-all duration-500 transform ${
                      isFlipped ? 'opacity-100 rotate-y-0' : 'opacity-0 rotate-y-180'
                    }`}
                  >
                    <div className="text-center">
                      <h4 className="font-bold text-base sm:text-lg text-gray-800 mb-1 sm:mb-2">{badge.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{badge.description}</p>
                      {badge.earnedDate && (
                        <p className="text-xs sm:text-sm text-green-600 font-medium mb-3 sm:mb-4">
                          🎉 Earned: {new Date(badge.earnedDate).toLocaleDateString()}
                        </p>
                      )}
                      <button
                        onClick={() => toggleBadgeFlip(badge.id)}
                        className="bg-gray-600 text-white px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm rounded-full font-medium hover:bg-gray-700 transition-colors shadow-sm"
                      >
                        Badge
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No badges earned yet.</p>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          In Progress ({inProgressBadges.length})
        </h3>
        {inProgressBadges.length > 0 ? (
          <div className="space-y-3">
            {inProgressBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14">
                      <Image
                        src={badge.image || '/images/badges/first-workout.png'}
                        alt={badge.description || 'Badge'}
                        width={56}
                        height={56}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800">{badge.name}</h4>
                      <p className="text-xs text-gray-600">{badge.description}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {badge.progress}/{badge.target}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((badge.progress / badge.target) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.min(Math.round((badge.progress / badge.target) * 100), 100)}%
                  complete
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No badges in progress.</p>
        )}
      </div>
      {earnedBadges.length === 0 && inProgressBadges.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🏆</div>
          <p className="text-gray-500">
            No badges yet. Start working out to earn your first badge!
          </p>
        </div>
      )}
    </div>
  );
};

export default BadgesSection;