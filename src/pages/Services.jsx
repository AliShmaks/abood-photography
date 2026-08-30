import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import CTA from "../components/CTA";
import PageTransition from "../components/PageTransition";
import Reveal from "../components/Reveal";
import { services } from "../data/siteData";

export default function Services() {
  return (
    <PageTransition className="page-shell">
      <section className="page-hero">
        <div className="container page-hero-grid">
          <Reveal>
            <span className="eyebrow">Services</span>
            <h1 className="display">
              Photography,
              <br />
              <em>made personal.</em>
            </h1>
          </Reveal>
          <Reveal delay={.1}>
            <p className="lead">
              Every shoot is approached differently. Choose a starting point,
              then we shape the experience around your story, location and
              vision.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container service-cards">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={(i % 2) * .07}>
              <article className="service-card">
                <div>
                  <div className="service-card-top">
                    <span className="num">{service.number}</span>
                    <ArrowUpRight size={22} />
                  </div>
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                </div>

                <ul>
                  {service.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
            <Link className="btn" to="/contact">
              Ask about availability
            </Link>
          </div>
        </Reveal>
      </section>

      <CTA />
    </PageTransition>
  );
}
