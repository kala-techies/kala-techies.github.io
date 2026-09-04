import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ScrollEnvironment } from "./components/environment/ScrollEnvironment";
import { Hero } from "./components/hero/Hero";
import { Experience } from "./components/experience/Experience";
import { Themes } from "./components/themes/Themes";
import { Recognition } from "./components/recognition/Recognition";
import { IndependentProjects } from "./components/projects/IndependentProjects";
import { GitHubSection } from "./components/github/GitHubSection";
import { Resume } from "./components/resume/Resume";
import { Contact } from "./components/contact/Contact";

function App() {
  return (
    <div className="min-h-screen bg-void text-ink">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-cyan focus:px-4 focus:py-2 focus:text-void"
      >
        Skip to content
      </a>
      <ScrollEnvironment />
      <div className="noise-overlay" />
      <Navbar />
      <main>
        <Hero />
        <Experience />
        <Themes />
        <Recognition />
        <IndependentProjects />
        <GitHubSection />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
