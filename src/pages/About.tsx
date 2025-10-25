export default function About() {
  return (
    <section className="about-page">
      {/* Header Section */}
      <div className="about-hero">
        <h1>About CoffeeBara Café</h1>
        <p>Where coffee meets comfort, inspired by the calmest creature — the capybara.</p>
      </div>

      {/* Content Section */}
      <div className="about-section">
        <div className="about-image">
          <img src="/images/about-capybara.webp" alt="CoffeeBara Café Interior" />
        </div>

        <div className="about-text">
          <h2>Our Story</h2>
          <p>
            CoffeeBara Café was founded with a simple idea: bring the warmth of coffee and the
            peaceful spirit of capybaras into one cozy place. From freshly brewed espresso to
            seasonal specialties, every cup is made with love.
          </p>
          <p>
            Whether you’re here to work, relax, or meet friends, we want you to feel right at home.
            So take a sip, unwind, and let CoffeeBara brighten your day.
          </p>
        </div>
      </div>
    </section>
  );
}
