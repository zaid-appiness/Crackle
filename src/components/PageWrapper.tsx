"use client";

import { useEffect, useState } from "react";
import Footer from "./Footer";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if main content has rendered
    const mainContent = document.querySelector("main");
    if (mainContent && mainContent.children.length > 0) {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      {children}
      {!isLoading && <Footer />}
    </>
  );
}
