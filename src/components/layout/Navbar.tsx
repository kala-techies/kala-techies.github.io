import { profile } from "../../data/profile";

function scrollToFraction(fraction: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: max * fraction, behavior: "smooth" });
}

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => scrollToFraction(0)}
          className="font-mono text-sm font-medium tracking-wide text-ink/80 transition-colors hover:text-ink"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}
        >
          {profile.name}
        </button>
        <button
          type="button"
          onClick={() => scrollToFraction(0.95)}
          className="font-mono text-xs tracking-widest text-ink/70 uppercase transition-colors hover:text-cyan"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}
        >
          Connect
        </button>
      </nav>
    </header>
  );
}
