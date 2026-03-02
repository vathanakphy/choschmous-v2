const stats = [
  { value: '25+', label: 'Sports' },
  { value: '500+', label: 'Athletes' },
  { value: '15+', label: 'Provinces' },
  { value: '10+', label: 'Events' },
];

const StatsSection = () => {
  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-secondary flex flex-col items-center rounded-2xl px-6 py-8 text-center"
            >
              <span className="text-primary text-3xl font-extrabold sm:text-4xl">{stat.value}</span>
              <span className="text-muted-foreground mt-1 text-sm font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
