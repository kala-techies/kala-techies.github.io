import { useEffect, useState } from "react";
import { profile } from "../../data/profile";

const LINKS = [
  { href: "#experience", label: "Experience" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#recognition", label: "Recognition" },
  { href: "#independent-projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? "border-b border-border bg-void/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <a href="#top" className="font-mono text-sm font-medium tracking-wide text-ink">
          <span className="text-cyan">~/</span>{profile.fullName.toLowerCase().replace(/\s+/g, "-")}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-ink-dim transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={profile.resumeDocx}
          className="hidden rounded-full border border-border-hover px-4 py-2 text-sm text-ink transition-colors hover:border-cyan hover:text-cyan md:inline-block"
        >
          Resume
        </a>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle menu</span>
          <div className="relative h-3.5 w-4">
            <span className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`absolute left-0 top-1.5 h-px w-4 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-3 h-px w-4 bg-current transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-void px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-1 pt-4">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-3 text-ink-dim hover:bg-surface hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href={profile.resumeDocx}
                onClick={() => setOpen(false)}
                className="block rounded-md border border-border-hover px-2 py-3 text-center text-cyan"
              >
                Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
