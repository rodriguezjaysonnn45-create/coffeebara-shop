import { Link } from "react-router-dom";
import "../styles/style.css";

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found-container">
        <img
          src="/src/assets/confused-capybara.gif"
          alt="Confused Capybara"
          className="not-found-gif"
        />
        <h2>404 - Page Not Found</h2>
        <p>Oops! Looks like this capybara got a little lost</p>
        <Link to="/" className="back-home-btn">Return to Home</Link>
      </div>
    </section>
  );
}
