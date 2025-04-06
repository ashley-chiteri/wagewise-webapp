"use client";

import { toast } from "sonner";
import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="py-20 px-6 text-center max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Simplified Payroll for Kenyan Businesses</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Automate payroll tax reports, manage employee data, and stay compliant with Kenyan tax regulations — all in one place.
      </p>
      <Link
        href="/register"
        onClick={() => {
          toast("Processing...", {
            description: "Taking you to the sign up / login page",
            duration: 2000,
          });
        }}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800 transition-all"
      >
        Get Started
      </Link>
    </section>
  );
}
