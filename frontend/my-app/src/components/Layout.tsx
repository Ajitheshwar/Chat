import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../apis/client";
import { AuthContext } from "../context/AuthContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logoutUser } = useContext(AuthContext);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setError("");
    try {
      await logoutUser();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          Chat
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          {user ? (
            <>
              <Link to="/chat">Chat</Link>
              <button
                className="nav-button"
                type="button"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main className="page-content">
        {error && <p className="error">{error}</p>}
        {children}
      </main>
    </div>
  );
};

export default Layout;
