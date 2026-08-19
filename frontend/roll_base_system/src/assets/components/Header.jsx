export default function Header() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <a to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-bold text-white">
            RB
          </div>

          <span className="text-xl font-bold text-[var(--color-text-primary)]">
            RoleBase
          </span>
        </a>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <a
            href="/login"
            className="btn-secondary group text-[#67696e] hover:text-white p-4"
          >
            Login{" "}
          </a>

         <a href="/signup" className="btn-primary px-5 py-2">
              Get Started
            </a>
        </nav>
      </div>
    </header>
  );
}
