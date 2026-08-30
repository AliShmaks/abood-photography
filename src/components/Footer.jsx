import { Link } from "react-router-dom";
import { site } from "../data/siteData";

export default function Footer() {
  const whatsapp = `https://wa.me/${site.phoneRaw}?text=${encodeURIComponent(
    site.whatsappMessage
  )}`;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            {site.name}
            <br />
            Photography.
          </div>

          <div className="footer-col">
            <h4>Navigate</h4>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-col">
            <h4>Connect</h4>

            <a href={site.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>

            <a href={whatsapp} target="_blank" rel="noreferrer">
              WhatsApp
            </a>

            <a href={`mailto:${site.email}`}>Email</a>
          </div>
        </div>

        <div
          className="footer-bottom"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: "6px",
          }}
        >
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>

          <span>
            Coded by{" "}
            <a
              href="https://www.instagram.com/alishararah_/"
              target="_blank"
              rel="noreferrer"
              style={{
                background:
                  "linear-gradient(45deg, #f58529, #dd2a7b, #8134af, #515bd4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 600,
              }}
            >
              Ali Shararah
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}