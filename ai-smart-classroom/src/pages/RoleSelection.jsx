import { useNavigate } from "react-router-dom";

function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>AI</div>
        </div>

        <h1 style={styles.title}>
          AI Smart Classroom
        </h1>

        <p style={styles.subtitle}>
          Live Facial Emotion & Attentiveness Monitor
        </p>

        <p style={styles.chooseText}>
          Choose your role to continue
        </p>

        {/* ROLE CARDS */}
        <div style={styles.cards}>

          {/* TEACHER */}
          <button
            style={styles.card}
            onClick={() => navigate("/teacher-login")}
          >
            <div style={styles.cardIcon}>👨‍🏫</div>

            <h2 style={styles.cardTitle}>
              Teacher
            </h2>

            <p style={styles.cardText}>
              Manage classroom, attendance,
              monitoring and AI reports.
            </p>

            <span style={styles.cardButton}>
              Teacher Login →
            </span>
          </button>

          {/* STUDENT */}
          <button
            style={styles.card}
            onClick={() => navigate("/student-login")}
          >
            <div style={styles.cardIcon}>👨‍🎓</div>

            <h2 style={styles.cardTitle}>
              Student
            </h2>

            <p style={styles.cardText}>
              View attendance, attention,
              emotions and performance.
            </p>

            <span style={styles.cardButton}>
              Student Login →
            </span>
          </button>

        </div>

        {/* FOOTER */}
        <p style={styles.footer}>
          AI-powered classroom monitoring system
        </p>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    padding: "30px",
    boxSizing: "border-box",
  },

  container: {
    width: "100%",
    maxWidth: "850px",
    textAlign: "center",
  },

  logo: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "15px",
  },

  logoIcon: {
    width: "70px",
    height: "70px",
    borderRadius: "20px",
    background: "white",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    fontWeight: "bold",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },

  title: {
    color: "white",
    fontSize: "38px",
    margin: "10px 0",
  },

  subtitle: {
    color: "#e0e7ff",
    fontSize: "16px",
    margin: 0,
  },

  chooseText: {
    color: "white",
    fontSize: "18px",
    margin: "40px 0 20px",
    fontWeight: "600",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "25px",
  },

  card: {
    background: "white",
    border: "none",
    borderRadius: "20px",
    padding: "35px 30px",
    cursor: "pointer",
    boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
    transition: "transform 0.2s",
  },

  cardIcon: {
    fontSize: "55px",
    marginBottom: "10px",
  },

  cardTitle: {
    margin: "5px 0 12px",
    fontSize: "25px",
    color: "#111827",
  },

  cardText: {
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.6",
    minHeight: "45px",
  },

  cardButton: {
    display: "inline-block",
    marginTop: "18px",
    background: "#2563eb",
    color: "white",
    padding: "12px 22px",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "14px",
  },

  footer: {
    color: "#dbeafe",
    marginTop: "35px",
    fontSize: "13px",
  },
};

export default RoleSelection;