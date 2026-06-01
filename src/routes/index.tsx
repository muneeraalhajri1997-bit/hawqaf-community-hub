import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Activity, Stethoscope, Building2,
  TrendingUp, Users, Award, Calendar, Shield, ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "الرئيسية | جمعية الأوقاف الصحية" },
      { name: "description", content: "أول جمعية صحية وقفية في المملكة — مشاريع وقفية مستدامة للرعاية الصحية." },
    ],
  }),
  component: HomePage,
});

const SlideArtCare = () => (
  <svg viewBox="0 0 400 400" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="200" cy="210" r="150" fill="#DCEAF8" />
    <path d="M200 300s-95-58-95-128a58 58 0 0 1 95-44 58 58 0 0 1 95 44c0 70-95 128-95 128z" fill="#1E88E5"/>
    <path d="M135 205h28l14-26 20 50 16-34 12 20h42" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="320" cy="110" r="16" fill="#FFC857"/>
    <circle cx="85" cy="305" r="11" fill="#26A69A"/>
    <circle cx="320" cy="300" r="7" fill="#26A69A"/>
  </svg>
);

const SlideArtClinic = () => (
  <svg viewBox="0 0 400 400" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="200" cy="210" r="150" fill="#DCEAF8"/>
    <rect x="105" y="160" width="190" height="150" rx="12" fill="#1E88E5"/>
    <rect x="130" y="190" width="38" height="44" rx="3" fill="#DCEAF8"/>
    <rect x="181" y="190" width="38" height="44" rx="3" fill="#DCEAF8"/>
    <rect x="232" y="190" width="38" height="44" rx="3" fill="#DCEAF8"/>
    <rect x="181" y="252" width="38" height="58" fill="#fff"/>
    <rect x="165" y="100" width="60" height="60" rx="10" fill="#fff" stroke="#26A69A" strokeWidth="6"/>
    <path d="M195 115v30M180 130h30" stroke="#26A69A" strokeWidth="8" strokeLinecap="round"/>
    <circle cx="325" cy="125" r="14" fill="#FFC857"/>
    <circle cx="80" cy="290" r="10" fill="#26A69A"/>
  </svg>
);

const SlideArtVision = () => (
  <svg viewBox="0 0 400 400" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="200" cy="210" r="150" fill="#DCEAF8"/>
    <path d="M105 295h190l-38-120-52 72-32-42-68 90z" fill="#1E88E5"/>
    <circle cx="278" cy="125" r="30" fill="#FFC857"/>
    <path d="M95 305h210" stroke="#0B4A8F" strokeWidth="7" strokeLinecap="round"/>
    <path d="M168 205l22 26 54-68" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="90" cy="170" r="9" fill="#26A69A"/>
    <circle cx="320" cy="280" r="7" fill="#26A69A"/>
  </svg>
);

const SLIDES = [
  {
    badge: "جمعية وقفية",
    title: "معاً نبني مستقبلاً صحياً مستداماً",
    desc: "جمعية الأوقاف الصحية — أول جمعية صحية وقفية في المملكة",
    Art: SlideArtCare,
  },
  {
    badge: "مسار وقفي",
    title: "وقف الخدمات العلاجية",
    desc: "توفير الرعاية الصحية للمرضى والفقراء والمحتاجين",
    Art: SlideArtClinic,
  },
  {
    badge: "رؤية 2030",
    title: "شريك رؤية 2030",
    desc: "نعمل على تنمية القطاع الصحي الوقفي تماشياً مع رؤية المملكة",
    Art: SlideArtVision,
  },
];

function HeroSlider() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const touch = useRef<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => { setDir(1); setI((p) => (p + 1) % SLIDES.length); }, 5000);
    return () => clearInterval(id);
  }, []);

  const go = (n: number) => { setDir(n > i ? 1 : -1); setI((n + SLIDES.length) % SLIDES.length); };
  const slide = SLIDES[i];
  const Icon = slide.Icon;

  return (
    <section
      className="relative h-[85vh] min-h-[560px] w-full overflow-hidden bg-gradient-hero"
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current == null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) go(dx > 0 ? i + 1 : i - 1); // RTL: swipe right = next
        touch.current = null;
      }}
    >
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={i}
          initial={{ opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -dir * 40 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="absolute inset-0 mx-auto flex max-w-7xl flex-col items-center justify-center gap-10 px-6 md:flex-row md:gap-16"
        >
          <div className="flex-1 text-center md:text-right">
            <motion.span
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-bold text-accent shadow-sm"
            >
              {slide.badge}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="mt-5 text-3xl font-extrabold leading-tight md:text-5xl lg:text-6xl"
            >
              {slide.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="mt-5 text-base text-muted-foreground md:text-lg"
            >
              {slide.desc}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start"
            >
              <a href="https://store.hawqaf.org.sa/" target="_blank" rel="noopener noreferrer"
                className="rounded-lg bg-gradient-brand px-6 py-3 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.03]">
                تبرع الآن
              </a>
              <Link to="/programs" className="rounded-lg border-2 border-primary px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white">
                اكتشف برامجنا
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.6 }}
            className="relative flex h-64 w-64 items-center justify-center md:h-96 md:w-96"
          >
            <div className="absolute inset-0 animate-pulse rounded-full bg-accent/10 blur-3xl" />
            <div className="relative flex h-56 w-56 items-center justify-center rounded-3xl bg-white shadow-2xl md:h-80 md:w-80">
              <Icon className="h-32 w-32 text-accent md:h-44 md:w-44" strokeWidth={1.2} />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows (RTL: prev on right, next on left) */}
      <button aria-label="السابق" onClick={() => go(i + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 text-primary shadow-md backdrop-blur transition-transform hover:scale-110">
        <ChevronRight className="h-5 w-5" />
      </button>
      <button aria-label="التالي" onClick={() => go(i - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 text-primary shadow-md backdrop-blur transition-transform hover:scale-110">
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, idx) => (
          <button key={idx} onClick={() => go(idx)} aria-label={`Slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all ${idx === i ? "w-8 bg-accent" : "w-2.5 bg-primary/30"}`} />
        ))}
      </div>
    </section>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      setN(Math.floor(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{n.toLocaleString("ar-EG")}{suffix}</span>;
}

const STATS = [
  { label: "المرضى المستفيدون", value: 50000, prefix: "+", Icon: Users },
  { label: "المشاريع الوقفية", value: 120, prefix: "+", Icon: Building2 },
  { label: "سنوات الخبرة", value: 15, prefix: "", Icon: Calendar },
  { label: "الشراكات الاستراتيجية", value: 40, prefix: "+", Icon: Award },
];

function StatsBar() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl bg-light-bg p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <s.Icon className="mx-auto h-8 w-8 text-accent" />
              <div className="mt-3 text-2xl font-extrabold text-primary md:text-4xl">
                {s.prefix}<Counter to={s.value} />
              </div>
              <div className="mt-2 text-xs font-medium text-muted-foreground md:text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="bg-light-bg py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold text-accent">من نحن</span>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">جمعية وقفية مستدامة</h2>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 md:text-lg">
            تفخر الأوقاف الصحية بكونها أول جمعية صحية وقفية مهتمة بإنشاء كيانات صحية وقفية مستدامة في المملكة العربية السعودية. تشرفَ بتأسيسها نخبة من أمهر الأطباء وعدد من رجال الأعمال والمسؤولين بالجهات الحكومية في المنطقة الشرقية.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">رؤيتنا</h3>
            <p className="mt-3 text-foreground/75 leading-relaxed">
              أن تكون الجمعية هي المرجع الأول للأوقاف الصحية على مستوى المملكة العربية السعودية.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-border">
              <img src="/logo-icon.png" alt="" className="h-8 w-8 object-contain" />
            </div>
            <h3 className="text-xl font-bold">رسالتنا</h3>
            <p className="mt-3 text-foreground/75 leading-relaxed">
              نسعى لإقامة مشاريع صحية وقفية مستدامة تقدم الرعاية المثلى للمرضى والفقراء والمحتاجين.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const PROGRAMS = [
  { title: "أوقاف تقدم الخدمات العلاجية", desc: "توفير الرعاية الصحية المباشرة للمرضى والمحتاجين عبر شبكة من الشركاء.", Icon: Stethoscope },
  { title: "أوقاف الأجهزة الطبية", desc: "تجهيز المرافق الصحية بالأجهزة الطبية الحديثة لخدمة المجتمع.", Icon: Activity },
  { title: "أوقاف استثمارية", desc: "مشاريع استثمارية تدر عائداً مستداماً لدعم البرامج الصحية الوقفية.", Icon: TrendingUp },
];

function ProgramsPreview() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="text-sm font-bold text-accent">برامجنا</span>
            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">مسارات وقفية متنوعة</h2>
          </div>
          <Link to="/programs" className="hidden items-center gap-1 text-sm font-bold text-primary hover:text-accent md:inline-flex">
            عرض جميع البرامج <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PROGRAMS.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group rounded-2xl border border-border bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-xl">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-hero">
                <p.Icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-lg font-bold">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              <div className="mt-5 flex items-center gap-1 text-sm font-bold text-accent opacity-0 transition-opacity group-hover:opacity-100">
                المزيد <ArrowLeft className="h-4 w-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const NEWS = [
  { tag: "إعلان", date: "10 مايو 2026", title: "إطلاق وقف الأجهزة الطبية المتقدمة", desc: "توقيع شراكة استراتيجية لتجهيز أربع مستشفيات في المنطقة الشرقية." },
  { tag: "فعالية", date: "28 أبريل 2026", title: "ملتقى الأوقاف الصحية السنوي 2026", desc: "تنظيم الجمعية لملتقاها السنوي بحضور مسؤولين من القطاع الصحي." },
  { tag: "تقرير", date: "15 أبريل 2026", title: "نتائج البرامج الوقفية للربع الأول", desc: "أكثر من 12,000 مستفيد خلال الربع الأول من العام الجاري." },
];

function NewsPreview() {
  return (
    <section className="bg-light-bg py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="text-sm font-bold text-accent">أحدث الأخبار</span>
            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">ماذا يحدث في الجمعية</h2>
          </div>
          <Link to="/news" className="hidden items-center gap-1 text-sm font-bold text-primary hover:text-accent md:inline-flex">
            جميع الأخبار <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {NEWS.map((n, i) => (
            <motion.article key={n.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="overflow-hidden rounded-2xl bg-white transition-all hover:-translate-y-1.5 hover:shadow-xl">
              <div className="flex h-44 items-center justify-center bg-gradient-hero">
                <img src="/logo-icon.png" alt="" className="h-20 w-20 object-contain opacity-70" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs">
                  <span className="rounded-full bg-accent/10 px-2.5 py-1 font-bold text-accent">{n.tag}</span>
                  <span className="text-muted-foreground">{n.date}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold leading-snug">{n.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{n.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TransparencyStrip() {
  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-hero p-6 text-center md:flex-row md:text-right">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <p className="text-sm font-semibold text-primary md:text-base">
              مسجلة بالمركز الوطني لتنمية القطاع غير الربحي برقم (1968)
            </p>
          </div>
          <Link to="/transparency" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.03]">
            تقارير الشفافية
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <HeroSlider />
      <StatsBar />
      <AboutSection />
      <ProgramsPreview />
      <NewsPreview />
      <TransparencyStrip />
    </>
  );
}
