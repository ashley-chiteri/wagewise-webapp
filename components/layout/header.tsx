"use client";

import Link from "next/link";
import { useTransition } from "react";

export function Header() {

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
      </nav>
    </header>
  );
}
