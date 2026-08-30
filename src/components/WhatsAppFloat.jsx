import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { site } from "../data/siteData";

export default function WhatsAppFloat() {
  const href = `https://wa.me/${site.phoneRaw}?text=${encodeURIComponent(
    site.whatsappMessage
  )}`;

  return (
    <motion.a
      className="whatsapp-float"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Contact Abood on WhatsApp"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle size={23} />
    </motion.a>
  );
}
