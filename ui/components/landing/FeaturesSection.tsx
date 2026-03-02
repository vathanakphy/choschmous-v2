import { Medal, ClipboardList, BarChart3, Trophy } from 'lucide-react';

const features = [
  {
    icon: Medal,
    title: 'Event Management',
    description: 'Create and manage sports events, categories, and schedules',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: ClipboardList,
    title: 'Registration Wizard',
    description: 'Step-by-step registration for athletes with organization and sport selection',
    color: 'text-[oklch(0.51_0.24_265)]',
    bg: 'bg-[oklch(0.51_0.24_265_/_0.1)]',
  },
  {
    icon: BarChart3,
    title: 'Dashboard & Analytics',
    description: 'Real-time statistics, gender charts, and enrollment tracking',
    color: 'text-[oklch(0.55_0.17_155)]',
    bg: 'bg-[oklch(0.55_0.17_155_/_0.1)]',
  },
  {
    icon: Trophy,
    title: 'Leaderboards & Medals',
    description: 'Track results, medals, and provincial rankings',
    color: 'text-[oklch(0.55_0.27_295)]',
    bg: 'bg-[oklch(0.55_0.27_295_/_0.1)]',
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
            Everything You Need
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            A complete platform for managing Cambodian youth sports competitions
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-7 shadow-(--card-shadow) transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}
              >
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-foreground text-lg font-bold">{feature.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
