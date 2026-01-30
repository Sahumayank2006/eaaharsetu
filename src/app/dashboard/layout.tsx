
"use client";

import { Suspense, useContext, useEffect } from "react";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Header } from "@/components/dashboard/header";
import { useSearchParams } from "next/navigation";
import { LanguageContext } from "@/contexts/language-context";
import type { LangKey } from "@/contexts/language-context";

// This new component isolates the use of client-side hooks.
function LanguageUpdater() {
  const searchParams = useSearchParams();
  const { setLang } = useContext(LanguageContext);

  useEffect(() => {
    const lang = searchParams.get("lang") as LangKey;
    if (lang) {
      setLang(lang);
    }
  }, [searchParams, setLang]);

  // This component doesn't render anything itself.
  return null;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* Suspense is used at the top level for components that need it */}
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      }>
        <LanguageUpdater />
        <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/30">
          <Sidebar className="border-r border-sidebar-border/50">
            <SidebarNav />
          </Sidebar>
          <div className="flex flex-1 flex-col min-w-0">
            <Header />
            <main className="flex-1 overflow-auto">
              <div className="mx-auto w-full max-w-[1600px] p-4 md:p-6 lg:p-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </Suspense>
    </SidebarProvider>
  );
}
