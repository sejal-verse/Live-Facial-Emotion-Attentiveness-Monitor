import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function StudentLogin() {
  const navigate = useNavigate();

  const [emailOrRoll, setEmailOrRoll] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --------------------------------------------------
  // STUDENT LOGIN
  // --------------------------------------------------

  const handleLogin = (e) => {
    e.preventDefault();

    // Basic validation
    if (!emailOrRoll.trim()) {
      alert("Please enter your email or roll number.");
      return;
    }

    if (!password.trim()) {
      alert("Please enter your password.");
      return;
    }

    // Get registered students
    const students = JSON.parse(
      localStorage.getItem("registeredStudents") || "[]"
    );

    // Find student using email OR roll number
    const student = students.find(
      (item) =>
        item.email?.toLowerCase() ===
          emailOrRoll.trim().toLowerCase() ||
        item.rollNo?.toLowerCase() ===
          emailOrRoll.trim().toLowerCase()
    );

    // Student not found
    if (!student) {
      alert(
        "Student account not found.\n\nPlease register first."
      );
      return;
    }

    // Check password
    if (student.password !== password) {
      alert("Incorrect password.");
      return;
    }

    // Save logged-in student
    localStorage.setItem(
      "loggedInStudent",
      JSON.stringify(student)
    );

    // Go to student dashboard
    navigate("/student-dashboard");
  };

  return (
    <div style={styles.page}>

      {/* LOGIN CARD */}

      <div style={styles.card}>

        {/* LOGO */}

        <div style={styles.logo}>
          🎓
        </div>

        {/* TITLE */}

        <h1 style={styles.title}>
          Student Login
        </h1>

        <p style={styles.subtitle}>
          Login to your AI Smart Classroom account
        </p>


        {/* FORM */}

        <form onSubmit={handleLogin}>

          {/* EMAIL / ROLL NUMBER */}

          <div style={styles.inputGroup}>

            <label style={styles.label}>
              Email or Roll Number
            </label>

            <div style={styles.inputWrapper}>

              <span style={styles.inputIcon}>
                👤
              </span>

              <input
                type="text"
                placeholder="Enter email or roll number"
                value={emailOrRoll}
                onChange={(e) =>
                  setEmailOrRoll(e.target.value)
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
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            style={styles.loginButton}
          >
            Student Login →
          </button>

        </form>


        {/* REGISTER */}

        <div style={styles.registerBox}>

          <p style={styles.registerText}>
            Don't have a student account?
          </p>

          <Link
            to="/students"
            style={styles.registerLink}
          >
            Register as Student
          </Link>

        </div>


        {/* BACK */}

        <Link
          to="/"
          style={styles.backLink}
        >
          ← Back to account selection
        </Link>


        {/* FOOTER */}

        <p style={styles.footer}>
          🤖 AI Smart Classroom
        </p>

      </div>

    </div>
  );
}


// ======================================================
// STYLES
// ======================================================

const styles = {

  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px 20px",
    boxSizing: "border-box",

    background:
      "linear-gradient(135deg, #eff6ff, #eef2ff, #f5f3ff)",

    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },


  card: {
    width: "100%",
    maxWidth: "440px",

    background: "white",

    borderRadius: "22px",

    padding: "38px",

    boxSizing: "border-box",

    boxShadow:
      "0 20px 50px rgba(15, 23, 42, 0.12)",

    border:
      "1px solid #e2e8f0",
  },


  logo: {
    width: "70px",
    height: "70px",

    margin: "0 auto 20px",

    borderRadius: "20px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "34px",

    background:
      "linear-gradient(135deg, #dbeafe, #ede9fe)",
  },


  title: {
    margin: 0,

    textAlign: "center",

    fontSize: "28px",

    fontWeight: "800",

    color: "#0f172a",
  },


  subtitle: {
    textAlign: "center",

    color: "#64748b",

    fontSize: "13px",

    margin: "8px 0 30px",
  },


  inputGroup: {
    marginBottom: "20px",
  },


  label: {
    display: "block",

    marginBottom: "7px",

    fontSize: "13px",

    fontWeight: "700",

    color: "#334155",
  },


  inputWrapper: {
    display: "flex",

    alignItems: "center",

    border:
      "1px solid #cbd5e1",

    borderRadius: "11px",

    overflow: "hidden",

    background: "#fff",
  },


  inputIcon: {
    paddingLeft: "13px",

    fontSize: "17px",
  },


  input: {
    flex: 1,

    minWidth: 0,

    border: "none",

    outline: "none",

    padding: "13px 12px",

    fontSize: "14px",

    color: "#0f172a",

    background: "transparent",
  },


  showButton: {
    border: "none",

    background: "transparent",

    color: "#2563eb",

    fontWeight: "700",

    fontSize: "12px",

    padding: "10px 13px",

    cursor: "pointer",
  },


  loginButton: {
    width: "100%",

    border: "none",

    borderRadius: "11px",

    padding: "14px",

    marginTop: "5px",

    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",

    color: "white",

    fontSize: "14px",

    fontWeight: "800",

    cursor: "pointer",

    boxShadow:
      "0 8px 18px rgba(37, 99, 235, 0.25)",
  },


  registerBox: {
    textAlign: "center",

    marginTop: "25px",

    paddingTop: "20px",

    borderTop:
      "1px solid #e2e8f0",
  },


  registerText: {
    margin: "0 0 8px",

    fontSize: "13px",

    color: "#64748b",
  },


  registerLink: {
    color: "#2563eb",

    textDecoration: "none",

    fontSize: "14px",

    fontWeight: "800",
  },


  backLink: {
    display: "block",

    textAlign: "center",

    marginTop: "22px",

    color: "#64748b",

    textDecoration: "none",

    fontSize: "12px",
  },


  footer: {
    textAlign: "center",

    margin: "25px 0 0",

    color: "#94a3b8",

    fontSize: "11px",
  },
};

export default StudentLogin;