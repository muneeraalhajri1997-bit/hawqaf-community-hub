import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Globe, Mail, Phone, Twitter, Instagram, Youtube, ChevronDown } from "lucide-react";

type LeafItem = {
  label: string;
  to: string;
  hash?: string;
};

type NavItem = {
  label: string;
  to?: string;
  children?: LeafItem[];
};

const NAV: NavItem[] = [
  { label: "الرئيسية", to: "/" },
  {
    label: "عن الجمعية",
    children: [
      { label: "من نحن", to: "/", hash: "about" },
      { label: "شهادة التسجيل", to: "/transparency", hash: "licensing" },
      { label: "مجلس الإدارة", to: "/board" },
      { label: "الجمعية العمومية", to: "/assembly" },
    ],
  },
  { label: "البرامج والمبادرات", to: "/programs" },
  {
    label: "السياسات والحوكمة",
    children: [
      { label: "التأسيس والترخيص", to: "/transparency", hash: "licensing" },
      { label: "الحوكمة والهيكل التنظيمي", to: "/transparency", hash: "governance" },
      { label: "الشفافية المالية", to: "/transparency", hash: "finance" },
      { label: "الجمعية العمومية", to: "/transparency", hash: "assembly-docs" },
      { label: "السياسات والأنظمة", to: "/transparency", hash: "policies" },
      { label: "نماذج الإفصاح الرسمي", to: "/transparency", hash: "disclosure" },
    ],
  },
  {
    label: "المركز الإعلامي",
    children: [
      { label: "الأخبار", to: "/news" },
      { label: "ألبوم الصور", to: "/news", hash: "gallery" },
      { label: "التقارير السنوية", to: "/news", hash: "reports" },
    ],
  },
  {
    label: "انضم إلينا",
    children: [
      { label: "التطوع", to: "/volunteer" },
      { label: "التوظيف", to: "/careers" },
    ],
  },
  { label: "اتصل بنا", to: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"AR" | "EN">("AR");
  const [openDesktop, setOpenDesktop] = useState<string | null>(null);
  const [openMobile, setOpenMobile] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDesktop(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDesktop(null), 150);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "glass-nav shadow-md" : "bg-white"
      }`}
    >
      {/* Top bar */}
      <div className="hidden border-b border-border/70 bg-light-bg md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs text-foreground/70 lg:px-6">
          <div className="flex items-center gap-2">
            <a href="https://x.com/endowments_h" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="flex h-6 w-6 items-center justify-center rounded-full text-primary/70 transition-colors hover:bg-primary/10 hover:text-primary">
              <Twitter className="h-3.5 w-3.5" />
            </a>
            <a href="https://www.instagram.com/endowments_h" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-6 w-6 items-center justify-center rounded-full text-primary/70 transition-colors hover:bg-primary/10 hover:text-primary">
              <Instagram className="h-3.5 w-3.5" />
            </a>
            <a href="https://www.youtube.com/channel/UCWWX7ZBwwJAwXx05m4gd9EQ" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex h-6 w-6 items-center justify-center rounded-full text-primary/70 transition-colors hover:bg-primary/10 hover:text-primary">
              <Youtube className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href="mailto:info@hawqaf.org.sa" className="flex items-center gap-1.5 transition-colors hover:text-primary">
              <Mail className="h-3.5 w-3.5" />
              info@hawqaf.org.sa
            </a>
            <a href="tel:0138292840" className="flex items-center gap-1.5 transition-colors hover:text-primary">
              <Phone className="h-3.5 w-3.5" />
              013 829 2840
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0" aria-label="جمعية الأوقاف الصحية">
          <img src="/logo-full.png" alt="جمعية الأوقاف الصحية" className="hidden md:block w-auto" style={{ height: "48px" }} />
          <img src="/logo-full.png" alt="جمعية الأوقاف الصحية" className="block md:hidden w-auto" style={{ height: "40px" }} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">
          {NAV.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => openMenu(item.label)}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-light-bg hover:text-primary"
                  aria-expanded={openDesktop === item.label}
                >
                  {item.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openDesktop === item.label ? "rotate-180" : ""}`} />
                </button>

                {openDesktop === item.label && (
                  <div className="absolute right-0 top-full z-50 min-w-[230px] rounded-xl border border-border bg-white p-2 shadow-xl">
                    {item.children.map((child) => (
                      <Link
                        key={child.label + child.to}
                        to={child.to}
                        hash={child.hash}
                        onClick={() => setOpenDesktop(null)}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-light-bg hover:text-primary"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                to={item.to!}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-light-bg hover:text-primary"
                activeProps={{ className: "rounded-md px-3 py-2 text-sm font-bold text-primary bg-light-bg" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            )
          )}
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
        <div className="max-h-[80vh] overflow-y-auto border-t border-border bg-white xl:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label} className="border-b border-border/60 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setOpenMobile((v) => (v === item.label ? null : item.label))}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-right text-sm font-medium text-foreground/80 hover:bg-light-bg hover:text-primary"
                  >
                    {item.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${openMobile === item.label ? "rotate-180" : ""}`} />
                  </button>

                  {openMobile === item.label && (
                    <div className="flex flex-col gap-0.5 pb-2 pr-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label + child.to}
                          to={child.to}
                          hash={child.hash}
                          onClick={() => { setOpen(false); setOpenMobile(null); }}
                          className="rounded-md px-3 py-2 text-right text-sm text-foreground/70 hover:bg-light-bg hover:text-primary"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

              ) : (
                <Link
                  key={item.label}
                  to={item.to!}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-right text-sm font-medium text-foreground/80 hover:bg-light-bg hover:text-primary"
                  activeProps={{ className: "rounded-md px-3 py-2.5 text-right text-sm font-bold text-primary bg-light-bg" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              )
            )}

            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <a
                href="https://store.hawqaf.org.sa/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-gradient-brand px-4 py-2.5 text-center text-sm font-bold text-white"
              >
                منصة التبرعات
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
