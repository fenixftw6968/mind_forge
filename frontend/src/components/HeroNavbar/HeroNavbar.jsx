import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "#" },
  { label: "About Us", href: "#about" },
  { label: "Courses", href: "#courses" },
  { label: "Instructors", href: "#instructors" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Blog", href: "#blog" },
];

/** Standalone Navbar used only inside the Hero landing section */
export default function HeroNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white">
            <span className="h-3 w-3 rounded-full bg-white" />
          </span>
          <span className="text-sm font-medium text-white">DesignPro</span>
        </a>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 rounded-full border border-gray-700 px-2 py-1.5 lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-4 py-1.5 text-sm text-white/80 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="flex items-center gap-1 rounded-full px-4 py-1.5 text-sm text-white/80 transition-colors duration-200 hover:text-white"
          >
            Contact us
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="text-white/80 transition-colors hover:text-white lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="mx-6 flex flex-col gap-1 rounded-2xl border border-gray-700 bg-black/80 p-3 backdrop-blur lg:hidden">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-2 text-sm text-white/80 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm text-white/80 transition-colors hover:text-white"
          >
            Contact us <ArrowUpRight className="h-4 w-4" />
          </a>
        </nav>
      )}
    </header>
  );
}
