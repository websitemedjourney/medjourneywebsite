"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plane, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isDarkBanner =
    pathname === "/" || pathname.startsWith("/packages/");
  const isSolid = scrolled || !isDarkBanner;

  const textClass = isSolid ? "theme-text-primary" : "text-white";
  const linkHover = isSolid
    ? "hover:theme-text-accent"
    : "hover:text-[rgb(var(--accent-color))]";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isSolid
          ? "backdrop-blur-xl bg-white/90 shadow-sm"
          : "bg-gradient-to-b from-black/40 to-transparent"
      }`}
    >
      <div className="container-px flex h-16 sm:h-20 items-center justify-between">
        <Link
          href="/"
          className={`flex items-center gap-2 font-bold text-lg sm:text-xl ${textClass}`}
        >
          <span
            className="grid place-items-center w-10 h-10 rounded-full theme-gradient text-white shadow-md"
            aria-hidden
          >
            <Plane className="w-5 h-5 -rotate-45" />
          </span>
          <span>Med Journey</span>
        </Link>

        <nav
          className={`hidden md:flex items-center gap-8 text-sm font-medium ${textClass}`}
        >
          <Link href="/" className={`${linkHover} transition`}>
            Home
          </Link>
          <Link href="/packages" className={`${linkHover} transition`}>
            Packages
          </Link>
          <Link href="/contact" className={`${linkHover} transition`}>
            Contact
          </Link>
          <Link href="/#reviews" className={`${linkHover} transition`}>
            Reviews
          </Link>
          <a href="/#video" className={`${linkHover} transition`}>
            Watch
          </a>
          <a href="#book" className="btn-accent !py-2.5 !px-5 text-sm">
            Book Now
          </a>
        </nav>

        <button
          className={`md:hidden p-2 rounded-lg ${textClass}`}
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t shadow-lg">
          <nav className="container-px py-4 flex flex-col gap-3 text-sm font-medium theme-text-primary">
            <Link href="/" className="hover:theme-text-accent">
              Home
            </Link>
            <Link href="/packages" className="hover:theme-text-accent">
              Packages
            </Link>
            <Link href="/contact" className="hover:theme-text-accent">
              Contact
            </Link>
            <a href="/#reviews" className="hover:theme-text-accent">
              Reviews
            </a>
            <a href="/#video" className="hover:theme-text-accent">
              Watch
            </a>
            <a href="#book" className="btn-accent w-full">
              Book Now
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
