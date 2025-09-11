'use client';
import React, { useContext, useState, useRef } from "react";
import Image from "next/image";
import { UserContext } from "@/context/UserContext";
import Header from "@/components/common/Header";
import BottomNav from "@/components/layout/BottomNav";
import BadgesSection from "@/components/profile/BadgesSection"
import GoalsSection from "@/components/profile/GoalsSection"
import WorkoutHistorySection from "@/components/profile/WorkoutHistorySection"

const ProfilePage = () => {
    const { currentUser, setCurrentUser } = useContext(UserContext)
    const [activeSection, setActiveSection] = useState(null)
    const [activeTab, setActiveTab] = useState('profile')
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef(null)

    const handleLogout = () => {
        setCurrentUser(null)
        localStorage.removeItem('fittracker_user')
        localStorage.removeItem('fittracker_token')
    }

    const { refreshUser } = useContext(UserContext);
    
    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append('profileImage', file);

            const response = await fetch('/api/upload-profile-image', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (response.ok) {
                await refreshUser();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white">
            <Header currentUser={currentUser} onLogout={handleLogout} />
            <main className="flex-1 overflow-y-auto p-4 pb-24">
                <div className="flex flex-col items-center justify-center bg-gray-100">
                    <div className="m-6 relative">
                        <div className="relative">
                            <Image
                                src={currentUser?.profileImage || "/placeholder-profile.png"}
                                alt="Profile Picture"
                                width={150}
                                height={150}
                                className="mx-auto rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            {isUploading && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                    <div className="text-white text-sm">Uploading...</div>
                                </div>
                            )}
                            <button
                                onClick={triggerFileInput}
                                className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-2 shadow-lg hover:bg-green-700 transition-colors"
                                disabled={isUploading}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <p className="text-center text-sm text-gray-600 mt-2">
                            Click the camera icon to change photo
                        </p>
                    </div>
                    <div className="flex flex-col space-y-4 w-full max-w-md">
                        <button
                            onClick={() => setActiveSection(activeSection === "badges" ? null : "badges")}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            Badges
                        </button>
                        {activeSection === "badges" && <BadgesSection />}

                        {/* <button
                            onClick={() => setActiveSection(activeSection === "goals" ? null : "goals")}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            Goals
                        </button>
                        {activeSection === "goals" && <GoalsSection />} */}

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