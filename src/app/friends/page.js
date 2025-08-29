'use client';
import React, { useContext } from "react";
import FriendsTab from "@/components/friends/FriendsTab";
import { useFriends } from "@/hooks/useFriends";
import { UserContext } from "@/context/UserContext";
import Header from "@/components/common/Header";
import BottomNav from "@/components/layout/BottomNav";

const FriendsPage = () => {
    const friendsHook = useFriends();
    const { currentUser, setCurrentUser } = useContext(UserContext)

    const handleLogout = () => {
        setCurrentUser(null)
        localStorage.removeItem('fittracker_user')
        localStorage.removeItem('fittracker_token')
    }

    return (
        <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white">
            <Header currentUser={currentUser} onLogout={handleLogout} />
            <main className="flex-1 overflow-y-auto p-4">
                <FriendsTab
                    friends={friendsHook.friends}
                    showAddFriend={friendsHook.showAddFriend}
                    setShowAddFriend={friendsHook.setShowAddFriend}
                    newFriendName={friendsHook.newFriendName}
                    setNewFriendName={friendsHook.setNewFriendName}
                    addFriend={friendsHook.addFriend}
                    removeFriend={friendsHook.removeFriend}
                    requests={friendsHook.requests}
                    acceptRequest={friendsHook.acceptRequest}
                    rejectRequest={friendsHook.rejectRequest}
                />
            </main>
            <BottomNav />
        </div>
    );
};

export default FriendsPage;