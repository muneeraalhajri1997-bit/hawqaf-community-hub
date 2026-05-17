import { Link } from "@tanstack/react-router";
import { Twitter, Instagram, Youtube, MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#002D5D] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1 */}
          <div>
            <div className="inline-flex items-center rounded-2xl bg-white px-4 py-3 shadow-sm">
              <img src="/logo-full.png" alt="جمعية الأوقاف الصحية" className="w-auto" style={{ height: "56px" }} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              أول جمعية صحية وقفية في المملكة العربية السعودية، تسعى لإقامة مشاريع صحية وقفية مستدامة تخدم المرضى والمحتاجين.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="https://x.com/endowments_h" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/endowments_h" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.youtube.com/channel/UCWWX7ZBwwJAwXx05m4gd9EQ" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-base font-bold text-white">روابط سريعة</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              {[
                { to: "/" as const, label: "الرئيسية" },
                { to: "/board" as const, label: "مجلس الإدارة" },
                { to: "/transparency" as const, label: "الشفافية" },
                { to: "/news" as const, label: "الأخبار" },
                { to: "/statistics" as const, label: "المؤشرات" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-base font-bold text-white">برامجنا</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              <li>أوقاف تقدم الخدمات العلاجية</li>
              <li>أوقاف الأجهزة الطبية</li>
              <li>أوقاف استثمارية</li>
              <li>أوقاف البحث والتطوير</li>
              <li>أوقاف التعليم الصحي</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h3 className="text-base font-bold text-white">تواصل معنا</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>الشرقية - الدمام – حي الفردوس – طريق الأمير محمد بن فهد الفرعي</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a href="mailto:info@hawqaf.org.sa" className="hover:text-white">info@hawqaf.org.sa</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a href="tel:0138292840" dir="ltr" className="hover:text-white">013 829 2840</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs text-white/60 md:flex-row md:text-right">
          <p>مسجلة بالمركز الوطني لتنمية القطاع غير الربحي برقم (1968)</p>
          <p>© 2025 جمعية الأوقاف الصحية — جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}
