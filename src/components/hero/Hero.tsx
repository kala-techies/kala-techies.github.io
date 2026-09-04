import { motion } from "framer-motion";
import { profile } from "../../data/profile";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden">
      <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-sm tracking-[0.3em] text-cyan uppercase">{profile.title}</p>
          <h1 className="mt-5 text-5xl font-semibold leading-tight text-ink sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-ink-dim">
            {profile.positioning}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#experience"
              className="rounded-full bg-cyan px-7 py-3 text-sm font-medium text-void transition-transform hover:scale-[1.03]"
            >
              Explore my work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-border-hover px-7 py-3 text-sm font-medium text-ink transition-colors hover:border-cyan hover:text-cyan"
            >
              Get in touch
            </a>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center">
        <div className="flex h-9 w-6 items-start justify-center rounded-full border border-border-hover p-1.5">
          <span className="h-1.5 w-1 animate-pulse-slow rounded-full bg-cyan" />
        </div>
      </div>
    </section>
  );
}
