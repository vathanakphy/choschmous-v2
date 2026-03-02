const steps = [
  {
    number: '1',
    title: 'Select Event',
    description: 'Choose from available sports competitions',
  },
  {
    number: '2',
    title: 'Register Athletes',
    description: 'Fill in organization, sport, and athlete details',
  },
  {
    number: '3',
    title: 'Track Results',
    description: 'Monitor participation and view leaderboards',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="bg-secondary py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">Get started in three simple steps</p>
        </div>

        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 md:flex-row md:gap-0">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative flex flex-1 flex-col items-center text-center"
            >
              {index < steps.length - 1 && (
                <div className="border-primary/30 absolute top-6 left-[calc(50%+2rem)] hidden w-[calc(100%-4rem)] border-t-2 border-dashed md:block" />
              )}
              <div className="bg-primary text-primary-foreground relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold">
                {step.number}
              </div>
              <h3 className="text-foreground text-lg font-bold">{step.title}</h3>
              <p className="text-muted-foreground mt-2 max-w-50 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
