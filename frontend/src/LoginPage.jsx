import { useState } from "react";
import styles from "./LoginPage.module.css";
import { loginUser } from "./api/api";

export default function LoginPage({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser(email, password);
      
      if (response && response.user && response.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.accessToken);
        
        // Show success message briefly before redirect
        alert("Login Successful! Welcome back!");
        setPage("home");
        window.location.reload();
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPageWrapper}>
      <div className={styles.loginContainer}>
        {/* Login Section */}
        <div className={styles.loginSection}>
          <form onSubmit={handleSubmit}>
            <h2>Welcome Back</h2>
            
            <label htmlFor="email">Email Address</label>
            <div className={styles.inputBox}>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email"
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className={styles.inputBox}>
              <input 
                type="password" 
                id="password" 
                placeholder="Enter your password"
                required
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <button 
              type="submit" 
              className={styles.loginBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.loadingSpinner}></span>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Sign Up Section */}
        <div className={styles.signupSection}>
          <h2>New Here?</h2>
          <p>Create an account and start your cinematic journey with MovieMate!</p>
          <button 
            type="button" 
            className={styles.signupBtn}
            onClick={() => setPage("register")}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}