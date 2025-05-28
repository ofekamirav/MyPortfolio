import StickyPhone from "../components/StickyPhone";
import AboutSection from "./AboutSection";
import Projects from "./Projects";
import ContactSection from "../pages/Contact";

const Home = () => {
  return (
    <div>
      <section id="home" className="relative">
        <StickyPhone />
      </section>
      <AboutSection />
      <Projects />
      <ContactSection />
    </div>
  );
};

export default Home;
