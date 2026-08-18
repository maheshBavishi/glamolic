"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useGalleryData = (activeTab = 'image') => {
  const [images, setImages] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const pageRef = useRef(0);
  const loadingRef = useRef(false);
  const PAGE_SIZE = 8;

  useEffect(() => {
    let query = supabase
      .from("gallery_images")
      .select("*", { count: "exact", head: true });

    if (activeTab === 'video') {
      query = query.eq('media_type', 'video');
    } else if (activeTab === 'image') {
      query = query.eq('media_type', 'image');
    }

    query.then(({ count }) => {
      setTotalCount(count || 0);
    });
  }, [activeTab]);

  const fetchPage = useCallback(async (page, tabToFetch) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    try {
      let query = supabase
        .from("gallery_images")
        .select("id, media_url, media_type, created_at");

      if (tabToFetch === 'video') {
        query = query.eq('media_type', 'video');
      } else if (tabToFetch === 'image') {
        query = query.eq('media_type', 'image');
      }

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("[useGalleryData] fetch error:", error);
        return;
      }

      if (!data || data.length === 0) {
        setHasMore(false);
        return;
      }

      const newImages = data.map((row) => ({
        id: row.id,
        url: row.media_url,
        type: row.media_type,
        createdAt: row.created_at,
      }));

      setImages((prev) => {
        const existingIds = new Set(prev.map((img) => img.id));
        const fresh = newImages.filter((img) => !existingIds.has(img.id));
        return [...prev, ...fresh];
      });

      setHasMore(data.length === PAGE_SIZE);
      pageRef.current = page + 1;
    } catch (e) {
      console.error("[useGalleryData] unexpected error:", e);
    } finally {
      loadingRef.current = false;
      setLoadingGallery(false);
    }
  }, []);

  useEffect(() => {
    setLoadingGallery(true);
    pageRef.current = 0;
    loadingRef.current = false;
    setImages([]);
    setHasMore(false);
    fetchPage(0, activeTab);
  }, [activeTab, fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingRef.current) return;
    fetchPage(pageRef.current, activeTab);
  }, [hasMore, fetchPage, activeTab]);

  return { images, loadingGallery, hasMore, loadMore, totalCount };
};
