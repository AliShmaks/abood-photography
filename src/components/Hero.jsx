import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { site } from "../data/siteData";

const ease = [0.22, 1, 0.36, 1];

export default function Hero({ startAnimation }) {
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "4%"]
  );

  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 24]
  );

  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.8],
    [1, 0.3]
  );

  const heroPhoto =
    "/images/8924afdfa73b4d14ae20cfe94efecbf0.png";

  return (
    <section ref={heroRef} className="hero-new">
      <div className="hero-new-image-wrap">
        <motion.div
          className="hero-new-image-motion"
          style={{ y: imageY }}
        >
          <motion.img
            src={heroPhoto}
            alt={`${site.name} photography`}
            initial={{ scale: 1.03 }}
            animate={{
              scale: startAnimation ? 1 : 1.03,
            }}
            transition={{
              duration: 1.6,
              ease,
            }}
          />
        </motion.div>
      </div>

      <div className="hero-new-overlay" />

      <div className="hero-new-container">
        <motion.div
          className="hero-new-meta"
          initial={{ opacity: 0, y: -10 }}
          animate={
            startAnimation
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: -10 }
          }
          transition={{
            duration: 0.7,
            ease,
          }}
        >
          <span>Photographer</span>
          <span>{site.location}</span>
        </motion.div>

        <motion.div
          className="hero-new-main"
          style={{
            y: contentY,
            opacity: contentOpacity,
          }}
        >
          <div className="hero-new-heading">
            <div className="hero-new-mask">
              <motion.h1
                initial={{ y: "110%" }}
                animate={{
                  y: startAnimation ? "0%" : "110%",
                }}
                transition={{
                  duration: 1,
                  ease,
                }}
              >
                Abood
              </motion.h1>
            </div>

            <div className="hero-new-mask hero-new-second-line">
              <motion.h2
                initial={{ y: "110%" }}
                animate={{
                  y: startAnimation ? "0%" : "110%",
                }}
                transition={{
                  delay: startAnimation ? 0.08 : 0,
                  duration: 1,
                  ease,
                }}
              >
                Al Husain
              </motion.h2>
            </div>
          </div>

          <motion.div
            className="hero-new-info"
            initial={{ opacity: 0, y: 18 }}
            animate={
              startAnimation
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 18 }
            }
            transition={{
              delay: startAnimation ? 0.35 : 0,
              duration: 0.8,
              ease,
            }}
          >
            <p>
              Capturing people, moments and stories
              through a cinematic perspective.
            </p>

            <Link to="/portfolio" className="hero-new-cta">
              <span>Explore portfolio</span>

              <span className="hero-new-cta-circle">
                <ArrowUpRight size={17} />
              </span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-new-footer"
          initial={{ opacity: 0 }}
          animate={{
            opacity: startAnimation ? 1 : 0,
          }}
          transition={{
            delay: startAnimation ? 0.55 : 0,
            duration: 0.8,
          }}
        >
          <span>Jordan</span>

          <div className="hero-new-footer-line" />

          <span>Selected Photography</span>
        </motion.div>
      </div>
    </section>
  );
}