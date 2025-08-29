'use client';
import React, { useContext, useState } from "react";
import Image from "next/image";
import { UserContext } from "@/context/UserContext";
import Header from "@/components/common/Header";
import BottomNav from "@/components/layout/BottomNav";

const ProfilePage = () => {
    const { currentUser, setCurrentUser } = useContext(UserContext)
    const [activeSection, setActiveSection] = useState(null)
    const [activeTab, setActiveTab] = useState('profile')

    const handleLogout = () => {
        setCurrentUser(null)
        localStorage.removeItem('fittracker_user')
        localStorage.removeItem('fittracker_token')
    }
    return (
        <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white">
            <Header currentUser={currentUser} onLogout={handleLogout} />
            <main className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col items-center justify-center bg-gray-100">
                    <div className="m-6">
                        <Image
                            src="/placeholder-profile.png"
                            alt="Profile Picture"
                            width={150}
                            height={150}
                            className="mx-auto rounded-full object-cover"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-green-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                    </div>
                    <h1 className="text-2xl font-semibold mb-8 text-black">Username Placeholder</h1>
                    <div className="flex flex-col space-y-4 w-full max-w-md">
                        <button
                            onClick={() => setActiveSection(activeSection === "badges" ? null : "badges")}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            Badges
                        </button>
                        {activeSection === "badges" && <BadgesSection />}

                        <button
                            onClick={() => setActiveSection(activeSection === "goals" ? null : "goals")}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            Goals
                        </button>
                        {activeSection === "goals" && <GoalsSection />}

                        <button
                            onClick={() => setActiveSection(activeSection === "history" ? null : "history")}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            Workout History
                        </button>
                        {activeSection === "history" && <WorkoutHistorySection />}
                    </div>
                </div>
            </main>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    )
}

export default ProfilePage;