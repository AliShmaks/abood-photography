import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { services } from "../data/siteData";
import Reveal from "./Reveal";

export default function ServicesPreview() {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <span className="eyebrow">What I photograph</span>
          <h2 className="title-lg">Made around your story.</h2>
        </Reveal>

        <div className="services-list">
          {services.map((service, index) => (
            <motion.div
              className="service-row"
              key={service.title}
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: .4 }}
              transition={{ duration: .55, delay: index * .05 }}
            >
              <span className="num">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ArrowUpRight size={19} />
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: 35 }}>
          <Link className="text-link" to="/services">
            Explore services <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
