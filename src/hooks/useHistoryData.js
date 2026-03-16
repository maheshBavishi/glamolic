"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const normalizeImageUrl = (value) => (typeof value === "string" ? value.trim() : "");

const collectImageUrls = (source) => {
  const urls = [];

  const pushUrl = (value) => {
    const normalized = normalizeImageUrl(value);
    if (normalized) {
      urls.push(normalized);
    }
  };

  const collectFromGroup = (group) => {
    if (!group) return;

    if (typeof group === "string") {
      pushUrl(group);
      return;
    }

    if (Array.isArray(group)) {
      group.forEach(collectFromGroup);
      return;
    }

    if (typeof group === "object") {
      if (Array.isArray(group.images)) {
        group.images.forEach(pushUrl);
      }
      if (Array.isArray(group.urls)) {
        group.urls.forEach(pushUrl);
      }
      if (typeof group.imageUrl === "string") {
        pushUrl(group.imageUrl);
      }
      if (typeof group.image_url === "string") {
        pushUrl(group.image_url);
      }
      if (typeof group.url === "string") {
        pushUrl(group.url);
      }
    }
  };

  collectFromGroup(source);
  return urls;
};

export const useHistoryData = (user, page = 1, itemsPerPage = 5) => {
  const [history, setHistory] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [realtimeConnected, setRealtimeConnected] = useState(false);

  useEffect(() => {
    if (!user) return;
    const cleanupOldHistory = async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: oldRows, error } = await supabase
        .from("generated_images")
        .select("id, image_urls")
        .eq("user_id", user.id)
        .lt("created_at", sevenDaysAgo.toISOString());

      if (error) {
        console.error("Failed to fetch old history:", error);
        return;
      }

      if (!oldRows || oldRows.length === 0) return;

      const filesToDelete = [];

      oldRows.forEach((row) => {
        const rowImageUrls = collectImageUrls(row.image_urls);
        rowImageUrls.forEach((url) => {
          try {
            const path = new URL(url).pathname.split("/").slice(-2).join("/");
            filesToDelete.push(path);
          } catch {}
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

    const imageUrls = collectImageUrls(item.image_urls);

    let productName = "Untitled Collection";
    if (settings.productName) {
      productName = settings.productName;
    } else if (productMetadata.itemType) {
      const gender = productMetadata.gender ? productMetadata.gender.charAt(0).toUpperCase() + productMetadata.gender.slice(1) : "";
      const subCategory = productMetadata.subCategory ? ` - ${productMetadata.subCategory}` : "";
      productName = `${gender} ${productMetadata.itemType}${subCategory}`.trim();
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
      products: Array.isArray(item.product_metadata) ? item.product_metadata.length : 1,
      totalImages: imageUrls.length,
      status: item.status || "completed",
      settings: {
        resolution: settings.resolution || "2K",
        imageSize: settings.imageSize || "12x18",
        backgroundType: settings.backgroundType || "Lifestyle",
        imagesPerProduct: settings.numberOfImages || 1,
        modelConsistency: settings.modelConsistency,
        sameBackground: settings.unifiedBackground,
      },
      thumbnails: imageUrls,
      product_metadata: item.product_metadata,
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
        .select("id, user_id, settings, product_metadata, created_at, status, image_urls")
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

    const channel = supabase
      .channel(`generated_images_changes_${user.id}`, {
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
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setRealtimeConnected(false);
        } else if (status === "CLOSED") {
          setRealtimeConnected(false);
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user, page, itemsPerPage]);

  return {
    history,
    totalCount,
    loadingHistory,
    realtimeConnected,
  };
};
