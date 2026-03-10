"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
// Assumes you will bring these in from your old project or remove if not needed
import { supabase } from "@/integrations/supabase/client";
import { useGenerateStore } from "@/hooks/useGenerateStore";
import { useCreditsStore } from "@/hooks/useCreditsStore";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const resetStore = useGenerateStore?.()?.resetStore || (() => { });
  const resetCredits = useCreditsStore?.()?.resetCredits || (() => { });

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      return {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        tokens: data.tokens || 0,
        video_generation: data.video_generation || false,
      };
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id).then(setProfile);
        }, 0);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).then(setProfile);
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (email, password, fullName, phone) => {
    try {
      const redirectUrl = `${window.location.origin}/auth`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (error) return { error };

      return { error: null, data };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data: existingUser } = await supabase.from("users").select("status").eq("email", email).single();

      if (existingUser && existingUser.status === false) {
        return {
          error: new Error("Access has been removed from this account"),
        };
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error };
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) return { error };
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    resetStore();
    resetCredits();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error("No user logged in");

      const { error } = await supabase.from("users").update(updates).eq("id", user.id);

      if (error) throw error;

      await refreshProfile();
      return { error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { error };
    }
  };
  
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) return { error };
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) return { error };
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        refreshProfile,
        updateProfile,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
