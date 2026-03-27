"use client";
import CookiePolicy from "@/components/cookiePolicy";
import { AuthProvider } from "@/context/AuthContext";

export default function ClientProviders({ children }) {
  return (
    <AuthProvider>
      {children}
      <CookiePolicy />
    </AuthProvider>
  );
}
