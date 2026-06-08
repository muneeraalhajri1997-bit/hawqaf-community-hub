import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Users, Newspaper, Layers, BarChart3, Briefcase, HeartHandshake, Loader2, FileText, Images } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

const NAV: { to: string; label: string; icon: typeof Users; exact?: boolean }[] = [
  { to: "/admin", label: "نظرة عامة", icon: BarChart3, exact: true },
  { to: "/admin/slides", label: "السلايدر", icon: Images },
  { to: "/admin/board", label: "مجلس الإدارة", icon: Users },
  { to: "/admin/news", label: "الأخبار والإعلام", icon: Newspaper },
  { to: "/admin/programs", label: "البرامج", icon: Layers },
  { to: "/admin/statistics", label: "الإحصائيات", icon: BarChart3 },
  { to: "/admin/transparency", label: "الوثائق والسياسات", icon: FileText },
  { to: "/admin/jobs", label: "الوظائف", icon: Briefcase },
  { to: "/admin/volunteers", label: "طلبات التطوع", icon: HeartHandshake },
];

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (session === null) {
      navigate({ to: "/admin/login", replace: true });
    }
  }, [session, navigate]);

  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!session) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  };

  return (
    <div className="flex min-h-screen" dir="rtl">
      <aside className="w-64 shrink-0 border-l border-border bg-white">
        <div className="border-b border-border p-5">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← الموقع</Link>
          <h1 className="mt-2 text-lg font-extrabold text-primary">لوحة الإدارة</h1>
          <p className="mt-1 text-xs text-muted-foreground truncate">{session.user.email}</p>
        </div>
        <nav className="p-3">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to as "/admin"}
                className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-primary text-white" : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </nav>
      </aside>
      <main className="flex-1 overflow-x-auto bg-light-bg p-8">
        <h2 className="mb-6 text-2xl font-extrabold text-foreground">{title}</h2>
        {children}
      </main>
    </div>
  );
}
