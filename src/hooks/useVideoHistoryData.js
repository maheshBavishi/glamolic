"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import toast from "react-hot-toast";

export const useVideoHistoryData = (user, page = 1, itemsPerPage = 5) => {
  const [videoHistory, setVideoHistory] = useState([]);
  const [totalVideoCount, setTotalVideoCount] = useState(0);
  const [loadingVideoHistory, setLoadingVideoHistory] = useState(true);
  const [realtimeConnected, setRealtimeConnected] = useState(false);

  const fetchVideoHistory = async () => {
    if (!user) return;

    try {
      setLoadingVideoHistory(true);
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { count, error: countError } = await supabase
        .from("generated_videos")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (countError) {
        console.error("Error fetching video count:", countError);
      } else {
        setTotalVideoCount(count || 0);
      }

      const { data, error } = await supabase
        .from("generated_videos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Error fetching video history:", error);
      } else {
        const parsedData = (data || []).map((item) => ({
          ...item,
          settings: typeof item.settings === "string" ? JSON.parse(item.settings) : item.settings || {},
        }));
        setVideoHistory(parsedData);
      }
    } catch (error) {
      console.error("Error in fetchVideoHistory:", error);
    } finally {
      setLoadingVideoHistory(false);
    }
  };

  useEffect(() => {
    fetchVideoHistory();

    if (!user) return;

    const channel = supabase
      .channel(`generated_videos_changes_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "generated_videos",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newItem = payload.new;
            if (typeof newItem.settings === "string") {
              newItem.settings = JSON.parse(newItem.settings);
            } else if (!newItem.settings) {
              newItem.settings = {};
            }

            setVideoHistory((prev) => {
              const exists = prev.some((item) => item.id === newItem.id);
              if (exists) return prev;
              return [newItem, ...prev];
            });
            setTotalVideoCount((prev) => prev + 1);

            if (newItem.status === "processing") {
              toast.info("Video generation started", {
                description: "Your video is being generated.",
              });
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedItem = payload.new;
            if (typeof updatedItem.settings === "string") {
              updatedItem.settings = JSON.parse(updatedItem.settings);
            } else if (!updatedItem.settings) {
              updatedItem.settings = {};
            }
            setVideoHistory((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));

            if (updatedItem.status === "completed") {
              toast.success("Video generation completed!", {
                description: "Your video is ready to view.",
              });
            } else if (updatedItem.status === "failed") {
              toast.error("Video generation failed", {
                description: updatedItem.error_message || "Unknown error occurred.",
              });
            }
          } else if (payload.eventType === "DELETE") {
            setVideoHistory((prev) => prev.filter((item) => item.id !== payload.old.id));
            setTotalVideoCount((prev) => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setRealtimeConnected(true);
        } else {
          setRealtimeConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, page, itemsPerPage]);

  return {
    videoHistory,
    totalVideoCount,
    loadingVideoHistory,
    realtimeConnected,
    fetchVideoHistory,
  };
};
