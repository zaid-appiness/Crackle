"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaLock } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";

export default function UnauthorizedAccess() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gray-900/50 p-8 rounded-xl text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto"
        >
          <FaLock className="text-3xl text-red-500" />
        </motion.div>

        <h1 className="text-2xl font-bold text-white">Unauthorized Access</h1>

        <p className="text-gray-400">
          You cannot access this page while logged in. Please log out first if
          you want to access this page.
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>

          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
          >
            Logout
          </button>

          <button
            onClick={() => router.push("/home")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
