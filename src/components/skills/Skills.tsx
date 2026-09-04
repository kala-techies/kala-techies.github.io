import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section } from "../Section";
import { skillCategories } from "../../data/profile";

export function Skills() {
  const [active, setActive] = useState(0);
  const category = skillCategories[active];

  return (
    <Section
      id="skills"
      eyebrow="Technical Skills"
      title="The stack I operate in"
      description="Grouped the way I actually work with it — pick a category to see what's inside."
      className="border-t border-border"
    >
      <div className="flex flex-wrap gap-2">
        {skillCategories.map((cat, i) => (
          <button
            key={cat.name}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              active === i
                ? "border-cyan bg-cyan/10 text-cyan"
                : "border-border text-ink-dim hover:border-border-hover hover:text-ink"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="mt-8 min-h-[140px] rounded-2xl border border-border bg-surface/50 p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-wrap gap-3"
          >
            {category.items.map((item) => (
              <span
                key={item}
                className="rounded-lg border border-border-hover bg-surface-raised px-3.5 py-2 font-mono text-sm text-ink-dim transition-colors hover:border-cyan hover:text-cyan"
              >
                {item}
              </span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
