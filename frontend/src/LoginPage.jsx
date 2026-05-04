import { useState } from "react";
import styles from "./LoginPage.module.css";
import { loginUser } from "./api/api";

export default function LoginPage({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await loginUser(email, password);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.accessToken);
      alert("Login Successful!");
      setPage("home");
      window.location.reload();
    } catch (err) {
      setError(err.message || "Invalid email or password");
    }
  };

  return (
    <div className={styles.loginPageWrapper}>
      <div className={styles.loginContainer}>
        <div className={styles.loginSection}>
          <form onSubmit={handleSubmit}>
            <h2>Login to Your Account</h2>
            
            {/* Inputs... */}
            <label htmlFor="email">E-mail</label>
            <div className={styles.inputBox}>
              <input type="email" id="email" placeholder="Email" required
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <label htmlFor="password">Password</label>
            <div className={styles.inputBox}>
              <input type="password" id="password" placeholder="Password" required
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {error && <p className={styles.errorText}>{error}</p>}

            <button type="submit" className={styles.loginBtn}>Sign In</button>
          </form>
        </div>

        <div className={styles.signupSection}>
          <h2>New Here?</h2>
          <p>Sign up Now!</p>
          <button type="button" onClick={() => setPage("register")}>Register</button>
        </div>
      </div>
    </div>
  );
}