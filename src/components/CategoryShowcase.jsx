import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Reveal from "./Reveal";
import { usePortfolio } from "../hooks/usePortfolio";

export default function CategoryShowcase() {
  const navigate = useNavigate();
  const { categories, photos } = usePortfolio();

  const items = categories.slice(0, 5).map((category, index) => {
    const categoryPhotos = photos.filter(
      (photo) =>
        photo.categoryId === category.id ||
        photo.category === category.name
    );

    const cover =
      categoryPhotos[0]?.image ||
      photos[index % Math.max(photos.length, 1)]?.image ||
      "/images/abood-hero-placeholder.jpg";

    return {
      ...category,
      cover,
      count: categoryPhotos.length,
    };
  });

  if (!items.length) return null;

  function handleCategoryClick(category) {
    navigate(
      `/portfolio?category=${encodeURIComponent(
        category.slug || category.name
      )}`
    );
  }

  return (
    <section className="section category-showcase">
      <div className="container">
        <div className="category-showcase-head">
          <Reveal>
            <span className="eyebrow">Explore the work</span>
            <h2 className="title-xl">
              Choose a <em>story.</em>
            </h2>
          </Reveal>

          <Reveal delay={.08}>
            <p className="lead category-showcase-copy">
              Weddings, portraits, celebrations and more — each collection has
              its own mood, people and story.
            </p>
          </Reveal>
        </div>

        <div className="category-cards">
          {items.map((item, index) => (
            <motion.button
              type="button"
              key={item.id}
              className="category-card"
              onClick={() => handleCategoryClick(item)}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: .12 }}
              transition={{ duration: .65, delay: index * .07 }}
            >
              <img
                src={item.cover}
                alt={`${item.name} photography`}
                loading="lazy"
              />

              <div className="category-card-shade" />

              <div className="category-card-top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <ArrowUpRight size={18} />
              </div>

              <div className="category-card-bottom">
                <h3>{item.name}</h3>
                <span>
                  {item.count > 0
                    ? `${item.count} ${item.count === 1 ? "image" : "images"}`
                    : "View collection"}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
