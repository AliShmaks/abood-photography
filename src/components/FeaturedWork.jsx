import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Reveal from "./Reveal";
import { usePortfolio } from "../hooks/usePortfolio";

export default function FeaturedWork() {
  const navigate = useNavigate();
  const { featured, photos, loading } = usePortfolio();
  const items = (featured.length ? featured : photos).slice(0, 4);

  return (
    <section className="section">
      <div className="container">
        <div className="intro-grid">
          <Reveal>
            <span className="eyebrow">Selected work</span>
            <h2 className="title-xl">Moments with meaning.</h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="lead">
              A selection of weddings, portraits, celebrations and commercial
              stories photographed across Jordan.
            </p>
            <button
              className="btn btn-outline"
              onClick={() => navigate("/portfolio")}
              type="button"
            >
              View full portfolio <ArrowUpRight size={17} />
            </button>
          </Reveal>
        </div>

        {loading && <p className="cms-loading">Loading portfolio…</p>}

        <div className="featured-grid">
          {items.map((item, i) => (
            <motion.article
              className="work-card"
              key={item.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: .12 }}
              transition={{ duration: .75, delay: i * .07 }}
              onClick={() => navigate("/portfolio")}
            >
              <img
                src={item.image}
                alt={item.altText || item.title}
                loading="lazy"
              />
              <div className="work-card-overlay">
                <div>
                  <h3>{item.title}</h3>
                  <p>
                    {item.category}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>
                </div>
                <ArrowUpRight size={20} />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
