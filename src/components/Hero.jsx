import { motion } from "motion/react";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { site } from "../data/siteData";
import { usePortfolio } from "../hooks/usePortfolio";

export default function Hero() {
  const { featured, photos } = usePortfolio();

const heroPhoto = "/images/8924afdfa73b4d14ae20cfe94efecbf0.png";

  return (
    <section className="hero-pro">
      <div className="container hero-pro-grid">
        <div className="hero-pro-copy">
          <motion.div
            className="hero-pro-kicker"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .55 }}
          >
            <span>Photographer</span>
            <span className="hero-pro-dot" />
            <span>{site.location}</span>
          </motion.div>

          <motion.h1
            className="hero-pro-title"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .08, duration: .85, ease: [0.22, 1, 0.36, 1] }}
          >
            Stories,
            <br />
            <em>beautifully</em>
            <br />
            remembered.
          </motion.h1>

          <motion.p
            className="hero-pro-text"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .22, duration: .65 }}
          >
            {site.name} creates timeless wedding, portrait and event photography
            with a natural, elegant and cinematic approach.
          </motion.p>

          <motion.div
            className="hero-pro-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .34, duration: .6 }}
          >
            <Link className="btn" to="/portfolio">
              View portfolio <ArrowRight size={17} />
            </Link>
            <Link className="hero-pro-book" to="/contact">
              Book a session <ArrowDownRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            className="hero-pro-bottom"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .5, duration: .75 }}
          >
            <div>
              <span className="hero-pro-small-label">Based in</span>
              <strong>{site.location}</strong>
            </div>

            <div>
              <span className="hero-pro-small-label">Specializing in</span>
              <strong>People & celebrations</strong>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="hero-pro-media"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .1, duration: .95, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-pro-frame">
            <motion.img
              src={heroPhoto}
              alt={`${site.name} photography`}
              initial={{ scale: 1.045 }}
              animate={{ scale: 1 }}
              transition={{ delay: .15, duration: 1.45, ease: [0.22, 1, 0.36, 1] }}
            />

            <div className="hero-pro-number">01</div>
            <div className="hero-pro-caption">
              <strong>{site.name}</strong>
            </div>
          </div>

          <div className="hero-pro-accent">
            <span>Est.</span>
            <strong>Jordan</strong>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
