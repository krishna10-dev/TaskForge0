import { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!accepted) {
      alert("You must accept the Terms of Service and Privacy Policy.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const formData = {
      fullname,
      email,
      password,
    };

    localStorage.setItem("signupData", JSON.stringify(formData));
    alert("Account created successfully!");

    setFullname("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAccepted(false);
  };

  return (
    <div id="signupmain">
      <header>
        <h2>Precision Orchestrator</h2>
        <Link to="/help">Help Center</Link>
      </header>
      <main id="signup">
        <section id="signupleftsec">
          <div id="signupleftsectop">
            <h3>Architect your focus. Curate your output.</h3>
            <p>
              Join the elite ecosystem designed for high-performance task
              orchestration.
            </p>
          </div>
          <div id="signupleftsecbottom">
            <p>SYSTEM VERSION 4.0.2</p>
          </div>
        </section>
        <section id="signuprightsec">
          <div id="signuprightsec1">
            <h4>Create Account</h4>
            <p>Begin your journey toward editorial precision</p>
          </div>
          <div id="signuprightsec2">
            <form onSubmit={handleSubmit}>
              <div className="forminput">
                <label htmlFor="fullname">Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  placeholder="e.g. Krishna"
                  required
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
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
              <div id="signuppassword">
                <div>
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
                <div>
                  <label htmlFor="confirmpassword">Confirm</label>
                  <input
                    type="password"
                    id="confirmpassword"
                    placeholder="************"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <div id="signupcheckbox">
                <input
                  type="checkbox"
                  id="accept"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <p>
                  I accept the <span>Terms of Service</span> and{" "}
                  <span>Privacy Policy.</span>
                </p>
              </div>
              <div id="signuprightsec3">
                <button type="submit">
                  Create Account <img src="/src/assets/rightarrow.png" alt="" />
                </button>
              </div>
            </form>
          </div>

          <div id="signuprightsec4">
            <div id="signuprightsec4a">
              <button type="button">
                <span>G</span> Google
              </button>
              <button type="button">
                <span>A</span> Apple
              </button>
            </div>
            <div id="signuprightsec4b">
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Signup;
