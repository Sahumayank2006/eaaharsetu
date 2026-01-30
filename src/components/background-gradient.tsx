// This component is no longer used. You can delete it if you want.
"use client";

import { cn } from "@/lib/utils";

export function BackgroundGradient({ hint }: { hint: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat",
          "bg-fixed transition-all duration-500 ease-in-out animate-in fade-in"
        )}
        style={{ backgroundImage: `url(https://picsum.photos/seed/${hint.replace(/\s/g, "")}/1920/1080)`}}
        data-ai-hint={hint}
      ></div>
      <div className="pointer-events-none absolute inset-0 bg-black/40"></div>
    </div>
  );
}
