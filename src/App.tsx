import { Navbar } from "./components/layout/Navbar";
import { ScrollEnvironment } from "./components/environment/ScrollEnvironment";

function App() {
  return (
    <div className="min-h-screen bg-void text-ink">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-cyan focus:px-4 focus:py-2 focus:text-void"
      >
        Skip to content
      </a>
      <div className="noise-overlay" />
      <Navbar />
      <ScrollEnvironment />
    </div>
  );
}

export default App;
