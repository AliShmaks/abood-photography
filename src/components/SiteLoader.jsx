import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "../data/siteData";

export default function SiteLoader({ onFinished }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 1450);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        onFinished?.();
      }}
    >
      {visible && (
        <motion.div
          className="site-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.45,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="site-loader-inner"
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            <span className="site-loader-kicker">
              Photography · Jordan
            </span>

            <div className="site-loader-brand">
              {site.shortName}
            </div>

            <div className="site-loader-line">
              <motion.span
                initial={{
                  scaleX: 0,
                }}
                animate={{
                  scaleX: 1,
                }}
                transition={{
                  duration: 1.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>

            <span className="site-loader-sub">
              Stories remembered in light.
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}