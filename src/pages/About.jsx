import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import CTA from "../components/CTA";
import PageTransition from "../components/PageTransition";
import Reveal from "../components/Reveal";
import { about, site } from "../data/siteData";

export default function About() {
  return (
    <PageTransition className="page-shell">
      <section className="page-hero">
        <div className="container page-hero-grid">
          <Reveal>
            <span className="eyebrow">{about.eyebrow}</span>
            <h1 className="display">
              Meet
              <br />
              <em>Abood.</em>
            </h1>
          </Reveal>
          <Reveal delay={.1}>
            <p className="lead">
              Photographer and visual storyteller based in {site.location},
              focused on people, emotion and atmosphere.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container about-main-grid">
          <Reveal>
            <div className="about-portrait">
              <img src={about.image} alt={`${site.name} photographer`} />
            </div>
          </Reveal>

          <div className="about-copy">
            <Reveal>
              <h2 className="title-lg">{about.title}</h2>
            </Reveal>

            {about.paragraphs.map((p, i) => (
              <Reveal key={p} delay={.08 * i}>
                <p>{p}</p>
              </Reveal>
            ))}

            <Reveal>
              <div className="stats">
                {about.stats.map(([value, label]) => (
                  <div className="stat" key={label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 40 }}>
                <Link to="/contact" className="btn">
                  Work with me <ArrowRight size={17} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTA />
    </PageTransition>
  );
}
