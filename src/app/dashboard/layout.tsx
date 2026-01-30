
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
      <Suspense fallback={<div>Loading...</div>}>
        <LanguageUpdater />
        <div className="flex min-h-screen bg-background">
          <Sidebar>
            <SidebarNav />
          </Sidebar>
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </Suspense>
    </SidebarProvider>
  );
}
