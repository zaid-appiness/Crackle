"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import CookieConsent from "@/components/CookieConsent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    setHasConsent(!!consent);
  }, []);

  const handleCookieAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setHasConsent(true);
  };

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-background text-white min-h-screen`}
      >
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {!hasConsent && <CookieConsent onAccept={handleCookieAccept} />}
            <Navbar />
            <main className="container mx-auto px-4 py-8 min-h-screen">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
