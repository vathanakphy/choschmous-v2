const Footer = () => {
  return (
    <footer className="bg-[oklch(0.22_0.02_250)] py-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-[oklch(0.8_0_0)]">
            © 2026 Choschmous — Ministry of Education, Youth and Sport
          </p>
          <nav className="flex gap-6">
            {['About', 'Contact', 'Privacy'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm text-[oklch(0.65_0_0)] transition-colors hover:text-white"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
