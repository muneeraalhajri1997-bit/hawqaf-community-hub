import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Globe } from "lucide-react";

const NAV = [
  { to: "/", label: "الرئيسية" },
  { to: "/programs", label: "البرامج" },
  { to: "/news", label: "الأخبار" },
  { to: "/transparency", label: "الشفافية" },
  { to: "/board", label: "مجلس الإدارة" },
  { to: "/assembly", label: "الجمعية العمومية" },
  { to: "/volunteer", label: "التطوع" },
  { to: "/careers", label: "التوظيف" },
  { to: "/statistics", label: "المؤشرات" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"AR" | "EN">("AR");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "glass-nav" : "bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0" aria-label="جمعية الأوقاف الصحية">
          <img src="/logo-full.png" alt="جمعية الأوقاف الصحية" className="hidden md:block w-auto" style={{ height: "48px" }} />
          <img src="/logo-full.png" alt="جمعية الأوقاف الصحية" className="block md:hidden w-auto" style={{ height: "40px" }} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-light-bg hover:text-primary"
              activeProps={{ className: "rounded-md px-3 py-2 text-sm font-bold text-primary bg-light-bg" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang((l) => (l === "AR" ? "EN" : "AR"))}
            className="hidden items-center gap-1 rounded-md border border-border px-2 py-1.5 text-xs font-semibold text-primary hover:bg-light-bg md:flex"
            aria-label="Toggle language"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang}
          </button>
          <Link
            to="/contact"
            className="hidden rounded-lg border-2 border-primary px-4 py-2 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-white md:inline-flex"
          >
            تواصل معنا
          </Link>
          <a
            href="https://store.hawqaf.org.sa/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-lg bg-gradient-brand px-4 py-2 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.03] md:inline-flex"
          >
            منصة التبرعات
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-primary xl:hidden"
            aria-label="القائمة"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-border bg-white xl:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-right text-sm font-medium text-foreground/80 hover:bg-light-bg hover:text-primary"
                activeProps={{ className: "rounded-md px-3 py-2.5 text-right text-sm font-bold text-primary bg-light-bg" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <a
                href="https://store.hawqaf.org.sa/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-gradient-brand px-4 py-2.5 text-center text-sm font-bold text-white"
              >
                منصة التبرعات
              </a>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="rounded-lg border-2 border-primary px-4 py-2 text-center text-sm font-bold text-primary"
              >
                تواصل معنا
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
