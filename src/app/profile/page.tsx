"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { FaMoon, FaBell, FaEdit } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/types/userProfile";
import { tabs } from "@/utils/tabs";

interface TabProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab = ({ icon: Icon, label, isActive, onClick }: TabProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
      isActive
        ? "bg-blue-600 text-white"
        : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
    }`}
  >
    <Icon />
    {label}
  </button>
);

interface StatCardProps {
  value: number;
  label: string;
  color: string;
}

const StatCard = ({ value, label, color }: StatCardProps) => (
  <div className="bg-gray-700/30 rounded-lg p-3 text-center">
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-sm text-gray-400">{label}</div>
  </div>
);

interface ToggleProps {
  icon: React.ElementType;
  label: string;
  value: boolean;
  onChange: () => void;
}

const Toggle = ({ icon: Icon, label, value, onChange }: ToggleProps) => (
  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
    <div className="flex items-center gap-3">
      <Icon className="text-blue-400" />
      <span>{label}</span>
    </div>
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-colors ${
        value ? "bg-blue-600" : "bg-gray-600"
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white transition-transform ${
          value ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState("activity");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }

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

  if (!profile) {
    return <ProfileSkeleton />;
  }

  const stats = [
    {
      value: profile.watchHistory.length,
      label: "Watched",
      color: "text-blue-400",
    },
    {
      value: profile.watchlist.length,
      label: "Watchlist",
      color: "text-pink-400",
    },
    {
      value: profile.ratings.length,
      label: "Ratings",
      color: "text-yellow-400",
    },
  ];

  const toggles = [
    {
      icon: FaMoon,
      label: "Dark Mode",
      value: profile.darkMode,
      onChange: () =>
        setProfile((prev) =>
          prev ? { ...prev, darkMode: !prev.darkMode } : null
        ),
    },
    {
      icon: FaBell,
      label: "Email Notifications",
      value: profile.emailNotifications,
      onChange: () =>
        setProfile((prev) =>
          prev
            ? { ...prev, emailNotifications: !prev.emailNotifications }
            : null
        ),
    },
  ];

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
                />
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <button
                    onClick={() => handleImageUpload("/path/to/new/image")}
                  >
                    <FaEdit className="text-gray-400 hover:text-white transition-colors" />
                  </button>
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
                {stats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex overflow-x-auto gap-4 pb-4">
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
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
                {toggles.map((toggle, index) => (
                  <Toggle key={index} {...toggle} />
                ))}
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
