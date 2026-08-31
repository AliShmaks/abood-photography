import { useCallback, useEffect, useMemo, useState } from "react";
import imageCompression from "browser-image-compression";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  LogOut,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function safeFilename(name) {
  const parts = name.split(".");
  const extension = parts.length > 1 ? parts.pop().toLowerCase() : "jpg";
  const base = parts.join(".") || "photo";

  return `${base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}.${extension}`;
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [categories, setCategories] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryOrder, setCategoryOrder] = useState(0);

  const [upload, setUpload] = useState({
    categoryId: "",
    title: "",
    location: "Jordan",
    altText: "",
    featured: false,
    displayOrder: 0,
    file: null,
  });

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === upload.categoryId),
    [categories, upload.categoryId]
  );

  const loadData = useCallback(async () => {
    const [categoryResult, photoResult] = await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true })
        .order("name", { ascending: true }),

      supabase
        .from("photos")
        .select("*, categories(name,slug)")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false }),
    ]);

    if (categoryResult.error || photoResult.error) {
      setMessage(
        categoryResult.error?.message ||
          photoResult.error?.message ||
          "Could not load dashboard data."
      );
      return;
    }

    setCategories(categoryResult.data || []);
    setPhotos(photoResult.data || []);

    if (!upload.categoryId && categoryResult.data?.length) {
      setUpload((current) => ({
        ...current,
        categoryId: categoryResult.data[0].id,
      }));
    }
  }, [upload.categoryId]);

  useEffect(() => {
    async function protect() {
      if (!isSupabaseConfigured) {
        navigate("/admin", { replace: true });
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("/admin", { replace: true });
        return;
      }

      const { data: isAdmin, error } = await supabase.rpc(
        "is_current_user_admin"
      );

      if (error || !isAdmin) {
        await supabase.auth.signOut();
        navigate("/admin", { replace: true });
        return;
      }

      await loadData();
      setChecking(false);
    }

    protect();
  }, [loadData, navigate]);

  async function addCategory(event) {
    event.preventDefault();

    const name = categoryName.trim();

    if (!name) return;

    setBusy(true);
    setMessage("");

    const { error } = await supabase.from("categories").insert({
      name,
      slug: slugify(name),
      display_order: Number(categoryOrder) || 0,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setCategoryName("");
      setCategoryOrder(0);
      setMessage("Category added.");
      await loadData();
    }

    setBusy(false);
  }

  async function editCategory(category) {
    const newName = window.prompt(
      "Enter the new category name:",
      category.name
    );

    if (newName === null) return;

    const trimmedName = newName.trim();

    if (!trimmedName) {
      setMessage("Category name cannot be empty.");
      return;
    }

    if (trimmedName === category.name) {
      return;
    }

    const newSlug = slugify(trimmedName);

    if (!newSlug) {
      setMessage("Please enter a valid category name.");
      return;
    }

    setBusy(true);
    setMessage("");

    const { error } = await supabase
      .from("categories")
      .update({
        name: trimmedName,
        slug: newSlug,
      })
      .eq("id", category.id);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(`Category renamed to "${trimmedName}".`);
      await loadData();
    }

    setBusy(false);
  }

  async function deleteCategory(category) {
    const hasPhotos = photos.some(
      (photo) => photo.category_id === category.id
    );

    if (hasPhotos) {
      setMessage(
        `Delete the photos inside "${category.name}" before deleting the category.`
      );
      return;
    }

    if (!window.confirm(`Delete category "${category.name}"?`)) return;

    setBusy(true);
    setMessage("");

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);

    setMessage(error ? error.message : "Category deleted.");

    await loadData();

    setBusy(false);
  }

  async function uploadPhoto(event) {
    event.preventDefault();
    setMessage("");

    if (!upload.file || !upload.categoryId || !selectedCategory) {
      setMessage("Choose a category and an image first.");
      return;
    }

    setBusy(true);

    try {
      const originalSize = upload.file.size;

      setMessage("Optimizing image…");

      const compressedFile = await imageCompression(upload.file, {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 2400,
        useWebWorker: true,
        fileType: "image/webp",
        initialQuality: 0.85,
      });

      const originalBaseName =
        upload.file.name.replace(/\.[^/.]+$/, "") || "photo";

      const fileName = `${crypto.randomUUID()}-${safeFilename(
        `${originalBaseName}.webp`
      )}`;

      const storagePath = `${selectedCategory.slug}/${fileName}`;

      setMessage("Uploading optimized image…");

      const { error: storageError } = await supabase.storage
        .from("portfolio")
        .upload(storagePath, compressedFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: "image/webp",
        });

      if (storageError) {
        setMessage(storageError.message);
        setBusy(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("portfolio")
        .getPublicUrl(storagePath);

      const { error: dbError } = await supabase.from("photos").insert({
        category_id: upload.categoryId,
        title: upload.title.trim() || selectedCategory.name,
        location: upload.location.trim(),
        alt_text:
          upload.altText.trim() ||
          `${
            upload.title.trim() || selectedCategory.name
          } photography by Abood Al Husain`,
        featured: Boolean(upload.featured),
        display_order: Number(upload.displayOrder) || 0,
        image_url: publicUrlData.publicUrl,
        storage_path: storagePath,
      });

      if (dbError) {
        await supabase.storage.from("portfolio").remove([storagePath]);

        setMessage(dbError.message);
        setBusy(false);
        return;
      }

      setUpload((current) => ({
        ...current,
        title: "",
        altText: "",
        featured: false,
        displayOrder: 0,
        file: null,
      }));

      const input = document.getElementById("admin-photo-file");

      if (input) {
        input.value = "";
      }

      const originalMB = (originalSize / 1024 / 1024).toFixed(1);
      const compressedMB = (
        compressedFile.size /
        1024 /
        1024
      ).toFixed(1);

      setMessage(
        `Photo uploaded successfully. ${originalMB} MB → ${compressedMB} MB`
      );

      await loadData();
    } catch (error) {
      console.error("Image compression/upload error:", error);

      setMessage(
        error?.message || "Could not optimize or upload the image."
      );
    }

    setBusy(false);
  }

  async function deletePhoto(photo) {
    if (!window.confirm(`Delete "${photo.title}"?`)) return;

    setBusy(true);
    setMessage("");

    if (photo.storage_path) {
      const { error: storageError } = await supabase.storage
        .from("portfolio")
        .remove([photo.storage_path]);

      if (storageError) {
        setMessage(storageError.message);
        setBusy(false);
        return;
      }
    }

    const { error } = await supabase
      .from("photos")
      .delete()
      .eq("id", photo.id);

    setMessage(error ? error.message : "Photo deleted.");

    await loadData();

    setBusy(false);
  }

  async function toggleFeatured(photo) {
    setBusy(true);
    setMessage("");

    const { error } = await supabase
      .from("photos")
      .update({
        featured: !photo.featured,
      })
      .eq("id", photo.id);

    setMessage(error ? error.message : "Photo updated.");

    await loadData();

    setBusy(false);
  }

  async function setAsCategoryCover(photo) {
    setBusy(true);
    setMessage("");

    const { error: resetError } = await supabase
      .from("photos")
      .update({
        display_order: 0,
      })
      .eq("category_id", photo.category_id)
      .lt("display_order", 0);

    if (resetError) {
      setMessage(resetError.message);
      setBusy(false);
      return;
    }

    const { error } = await supabase
      .from("photos")
      .update({
        display_order: -9999,
      })
      .eq("id", photo.id);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Category cover updated.");
      await loadData();
    }

    setBusy(false);
  }

  async function logout() {
    await supabase.auth.signOut();

    navigate("/admin", {
      replace: true,
    });
  }

  if (checking) {
    return (
      <PageTransition className="page-shell admin-page">
        <div className="container admin-checking">
          Checking admin access…
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="page-shell admin-page">
      <div className="container admin-dashboard">
        <div className="admin-topbar">
          <div>
            <span className="eyebrow">Supabase CMS</span>

            <h1 className="title-lg">Portfolio Manager</h1>

            <p className="lead">
              Create categories and upload Abood’s photos without editing
              code.
            </p>
          </div>

          <div className="admin-top-actions">
            <Link className="btn btn-outline" to="/portfolio">
              <ArrowLeft size={16} />
              View site
            </Link>

            <button
              className="btn btn-outline"
              type="button"
              onClick={logout}
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`admin-message ${
              /success|added|deleted|updated|renamed/i.test(message)
                ? "success"
                : ""
            }`}
          >
            {message}
          </div>
        )}

        <div className="admin-grid">
          <section className="admin-panel">
            <div className="admin-panel-title">
              <div>
                <span>01</span>
                <h2>Categories</h2>
              </div>

              <Plus size={20} />
            </div>

            <form className="admin-form" onSubmit={addCategory}>
              <label>
                Category name

                <input
                  value={categoryName}
                  onChange={(event) =>
                    setCategoryName(event.target.value)
                  }
                  placeholder="Weddings"
                  required
                />
              </label>

              <label>
                Display order

                <input
                  type="number"
                  value={categoryOrder}
                  onChange={(event) =>
                    setCategoryOrder(event.target.value)
                  }
                />
              </label>

              <button
                className="btn"
                disabled={busy}
                type="submit"
              >
                Add category
              </button>
            </form>

            <div className="admin-category-list">
              {categories.map((category) => (
                <div
                  className="admin-category-row"
                  key={category.id}
                >
                  <div>
                    <strong>{category.name}</strong>
                    <small>/{category.slug}</small>
                  </div>

                  <div className="admin-card-actions">
                    <button
                      className="icon-button"
                      type="button"
                      onClick={() => editCategory(category)}
                      aria-label={`Edit ${category.name}`}
                      title="Edit category"
                      disabled={busy}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className="icon-button danger"
                      type="button"
                      onClick={() => deleteCategory(category)}
                      aria-label={`Delete ${category.name}`}
                      title="Delete category"
                      disabled={busy}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-title">
              <div>
                <span>02</span>
                <h2>Upload photo</h2>
              </div>

              <ImagePlus size={20} />
            </div>

            <form className="admin-form" onSubmit={uploadPhoto}>
              <label>
                Category

                <select
                  value={upload.categoryId}
                  onChange={(event) =>
                    setUpload((current) => ({
                      ...current,
                      categoryId: event.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Choose category</option>

                  {categories.map((category) => (
                    <option
                      value={category.id}
                      key={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Image

                <input
                  id="admin-photo-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(event) =>
                    setUpload((current) => ({
                      ...current,
                      file: event.target.files?.[0] || null,
                    }))
                  }
                  required
                />
              </label>

              {upload.file && (
                <small>
                  Selected image:{" "}
                  {(upload.file.size / 1024 / 1024).toFixed(1)} MB
                  {" — "}
                  will be optimized automatically before upload.
                </small>
              )}

              <div className="admin-two-col">
                <label>
                  Title

                  <input
                    value={upload.title}
                    onChange={(event) =>
                      setUpload((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="A beautiful evening"
                  />
                </label>

                <label>
                  Location

                  <input
                    value={upload.location}
                    onChange={(event) =>
                      setUpload((current) => ({
                        ...current,
                        location: event.target.value,
                      }))
                    }
                    placeholder="Amman, Jordan"
                  />
                </label>
              </div>

              <label>
                Alt text

                <input
                  value={upload.altText}
                  onChange={(event) =>
                    setUpload((current) => ({
                      ...current,
                      altText: event.target.value,
                    }))
                  }
                  placeholder="Bride and groom at sunset"
                />
              </label>

              <div className="admin-two-col">
                <label>
                  Display order

                  <input
                    type="number"
                    value={upload.displayOrder}
                    onChange={(event) =>
                      setUpload((current) => ({
                        ...current,
                        displayOrder: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={upload.featured}
                    onChange={(event) =>
                      setUpload((current) => ({
                        ...current,
                        featured: event.target.checked,
                      }))
                    }
                  />

                  <span>
                    <Star size={15} />
                    Show on homepage
                  </span>
                </label>
              </div>

              <button
                className="btn"
                disabled={busy || categories.length === 0}
                type="submit"
              >
                {busy ? "Working…" : "Upload photo"}
              </button>
            </form>
          </section>
        </div>

        <section className="admin-panel admin-library">
          <div className="admin-panel-title">
            <div>
              <span>03</span>
              <h2>Photo library</h2>
            </div>

            <strong>{photos.length} images</strong>
          </div>

          {photos.length === 0 ? (
            <div className="empty-state">
              <h3>No uploaded images yet.</h3>

              <p>
                Create a category, then upload the first photo.
              </p>
            </div>
          ) : (
            <div className="admin-photo-grid">
              {photos.map((photo) => (
                <article
                  className="admin-photo-card"
                  key={photo.id}
                >
                  <div className="admin-photo-image">
                    <img
                      src={photo.image_url}
                      alt={photo.alt_text || photo.title}
                    />

                    {photo.featured && (
                      <span className="admin-featured-badge">
                        <Star
                          size={12}
                          fill="currentColor"
                        />
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="admin-photo-body">
                    <div>
                      <strong>{photo.title}</strong>

                      <small>
                        {photo.categories?.name || "Uncategorized"}

                        {photo.location
                          ? ` · ${photo.location}`
                          : ""}
                      </small>
                    </div>

                    <div className="admin-card-actions">
                      <button
                        className={`icon-button ${
                          photo.featured ? "active" : ""
                        }`}
                        type="button"
                        onClick={() => toggleFeatured(photo)}
                        title="Toggle homepage featured"
                      >
                        {photo.featured ? (
                          <Check size={16} />
                        ) : (
                          <Star size={16} />
                        )}
                      </button>

                      <button
                        className={`icon-button ${
                          photo.display_order < 0
                            ? "active"
                            : ""
                        }`}
                        type="button"
                        onClick={() => setAsCategoryCover(photo)}
                        title="Set as category cover"
                      >
                        <ImagePlus size={16} />
                      </button>

                      <button
                        className="icon-button danger"
                        type="button"
                        onClick={() => deletePhoto(photo)}
                        title="Delete photo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  );
}