"use client";

import Link from "next/link";
import { useTransition } from "react";

export function Header() {
  const [isPending, startTransition] = useTransition();


  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <Link href="/" className="text-xl font-bold text-primary">
        WageWise
      </Link>
      <nav className="space-x-4">
        <Link href="/about" className="text-sm hover:underline">
          About
        </Link>
        <Link href="/login" className="text-sm text-white bg-primary px-4 py-2 rounded-md hover:bg-primary/90">
          Login
        </Link>
        {/* <Link
          href="/login"
          onClick={(e) => {
            e.preventDefault(); // prevent default instant nav
            startTransition(() => {
              window.location.href = "/auth"; // triggers spinner
            });
          }}
          className="relative inline-flex text-white bg-primary hover:bg-primary/90 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all"
        >
          {isPending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "Get Started"
          )}
        </Link> */}

      </nav>
    </header>
  );
}
