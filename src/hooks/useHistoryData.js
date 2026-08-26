"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { collectThumbnailUrls } from "@/utils/imageUrlUtils";

export const useHistoryData = (user, page = 1, itemsPerPage = 5) => {
  const [history, setHistory] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const reconnectTimerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  useEffect(() => {
    if (!user) return;
    const cleanupOldHistory = async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: oldRows, error } = await supabase
        .from("generated_images")
        .select("id, thumbnail_urls")
        .eq("user_id", user.id)
        .lt("created_at", sevenDaysAgo.toISOString());

      if (error) {
        console.error("Failed to fetch old history:", error);
        return;
      }

      if (!oldRows || oldRows.length === 0) return;

      const filesToDelete = [];

      oldRows.forEach((row) => {
        const rowThumbnailUrls = collectThumbnailUrls(row.thumbnail_urls);
        rowThumbnailUrls.forEach((url) => {
          try {
            const path = new URL(url).pathname.split("/").slice(-2).join("/");
            filesToDelete.push(path);
          } catch { }
        });
      });

      if (filesToDelete.length > 0) {
        await supabase.storage.from("generated-images").remove(filesToDelete);
      }

      const ids = oldRows.map((row) => row.id);
      await supabase
        .from("generated_images")
        .delete()
        .in("id", ids);
    };

    cleanupOldHistory();
  }, [user]);

  const processHistoryItem = (item) => {
    let settings = {};
    try {
      settings = typeof item.settings === "string" ? JSON.parse(item.settings) : item.settings || {};
    } catch (e) {
      console.error("Failed to parse settings:", e, item.settings);
      settings = {};
    }

    let productMetadata = {};
    try {
      productMetadata = typeof item.product_metadata === "string" ? JSON.parse(item.product_metadata) : item.product_metadata || {};
    } catch (e) {
      console.error("Failed to parse product_metadata:", e, item.product_metadata);
      productMetadata = {};
    }

    const normalizedProductMetadata = Array.isArray(productMetadata)
      ? productMetadata
      : productMetadata && typeof productMetadata === "object"
        ? [productMetadata]
        : [];
    const primaryProductMetadata = normalizedProductMetadata[0] || {};
    const imagesPerProduct = settings.imagesPerProduct || settings.numberOfImages || 1;
    const unifiedBackground = settings.unifiedBackground ?? settings.sameBackground ?? false;
    const additionalInstructions = Array.isArray(settings.additionalInstructions) ? settings.additionalInstructions : [];

    const thumbnailUrls = collectThumbnailUrls(item.thumbnail_urls);

    let productName = "Untitled Collection";
    if (settings.productName) {
      productName = settings.productName;
    } else if (primaryProductMetadata.itemType) {
      const gender = primaryProductMetadata.gender
        ? primaryProductMetadata.gender.charAt(0).toUpperCase() + primaryProductMetadata.gender.slice(1)
        : "";
      const subCategory = primaryProductMetadata.subCategory ? ` - ${primaryProductMetadata.subCategory}` : "";
      productName = `${gender} ${primaryProductMetadata.itemType}${subCategory}`.trim();
    }

    const historyItem = {
      id: item.id.toString(),
      date: new Date(item.created_at).toLocaleString(),
      category: "AI Photoshoot",
      productName: productName,
      description: Array.isArray(settings.additionalInstructions)
        ? settings.additionalInstructions
          .map((instr, idx) => instr ? `Image ${idx + 1}: ${instr}` : null)
          .filter(Boolean)
          .join("\n") || "No additional instructions provided."
        : settings.additionalInstructions || "No additional instructions provided.",
      prompt: item.prompt || "",
      products: normalizedProductMetadata.length || 1,
      totalImages: thumbnailUrls.length,
      status: item.status || "completed",
      settings: {
        productName: settings.productName || productName,
        resolution: settings.resolution || "2K",
        imageSize: settings.imageSize || "12x18",
        backgroundType: settings.backgroundType || "Lifestyle",
        imagesPerProduct: imagesPerProduct,
        numberOfImages: imagesPerProduct,
        modelConsistency: settings.modelConsistency,
        sameBackground: unifiedBackground,
        unifiedBackground: unifiedBackground,
        additionalInstructions: additionalInstructions,
        startingVariationIdx: settings.startingVariationIdx || 0,
        doubleimage: Boolean(settings.doubleimage),
      },
      thumbnails: thumbnailUrls,
      product_metadata: normalizedProductMetadata,
    };

    return historyItem;
  };

  const handleRealtimeInsert = (newRecord) => {
    try {
      const newHistoryItem = processHistoryItem(newRecord);
      setHistory((prevHistory) => {
        const exists = prevHistory.some((item) => item.id === newHistoryItem.id);
        if (exists) return prevHistory;
        return [newHistoryItem, ...prevHistory];
      });
    } catch (e) {
      console.error("Error processing real-time insert:", e);
    }
  };

  const handleRealtimeUpdate = (updatedRecord) => {
    try {
      const updatedHistoryItem = processHistoryItem(updatedRecord);
      setHistory((prevHistory) => {
        return prevHistory.map((item) => (item.id === updatedHistoryItem.id ? updatedHistoryItem : item));
      });
    } catch (e) {
      console.error("Error processing real-time update:", e);
    }
  };

  const handleRealtimeDelete = (deletedRecord) => {
    const deletedId = deletedRecord.id.toString();
    setHistory((prevHistory) => {
      return prevHistory.filter((item) => item.id !== deletedId);
    });
  };

  const fetchHistory = async () => {
    try {
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { count, error: countError } = await supabase
        .from("generated_images")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (countError) {
        console.error("Error fetching count:", countError);
      } else {
        setTotalCount(count || 0);
      }

      const { data, error } = await supabase
        .from("generated_images")
        .select("id, user_id, settings, product_metadata, created_at, status, thumbnail_urls")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Error fetching history:", error);
        setLoadingHistory(false);
        return;
      }

      if (!data || data.length === 0) {
        setHistory([]);
        setLoadingHistory(false);
        return;
      }

      const mapped = data.map((item) => {
        return processHistoryItem(item);
      });

      setHistory(mapped);
    } catch (e) {
      console.error("Error processing data:", e);
    }

    setLoadingHistory(false);
  };

  useEffect(() => {
    if (!user) return;
    setLoadingHistory(true);
    fetchHistory();

    let channel;

    const subscribeChannel = () => {
      channel = supabase
        .channel(`generated_images_changes_${user.id}_${Date.now()}`, {
          config: {
            broadcast: { self: true },
            presence: { key: user.id },
          },
        })
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "generated_images",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              handleRealtimeInsert(payload.new);
            } else if (payload.eventType === "UPDATE") {
              handleRealtimeUpdate(payload.new);
            } else if (payload.eventType === "DELETE") {
              handleRealtimeDelete(payload.old);
            }
          }
        )
        .subscribe((status, err) => {
          if (err) {
            console.error("Subscription error:", err);
          }
          if (status === "SUBSCRIBED") {
            setRealtimeConnected(true);
            reconnectAttemptsRef.current = 0;
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            setRealtimeConnected(false);
            if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
              const delay = Math.min(2000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
              reconnectAttemptsRef.current += 1;
              console.warn(`[Realtime] Connection lost. Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`);
              reconnectTimerRef.current = setTimeout(() => {
                channel?.unsubscribe();
                subscribeChannel();
                fetchHistory();
              }, delay);
            } else {
              console.error("[Realtime] Max reconnect attempts reached. Please refresh the page to see new images.");
            }
          } else if (status === "CLOSED") {
            setRealtimeConnected(false);
          }
        });
    };
    subscribeChannel();

    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      channel?.unsubscribe();
    };
  }, [user, page, itemsPerPage]);

  return {
    history,
    totalCount,
    loadingHistory,
    realtimeConnected,
  };
};
