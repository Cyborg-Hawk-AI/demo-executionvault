"use client";

import { useState } from "react";

interface DevNoteProps {
  title: string;
  children: React.ReactNode;
}

export function DevNote({ title, children }: DevNoteProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-400 ring-1 ring-amber-500/30 hover:bg-amber-500/30 transition-colors"
        aria-label={`DEV NOTE: ${title}`}
        title="DEV NOTE"
      >
        i
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-6 z-50 w-72 rounded-lg border border-amber-500/30 bg-vault-card p-3 shadow-xl shadow-black/40">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              DEV NOTE — {title}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-vault-muted">{children}</p>
          </div>
        </>
      )}
    </span>
  );
}
