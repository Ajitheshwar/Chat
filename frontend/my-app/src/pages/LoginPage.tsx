import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../apis/client";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser, loading } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await loginUser(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
    }
  };

  return (
    <section className="auth-card">
      <div className="auth-header">
        <p className="eyebrow">Welcome back</p>
        <h1>Login</h1>
      </div>
      {error && <p className="error">{error}</p>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          <span>Username</span>
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
        </label>

        <label>
          <span>Password</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </section>
  );
};

export default LoginPage;
