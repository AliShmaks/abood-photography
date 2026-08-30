import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import FeaturedWork from "../components/FeaturedWork";
import CategoryShowcase from "../components/CategoryShowcase";
import Reveal from "../components/Reveal";
import ServicesPreview from "../components/ServicesPreview";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import { about } from "../data/siteData";
import PageTransition from "../components/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <CategoryShowcase />

      <div id="selected-work">
        <FeaturedWork />
      </div>

      <section className="section about-home">
        <div className="container about-home-grid">
          <Reveal>
            <div className="about-home-image">
              <img src={about.image} alt="Photographer portrait placeholder" loading="lazy" />
            </div>
          </Reveal>

          <Reveal delay={.1}>
            <span className="eyebrow">{about.eyebrow}</span>
            <h2 className="title-lg">{about.title}</h2>
            <p className="lead">{about.paragraphs[0]}</p>
            <Link className="text-link" to="/about">
              Meet Abood <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <ServicesPreview />
      <Testimonials />
      <CTA />
    </PageTransition>
  );
}
