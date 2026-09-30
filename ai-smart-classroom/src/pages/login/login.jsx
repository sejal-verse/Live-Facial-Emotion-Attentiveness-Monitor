import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =====================================================
  // TEACHER LOGIN
  // =====================================================

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    const savedTeachers =
      JSON.parse(localStorage.getItem("teachers")) || [];

    const teacher = savedTeachers.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!teacher) {
      alert(
        "Teacher account not found or password is incorrect. Please sign up first."
      );
      return;
    }

    localStorage.setItem("teacherName", teacher.name);
    localStorage.setItem("loggedInTeacher", JSON.stringify(teacher));

    alert("Login successful!");

    navigate("/dashboard");
  };

  // =====================================================
  // TEACHER SIGN UP
  // =====================================================

  const handleSignup = (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    const savedTeachers =
      JSON.parse(localStorage.getItem("teachers")) || [];

    const existingTeacher = savedTeachers.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existingTeacher) {
      alert(
        "An account with this email already exists. Please login."
      );

      setIsSignup(false);
      return;
    }

    const newTeacher = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      password,
      registeredAt: new Date().toISOString(),
    };

    savedTeachers.push(newTeacher);

    localStorage.setItem(
      "teachers",
      JSON.stringify(savedTeachers)
    );

    localStorage.setItem(
      "teacherName",
      newTeacher.name
    );

    localStorage.setItem(
      "loggedInTeacher",
      JSON.stringify(newTeacher)
    );

    alert("Teacher account created successfully!");

    navigate("/dashboard");
  };

  // =====================================================
  // SWITCH LOGIN / SIGN UP
  // =====================================================

  const switchMode = () => {
    setIsSignup(!isSignup);

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* LOGO */}
        <div style={styles.logo}>
          👨‍🏫
        </div>

        {/* HEADING */}
        <h1 style={styles.title}>
          {isSignup
            ? "Create Teacher Account"
            : "Teacher Login"}
        </h1>

        <p style={styles.subtitle}>
          {isSignup
            ? "Create your account to manage your classroom"
            : "Login to access your AI Smart Classroom"}
        </p>

        <form
          onSubmit={
            isSignup
              ? handleSignup
              : handleLogin
          }
        >

          {/* NAME - ONLY FOR SIGN UP */}
          {isSignup && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Name
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  👤
                </span>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  style={styles.input}
                />
              </div>
            </div>
          )}

          {/* EMAIL */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Email
            </label>

            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>
                ✉️
              </span>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                style={styles.input}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Password
            </label>

            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>
                🔒
              </span>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                style={styles.input}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                style={styles.showButton}
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD - ONLY FOR SIGN UP */}
          {isSignup && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Confirm Password
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  🔐
                </span>

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  style={styles.input}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  style={styles.showButton}
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>
            </div>
          )}

          {/* LOGIN OPTIONS */}
          {!isSignup && (
            <div style={styles.options}>

              <label style={styles.remember}>
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                style={styles.forgot}
                onClick={() =>
                  alert(
                    "Password reset feature coming soon."
                  )
                }
              >
                Forgot Password?
              </button>

            </div>
          )}

          {/* MAIN BUTTON */}
          <button
            type="submit"
            style={styles.loginButton}
          >
            {isSignup
              ? "Create Account →"
              : "Login →"}
          </button>

        </form>

        {/* SWITCH LOGIN / SIGNUP */}
        <p style={styles.registerText}>
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            onClick={switchMode}
            style={styles.registerButton}
          >
            {isSignup
              ? "Login"
              : "Sign Up"}
          </button>
        </p>

        {/* FOOTER */}
        <p style={styles.footer}>
          🔐 Secure AI-powered classroom management
        </p>

      </div>
    </div>
  );
}


/* =====================================================
   STYLES
===================================================== */

const styles = {

  page: {
    minHeight: "100vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    padding: "20px",

    boxSizing: "border-box",

    background:
      "linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)",

    fontFamily:
      "Inter, Arial, Helvetica, sans-serif",
  },

  card: {
    width: "100%",

    maxWidth: "430px",

    backgroundColor: "#ffffff",

    borderRadius: "22px",

    padding: "40px",

    boxSizing: "border-box",

    boxShadow:
      "0 25px 60px rgba(0, 0, 0, 0.25)",
  },

  logo: {
    width: "65px",

    height: "65px",

    margin: "0 auto 18px",

    borderRadius: "18px",

    background:
      "linear-gradient(135deg, #2563eb, #7c3aed)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    fontSize: "32px",

    boxShadow:
      "0 10px 25px rgba(37, 99, 235, 0.3)",
  },

  title: {
    margin: 0,

    textAlign: "center",

    fontSize: "27px",

    fontWeight: "700",

    color: "#0f172a",

    lineHeight: "1.3",
  },

  subtitle: {
    textAlign: "center",

    color: "#64748b",

    fontSize: "13px",

    marginTop: "8px",

    marginBottom: "30px",

    lineHeight: "1.5",
  },

  inputGroup: {
    marginBottom: "18px",
  },

  label: {
    display: "block",

    marginBottom: "7px",

    fontSize: "13px",

    fontWeight: "600",

    color: "#334155",
  },

  inputWrapper: {
    display: "flex",

    alignItems: "center",

    border: "1px solid #cbd5e1",

    borderRadius: "10px",

    backgroundColor: "#f8fafc",

    overflow: "hidden",
  },

  inputIcon: {
    paddingLeft: "13px",

    fontSize: "16px",
  },

  input: {
    width: "100%",

    border: "none",

    outline: "none",

    backgroundColor: "transparent",

    padding: "13px 12px",

    fontSize: "13px",

    color: "#0f172a",

    boxSizing: "border-box",
  },

  showButton: {
    border: "none",

    backgroundColor: "transparent",

    color: "#2563eb",

    padding: "0 12px",

    cursor: "pointer",

    fontSize: "11px",

    fontWeight: "600",
  },

  options: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    margin: "5px 0 22px",

    fontSize: "11px",
  },

  remember: {
    display: "flex",

    alignItems: "center",

    gap: "5px",

    color: "#64748b",
  },

  forgot: {
    border: "none",

    background: "none",

    color: "#2563eb",

    cursor: "pointer",

    fontSize: "11px",

    fontWeight: "600",
  },

  loginButton: {
    width: "100%",

    border: "none",

    borderRadius: "10px",

    padding: "14px",

    background:
      "linear-gradient(90deg, #2563eb, #4f46e5)",

    color: "#ffffff",

    fontSize: "14px",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 8px 20px rgba(37, 99, 235, 0.25)",
  },

  registerText: {
    textAlign: "center",

    marginTop: "22px",

    color: "#64748b",

    fontSize: "12px",
  },

  registerButton: {
    border: "none",

    background: "none",

    color: "#2563eb",

    fontWeight: "700",

    cursor: "pointer",

    fontSize: "12px",

    marginLeft: "5px",

    padding: 0,
  },

  footer: {
    textAlign: "center",

    marginTop: "25px",

    paddingTop: "18px",

    borderTop: "1px solid #e2e8f0",

    color: "#94a3b8",

    fontSize: "10px",
  },
};

export default Login;