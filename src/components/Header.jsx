import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { site } from "../data/siteData";

const links = [
  ["/", "Home"],
  ["/portfolio", "Portfolio"],
  ["/about", "About"],
  ["/services", "Services"],
  ["/contact", "Contact"],
];

export default function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  function scrollHomeToTop(to) {
    if (to === "/" && pathname === "/") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }

const headerClass = [
  "site-header",
  scrolled ? "scrolled" : "",
].join(" ");

  return (
    <>
      <header className={headerClass}>
        <div className="container nav">
          <NavLink
            to="/"
            className="brand"
            aria-label={`${site.name} home`}
            onClick={() => scrollHomeToTop("/")}
          >
            <strong>{site.name}</strong>
            <span>Photography · Jordan</span>
          </NavLink>

          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
                onClick={() => scrollHomeToTop(to)}
              >
                {label}
              </NavLink>
            ))}

            <NavLink to="/contact" className="nav-cta">
              Book a shoot
            </NavLink>
          </nav>

          <button
            className="menu-toggle"
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.nav
              className="container mobile-menu-inner"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.07,
                  },
                },
              }}
            >
              {links.map(([to, label]) => (
                <motion.div
                  key={to}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 30,
                    },
                    show: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                >
                  <NavLink
                    to={to}
                    end={to === "/"}
                    onClick={() => {
                      scrollHomeToTop(to);
                      setOpen(false);
                    }}
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}

              <small>
                {site.location} · {site.phoneDisplay}
              </small>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}