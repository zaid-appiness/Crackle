"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaCog,
  FaHistory,
  FaHeart,
  FaStar,
  FaMoon,
  FaBell,
} from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import { UserProfile } from "@/types/userProfile";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState("activity");

  useEffect(() => {
    if (loading) {
      return; // Wait for auth to initialize
    }

    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}`);
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [user, router, loading]);

  if (loading || !profile) {
    return <ProfileSkeleton />;
  }

  const handleImageUpload = async (url: string) => {
    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url }),
      });
      if (response.ok) {
        setProfile((prev) => (prev ? { ...prev, image: url } : null));
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };

  const tabs = [
    { id: "activity", label: "Activity", icon: FaHistory },
    { id: "favorites", label: "Favorites", icon: FaHeart },
    { id: "ratings", label: "Ratings", icon: FaStar },
    { id: "settings", label: "Settings", icon: FaCog },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image */}
            <div className="relative">
              <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-500/20">
                <Image
                  src={profile.image || "/default-avatar.png"}
                  alt={profile.name || "Profile"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <ImageUpload onImageUpload={handleImageUpload} />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <h1 className="text-3xl font-bold text-white">
                  {profile.name || "User"}
                </h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <FaEdit />
                </button>
              </div>
              <p className="text-gray-400 mb-4">{profile.email}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-md">
                <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {profile.watchHistory.length}
                  </div>
                  <div className="text-sm text-gray-400">Watched</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-pink-400">
                    {profile.watchlist.length}
                  </div>
                  <div className="text-sm text-gray-400">Watchlist</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {profile.ratings.length}
                  </div>
                  <div className="text-sm text-gray-400">Ratings</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex overflow-x-auto gap-4 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8"
        >
          {activeTab === "settings" ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaMoon className="text-blue-400" />
                    <span>Dark Mode</span>
                  </div>
                  <button
                    onClick={() => {
                      setProfile((prev) =>
                        prev ? { ...prev, darkMode: !prev.darkMode } : null
                      );
                    }}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      profile.darkMode ? "bg-blue-600" : "bg-gray-600"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        profile.darkMode ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaBell className="text-blue-400" />
                    <span>Email Notifications</span>
                  </div>
                  <button
                    onClick={() => {
                      setProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              emailNotifications: !prev.emailNotifications,
                            }
                          : null
                      );
                    }}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      profile.emailNotifications ? "bg-blue-600" : "bg-gray-600"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        profile.emailNotifications
                          ? "translate-x-7"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              Coming soon...
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-gray-700 animate-pulse" />
            <div className="flex-1">
              <div className="h-8 w-48 bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-4 w-64 bg-gray-700/50 rounded animate-pulse mb-8" />
              <div className="grid grid-cols-3 gap-4 max-w-md">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-700/30 rounded-lg p-3 animate-pulse"
                  >
                    <div className="h-6 w-12 bg-gray-600 rounded mb-2 mx-auto" />
                    <div className="h-4 w-16 bg-gray-600 rounded mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
