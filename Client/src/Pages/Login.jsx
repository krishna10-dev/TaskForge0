import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await login({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div id="loginmain">
      <header>
        <h2>Precision Orchestrator</h2>
        <Link to="/help">Help Center</Link>
      </header>
      <main id="login">
        <section id="loginleftsec">
          <div id="loginleftsectop">
            <h3>Welcome back. System ready for input.</h3>
            <p>
              Re-engage with your high-performance task ecosystem.
            </p>
          </div>
          <div id="loginleftsecbottom">
            <p>SYSTEM VERSION 4.0.2</p>
          </div>
        </section>
        <section id="loginrightsec">
          <div id="loginrightsec1">
            <h4>Sign In</h4>
            <p>Enter your credentials to access the orchestrator</p>
          </div>
          <div id="loginrightsec2">
            <form onSubmit={handleSubmit}>
              {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '16px', fontWeight: '600' }}>{error}</p>}
              <div className="forminput">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="forminput">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="************"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div id="loginrightsec3">
                <button type="submit">
                  Sign In <img src="/src/assets/rightarrow.png" alt="" />
                </button>
              </div>
            </form>
          </div>

          <div id="loginrightsec4">
            <div id="loginrightsec4a">
              <button type="button">
                <span>G</span> Google
              </button>
              <button type="button">
                <span>A</span> Apple
              </button>
            </div>
            <div id="loginrightsec4b">
              <p>
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
