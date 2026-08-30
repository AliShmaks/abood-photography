import { testimonials } from "../data/siteData";
import Reveal from "./Reveal";

export default function Testimonials() {
  return (
    <section className="section testimonials">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Kind words</span>
          <h2 className="title-lg">What it felt like.</h2>
        </Reveal>

        <div className="quote-grid">
          {testimonials.map((item, index) => (
            <Reveal key={index} delay={index * .08} className="quote-card">
              <p>“{item.quote}”</p>
              <small>{item.name}</small>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
