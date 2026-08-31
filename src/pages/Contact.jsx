import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import Reveal from "../components/Reveal";
import { site } from "../data/siteData";
import { supabase } from "../lib/supabase";

export default function Contact() {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    message: "",
  });

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });

      if (error) {
        console.error("Could not load categories:", error);
        return;
      }

      setCategories(data || []);
    }

    loadCategories();
  }, []);

  const update = (e) =>
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));

  const submit = (e) => {
    e.preventDefault();

    const text = [
      `Hi Abood, I would like to ask about a photography booking.`,
      ``,
      `Name: ${form.name || "-"}`,
      `Phone: ${form.phone || "-"}`,
      `Photography type: ${form.service || "-"}`,
      `Preferred date: ${form.date || "-"}`,
      `Message: ${form.message || "-"}`,
    ].join("\n");

    window.open(
      `https://wa.me/${site.phoneRaw}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const whatsapp = `https://wa.me/${site.phoneRaw}?text=${encodeURIComponent(
    site.whatsappMessage
  )}`;

  return (
    <PageTransition className="page-shell">
      <section className="page-hero">
        <div className="container page-hero-grid">
          <Reveal>
            <span className="eyebrow">Bookings & enquiries</span>

            <h1 className="display">
              Tell me
              <br />
              <em>your story.</em>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="lead">
              Share the date, location and kind of photography you need.
              Abood can continue the conversation with you directly.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container contact-grid">
          <Reveal>
            <aside className="contact-info">
              <div className="contact-detail">
                <span>Phone / WhatsApp</span>

                <a href={whatsapp} target="_blank" rel="noreferrer">
                  {site.phoneDisplay}
                </a>
              </div>

              <div className="contact-detail">
                <span>Based in</span>
                <strong>{site.location}</strong>
              </div>

              <div className="contact-detail">
                <span>Email</span>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </div>

              <div className="contact-detail">
                <span>Instagram</span>

                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  {site.instagramHandle}
                </a>
              </div>
            </aside>
          </Reveal>

          <Reveal delay={0.1}>
            <form className="contact-form" onSubmit={submit}>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="name">Your name</label>

                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={update}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="phone">Your phone</label>

                  <input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={update}
                    placeholder="+962..."
                  />
                </div>

                <div className="field">
                  <label htmlFor="service">Photography type</label>

                  <select
                    id="service"
                    name="service"
                    value={form.service}
                    onChange={update}
                    required
                  >
                    <option value="">Choose photography type</option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.name}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="date">Preferred date</label>

                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={update}
                  />
                </div>

                <div className="field full">
                  <label htmlFor="message">
                    Tell me about the shoot
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={update}
                    placeholder="Location, ideas, number of guests, or anything you want Abood to know..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="btn" type="submit">
                  Send on WhatsApp <Send size={17} />
                </button>

              
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}