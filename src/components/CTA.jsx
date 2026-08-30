import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";

export default function CTA() {
  return (
    <section className="cta-section">
      <div className="container cta-inner">
        <Reveal>
          <span className="eyebrow">Let’s create something real</span>
          <h2 className="title-xl">
            Your story deserves more than ordinary photographs.
          </h2>
          <Link className="btn btn-light" to="/contact">
            Start a conversation <ArrowRight size={18} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
