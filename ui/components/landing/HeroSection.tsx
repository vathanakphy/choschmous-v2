import Link from 'next/link';
import { ROUTES } from '@/config/routes';
import { Button } from '@/ui/design-system/primitives/Button';

const HeroSection = () => {
  return (
    <section className="from-background via-background to-secondary relative overflow-hidden bg-linear-to-br">
      <div className="container mx-auto px-4 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-up max-w-xl">
            <h1 className="text-foreground text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-[3.25rem]">
              Sports Registration Management System
            </h1>
            <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
              Streamline athlete registration, event management, and results tracking for Cambodian
              sports competitions
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="rounded-[0.75rem] px-8 text-base font-semibold" asChild>
                <Link href={ROUTES.PUBLIC.REGISTER.event}>Register Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-[0.75rem] px-8 text-base font-semibold"
                asChild
              >
                <Link href={ROUTES.PUBLIC.SURVEY}>Take Survey</Link>
              </Button>
            </div>
          </div>

          {/* Decorative sports illustration placeholder */}
          <div
            className="animate-fade-up hidden justify-center lg:flex"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="relative flex h-80 w-80 items-center justify-center">
              {/* Abstract sports-themed decorative circles */}
              <div className="bg-primary/10 absolute h-64 w-64 animate-pulse rounded-full" />
              <div className="bg-primary/15 absolute h-48 w-48 rounded-full" />
              <div className="bg-primary/20 absolute flex h-32 w-32 items-center justify-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  className="text-primary h-16 w-16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {/* Running figure */}
                  <circle cx="40" cy="10" r="5" />
                  <path d="M30 22 L38 18 L44 24 L50 20" strokeLinecap="round" />
                  <path d="M38 18 L36 30 L30 38" strokeLinecap="round" />
                  <path d="M36 30 L44 36 L48 44" strokeLinecap="round" />
                  <path d="M30 38 L24 48" strokeLinecap="round" />
                  <path d="M48 44 L54 52" strokeLinecap="round" />
                </svg>
              </div>
              {/* Small floating accent dots */}
              <div className="absolute top-4 right-8 h-4 w-4 rounded-full bg-[oklch(0.55_0.17_155)]" />
              <div className="absolute bottom-8 left-4 h-3 w-3 rounded-full bg-[oklch(0.55_0.27_295)]" />
              <div className="absolute top-16 left-2 h-2 w-2 rounded-full bg-[oklch(0.58_0.23_345)]" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-[oklch(0.55_0.17_155/0.1)] blur-3xl" />
    </section>
  );
};

export default HeroSection;
