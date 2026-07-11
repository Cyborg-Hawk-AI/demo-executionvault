import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-vault-border bg-vault-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-semibold">
              Execution<span className="text-emerald-400">Vault</span>
            </p>
            <p className="mt-2 text-sm text-vault-muted">
              Visual dead-letter queue and execution inspector for no-code automation failures.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-white">Product</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/demo" className="text-sm text-vault-muted hover:text-emerald-400 transition-colors">
                  Live Demo
                </Link>
              </li>
              <li>
                <Link href="/developers" className="text-sm text-vault-muted hover:text-emerald-400 transition-colors">
                  Developer Docs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-white">Research</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/research" className="text-sm text-vault-muted hover:text-emerald-400 transition-colors">
                  How we found this idea
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-vault-border pt-8 sm:flex-row">
          <p className="text-xs text-vault-muted">
            © 2026 ExecutionVault. Built by Idea Miner.
          </p>
          <div className="flex gap-6">
            <Link href="/demo" className="text-xs text-vault-muted hover:text-white transition-colors">
              Demo
            </Link>
            <Link href="/developers" className="text-xs text-vault-muted hover:text-white transition-colors">
              Developers
            </Link>
            <Link href="/research" className="text-xs text-vault-muted hover:text-white transition-colors">
              How we found this idea
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
