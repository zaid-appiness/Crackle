"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import CookieConsent from "@/components/CookieConsent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    setHasConsent(!!consent);
    setIsLoading(false);
  }, []);

  const handleCookieAccept = () => {
    setHasConsent(true);
  };

  if (isLoading) {
    return (
      <html lang="en">
        <body
          className={`${inter.className} bg-background text-white min-h-screen`}
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-background text-white min-h-screen`}
      >
        <QueryClientProvider client={queryClient}>
          {!hasConsent && <CookieConsent onAccept={handleCookieAccept} />}
          {hasConsent ? (
            <>
              <Navbar />
              <main className="container mx-auto px-4 py-8 min-h-screen">
                {children}
              </main>
              <Footer />
            </>
          ) : (
            <div className="fixed inset-0 bg-background" />
          )}
        </QueryClientProvider>
      </body>
    </html>
  );
}
