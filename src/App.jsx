import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import SiteLoader from "./components/SiteLoader";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

export default function App() {
  const location = useLocation();

  const [loaderFinished, setLoaderFinished] = useState(false);

  return (
    <>
      <SiteLoader
        onFinished={() => {
          setLoaderFinished(true);
        }}
      />

      <ScrollToTop />

      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <Home startHeroAnimation={loaderFinished} />
              }
            />

            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </>
  );
}