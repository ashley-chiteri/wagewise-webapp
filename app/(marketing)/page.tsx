export default function LandingPage() {
    return (
      <section className="py-20 px-6 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Simplified Payroll for Kenyan Businesses</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Automate payroll tax reports, manage employee data, and stay compliant with Kenyan tax regulations — all in one place.
        </p>
        <a href="/auth/register" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90">
          Get Started
        </a>
      </section>
    );
  }
  