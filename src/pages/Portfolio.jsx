import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CTA from "../components/CTA";
import PageTransition from "../components/PageTransition";
import Reveal from "../components/Reveal";
import { usePortfolio } from "../hooks/usePortfolio";

export default function Portfolio() {
  const { categories, photos, loading } = usePortfolio();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const [filter, setFilter] = useState(requestedCategory || "All");
  const [active, setActive] = useState(null);

  const visible =
    filter === "All"
      ? photos
      : photos.filter((item) => item.category === filter);

  useEffect(() => {
    document.body.classList.toggle("lightbox-open", Boolean(active));
    return () => document.body.classList.remove("lightbox-open");
  }, [active]);

  useEffect(() => {
    if (loading) return;

    if (!requestedCategory) {
      setFilter("All");
      return;
    }

    const matchedCategory = categories.find(
      (category) =>
        category.name.toLowerCase() === requestedCategory.toLowerCase() ||
        category.slug?.toLowerCase() === requestedCategory.toLowerCase()
    );

    if (matchedCategory) {
      setFilter(matchedCategory.name);
    } else {
      setFilter("All");
      setSearchParams({}, { replace: true });
    }
  }, [requestedCategory, categories, loading, setSearchParams]);


  function changeCategory(nextCategory) {
    setFilter(nextCategory);

    if (nextCategory === "All") {
      setSearchParams({});
    } else {
      const category = categories.find((item) => item.name === nextCategory);
      setSearchParams({ category: category?.slug || nextCategory });
    }
  }

  return (
    <PageTransition className="page-shell">
      <section className="page-hero">
        <div className="container page-hero-grid">
          <Reveal>
            <span className="eyebrow">Portfolio</span>
            <h1 className="display">
              Real moments.
              <br />
              <em>Beautifully kept.</em>
            </h1>
          </Reveal>
          <Reveal delay={.1}>
            <p className="lead">
              Browse Abood’s live photography collections. Categories and images
              on this page can be managed from the private admin dashboard.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-sm" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="filter-bar">
            <button
              className={`filter-btn ${filter === "All" ? "active" : ""}`}
              onClick={() => changeCategory("All")}
              type="button"
            >
              All
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                className={`filter-btn ${
                  filter === category.name ? "active" : ""
                }`}
                onClick={() => changeCategory(category.name)}
                type="button"
              >
                {category.name}
              </button>
            ))}
          </div>

          {loading && <p className="cms-loading">Loading photos…</p>}

          {!loading && visible.length === 0 && (
            <div className="empty-state">
              <h3>No photos in this category yet.</h3>
              <p>Abood can add images from the admin dashboard.</p>
            </div>
          )}

          <div className="portfolio-grid">
              {visible.map((item) => (
                <motion.article
                  key={item.id}
                  className="portfolio-card"
                  onClick={() => setActive(item)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: .2 }}
                >
                  <img
                    src={item.image}
                    alt={item.altText || item.title}
                    loading="lazy"
                  />
                  <div className="portfolio-meta">
                    <h3>{item.title}</h3>
                    <span>
                      {item.category}
                      {item.location ? ` · ${item.location}` : ""}
                    </span>
                  </div>
                </motion.article>
              ))}
          </div>
        </div>
      </section>

      <CTA />

      <AnimatePresence>
        {active && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <button
              className="lightbox-close"
              onClick={() => setActive(null)}
              type="button"
              aria-label="Close image"
            >
              <X size={21} />
            </button>

            <motion.img
              src={active.image}
              alt={active.altText || active.title}
              initial={{ scale: .94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: .45 }}
              onClick={(e) => e.stopPropagation()}
            />

            <div className="lightbox-caption">
              <h3>{active.title}</h3>
              <span>
                {active.category}
                {active.location ? ` · ${active.location}` : ""}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
