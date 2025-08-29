import React from "react";
import { Dumbbell, Calendar, Users, Trophy } from "lucide-react";
import TabButton from "../common/TabButton";
import { usePathname } from "next/navigation";

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 flex justify-around p-2">
      <TabButton
        href="/workouts"
        icon={<Dumbbell size={20} />}
        label="Workout"
        active={pathname === "/workouts"}
      />
      <TabButton
        href="/plan"
        icon={<Calendar size={20} />}
        label="Plan"
        active={pathname === "/plan"}
      />
      <TabButton
        href="/friends"
        icon={<Users size={20} />}
        label="Friends"
        active={pathname === "/friends"}
      />
      <TabButton
        href="/leaderboard"
        icon={<Trophy size={20} />}
        label="Rankings"
        active={pathname === "/leaderboard"}
      />
    </div>
  );
};

export default BottomNav;