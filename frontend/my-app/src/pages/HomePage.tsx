import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LandingPage = () => {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Modern communication</p>
        <h1>Stay connected with your people</h1>
        <p className="hero-text">
          Chat, share updates, and keep your team in sync with a beautiful and
          seamless messaging experience.
        </p>

        <div className="cta-row">
          <Link to="/login" className="primary-btn">
            Login
          </Link>
          <Link to="/register" className="secondary-btn">
            Register
          </Link>
        </div>
      </div>

      <div className="preview-card">
        <div className="preview-header">
          <span className="dot green" />
          <span className="dot yellow" />
          <span className="dot red" />
        </div>

        <div className="chat-window">
          <div className="message incoming">
            Hey! Are we still meeting today?
          </div>
          <div className="message outgoing">
            Yes, at 4:00 PM. I’ll send the details.
          </div>
          <div className="message incoming">Perfect, see you then.</div>
        </div>
      </div>
    </section>
  );
};

const DashboarPage = ({ username }: { username: string }) => {
  return (
    <section className="dashboard-card">
      <p className="eyebrow">Your space</p>
      <h1>Welcome back, {username}</h1>
      <p className="hero-text">
        You’re signed in and ready to catch up with your conversations.
      </p>
      <div className="dashboard-status">
        <span className="dot green" />
        <span>You’re all set to chat</span>
      </div>
    </section>
  );
};

const HomePage = () => {
  const { user } = useContext(AuthContext);
  return user ? <DashboarPage username={user.username} /> : <LandingPage />;
};

export default HomePage;
