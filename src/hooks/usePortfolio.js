import { useCallback, useEffect, useMemo, useState } from "react";
import { portfolioItems as fallbackPhotos } from "../data/siteData";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

function fallbackCategoriesFromPhotos() {
  const names = [...new Set(fallbackPhotos.map((photo) => photo.category))];
  return names.map((name, index) => ({
    id: `fallback-${index}`,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    display_order: index,
    is_active: true,
  }));
}

export function usePortfolio() {
  const [categories, setCategories] = useState(() =>
    isSupabaseConfigured ? [] : fallbackCategoriesFromPhotos()
  );
  const [photos, setPhotos] = useState(() =>
    isSupabaseConfigured ? [] : fallbackPhotos
  );
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [usingFallback, setUsingFallback] = useState(!isSupabaseConfigured);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setCategories(fallbackCategoriesFromPhotos());
      setPhotos(fallbackPhotos);
      setUsingFallback(true);
      setLoading(false);
      return;
    }

    setLoading(true);

    const [categoryResult, photoResult] = await Promise.all([
      supabase
        .from("categories")
        .select("id,name,slug,display_order,is_active")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("name", { ascending: true }),
      supabase
        .from("photos")
        .select(`
          id,
          title,
          image_url,
          storage_path,
          location,
          alt_text,
          featured,
          display_order,
          category_id,
          categories ( id, name, slug )
        `)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false }),
    ]);

    if (categoryResult.error || photoResult.error) {
      console.warn(
        "Supabase portfolio could not load; using local fallback.",
        categoryResult.error || photoResult.error
      );
      setCategories(fallbackCategoriesFromPhotos());
      setPhotos(fallbackPhotos);
      setUsingFallback(true);
      setLoading(false);
      return;
    }

    const mappedPhotos = (photoResult.data || []).map((photo) => ({
      id: photo.id,
      title: photo.title || "Untitled",
      category: photo.categories?.name || "Portfolio",
      categoryId: photo.category_id,
      categorySlug: photo.categories?.slug || "",
      location: photo.location || "",
      image: photo.image_url,
      storagePath: photo.storage_path,
      altText: photo.alt_text || photo.title || "Photography portfolio image",
      featured: Boolean(photo.featured),
      displayOrder: photo.display_order ?? 0,
    }));

    setCategories(categoryResult.data || []);
    setPhotos(mappedPhotos);
    setUsingFallback(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const featured = useMemo(
    () => photos.filter((photo) => photo.featured),
    [photos]
  );

  return {
    categories,
    photos,
    featured,
    loading,
    usingFallback,
    refresh,
  };
}
