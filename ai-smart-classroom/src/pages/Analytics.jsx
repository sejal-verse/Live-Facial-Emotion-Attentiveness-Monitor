import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Analytics() {
  const [liveData, setLiveData] = useState(null);

  // ==========================================
  // LOAD LIVE DATA
  // ==========================================

  const loadLiveData = () => {
    const savedData = localStorage.getItem(
      "liveMonitoringData"
    );

    if (savedData) {
      try {
        setLiveData(JSON.parse(savedData));
      } catch (error) {
        console.error(
          "Error loading analytics data:",
          error
        );
      }
    }
  };

  // ==========================================
  // AUTO REFRESH
  // ==========================================

  useEffect(() => {
    loadLiveData();

    const interval = setInterval(() => {
      loadLiveData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // LIVE DATA
  // ==========================================

  const students =
    liveData?.students || [];

  const recognizedStudents =
    students.filter(
      (student) => student.recognized
    );

  const averageAttention =
    liveData?.averageAttention ?? 0;

  const distractedCount =
    liveData?.distractedCount ??
    liveData?.distracted ??
    0;

  const monitoringActive =
    liveData?.monitoringActive ?? false;

  // ==========================================
  // EMOTION ANALYSIS
  // ==========================================

  const emotionCounts = {};

  recognizedStudents.forEach((student) => {
    const emotion =
      student.emotion || "Neutral";

    emotionCounts[emotion] =
      (emotionCounts[emotion] || 0) + 1;
  });

  const totalRecognized =
    recognizedStudents.length;

  const happyCount =
    emotionCounts.happy || 0;

  const neutralCount =
    emotionCounts.neutral || 0;

  const sadCount =
    emotionCounts.sad || 0;

  const angryCount =
    emotionCounts.angry || 0;

  const fearfulCount =
    emotionCounts.fearful || 0;

  const disgustedCount =
    emotionCounts.disgusted || 0;

  const surprisedCount =
    emotionCounts.surprised || 0;

  const percentage = (count) =>
    totalRecognized > 0
      ? Math.round(
          (count / totalRecognized) * 100
        )
      : 0;

  // ==========================================
  // ATTENTION LEVEL
  // ==========================================

  let attentionLevel = "Low";

  if (averageAttention >= 80) {
    attentionLevel = "High";
  } else if (averageAttention >= 60) {
    attentionLevel = "Medium";
  }

  // ==========================================
  // DISTRACTION PERCENTAGE
  // ==========================================

  const distractionPercentage =
    totalRecognized > 0
      ? Math.round(
          (distractedCount /
            totalRecognized) *
            100
        )
      : 0;

  // ==========================================
  // MAIN EMOTION
  // ==========================================

  const mainEmotion =
    liveData?.mainEmotion || "Waiting";

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div style={styles.page}>

      {/* ================================== */}
      {/* SIDEBAR */}
      {/* ================================== */}

      <aside style={styles.sidebar}>

        <div style={styles.logoSection}>

          <div style={styles.logoIcon}>
            🤖
          </div>

          <div>
            <div style={styles.logoTitle}>
              AI CLASSROOM
            </div>

            <div style={styles.logoSubtitle}>
              Teacher Portal
            </div>
          </div>

        </div>

        <nav style={styles.nav}>

          <div style={styles.navTitle}>
            TEACHER MENU
          </div>

          <Link
            to="/dashboard"
            style={styles.navItem}
          >
            🏠 Dashboard
          </Link>

          <Link
            to="/attendance"
            style={styles.navItem}
          >
            📋 Attendance
          </Link>

          <Link
            to="/monitoring"
            style={styles.navItem}
          >
            👁️ Live Monitoring
          </Link>

          <Link
            to="/analytics"
            style={{
              ...styles.navItem,
              ...styles.activeNav,
            }}
          >
            📊 Analytics
          </Link>

          <Link
            to="/reports"
            style={styles.navItem}
          >
            🤖 AI Reports
          </Link>

        </nav>

      </aside>

      {/* ================================== */}
      {/* MAIN */}
      {/* ================================== */}

      <main style={styles.main}>

        {/* HEADER */}
        <header style={styles.header}>

          <div>

            <h1 style={styles.heading}>
              Classroom Analytics
            </h1>

            <p style={styles.welcome}>
              Real-time AI classroom performance
              analysis
            </p>

          </div>

          <div style={styles.statusBox}>

            <span
              style={{
                ...styles.statusDot,
                backgroundColor:
                  monitoringActive
                    ? "#22c55e"
                    : "#94a3b8",
              }}
            />

            {monitoringActive
              ? "Live Analysis"
              : "Analysis Inactive"}

          </div>

        </header>

        {/* ================================== */}
        {/* SUMMARY CARDS */}
        {/* ================================== */}

        <section style={styles.statsGrid}>

          {/* ATTENTION */}
          <div style={styles.card}>

            <div
              style={{
                ...styles.icon,
                background: "#dcfce7",
              }}
            >
              👀
            </div>

            <div>

              <p style={styles.label}>
                Average Attention
              </p>

              <h2 style={styles.value}>
                {averageAttention}%
              </h2>

              <p style={styles.small}>
                {attentionLevel} attention
              </p>

            </div>

          </div>

          {/* STUDENTS */}
          <div style={styles.card}>

            <div
              style={{
                ...styles.icon,
                background: "#dbeafe",
              }}
            >
              👨‍🎓
            </div>

            <div>

              <p style={styles.label}>
                Students Detected
              </p>

              <h2 style={styles.value}>
                {recognizedStudents.length}
              </h2>

              <p style={styles.small}>
                Recognized students
              </p>

            </div>

          </div>

          {/* MAIN EMOTION */}
          <div style={styles.card}>

            <div
              style={{
                ...styles.icon,
                background: "#fef3c7",
              }}
            >
              😊
            </div>

            <div>

              <p style={styles.label}>
                Main Emotion
              </p>

              <h2 style={styles.emotionValue}>
                {mainEmotion}
              </h2>

              <p style={styles.small}>
                Most detected emotion
              </p>

            </div>

          </div>

          {/* DISTRACTION */}
          <div style={styles.card}>

            <div
              style={{
                ...styles.icon,
                background: "#fee2e2",
              }}
            >
              ⚠️
            </div>

            <div>

              <p style={styles.label}>
                Distraction
              </p>

              <h2 style={styles.value}>
                {distractionPercentage}%
              </h2>

              <p style={styles.small}>
                {distractedCount} distracted
              </p>

            </div>

          </div>

        </section>

        {/* ================================== */}
        {/* ATTENTION ANALYSIS */}
        {/* ================================== */}

        <section style={styles.cardLarge}>

          <div style={styles.cardHeader}>

            <div>

              <h2 style={styles.cardTitle}>
                👀 Attention Analysis
              </h2>

              <p style={styles.cardSubtitle}>
                Current classroom attention level
              </p>

            </div>

            <div style={styles.scoreBadge}>
              {attentionLevel}
            </div>

          </div>

          <div style={styles.bigScore}>
            {averageAttention}%
          </div>

          <div style={styles.progressBackground}>

            <div
              style={{
                ...styles.progressBar,
                width: `${Math.min(
                  Number(averageAttention) || 0,
                  100
                )}%`,
              }}
            />

          </div>

          <div style={styles.scaleRow}>

            <span>
              Low
            </span>

            <span>
              Medium
            </span>

            <span>
              High
            </span>

          </div>

        </section>

        {/* ================================== */}
        {/* EMOTION ANALYSIS */}
        {/* ================================== */}

        <section style={styles.cardLarge}>

          <div style={styles.cardHeader}>

            <div>

              <h2 style={styles.cardTitle}>
                😊 Emotion Analysis
              </h2>

              <p style={styles.cardSubtitle}>
                Current detected student emotions
              </p>

            </div>

          </div>

          <div style={styles.emotionGrid}>

            <EmotionBar
              emoji="😊"
              name="Happy"
              value={percentage(happyCount)}
            />

            <EmotionBar
              emoji="😐"
              name="Neutral"
              value={percentage(neutralCount)}
            />

            <EmotionBar
              emoji="😢"
              name="Sad"
              value={percentage(sadCount)}
            />

            <EmotionBar
              emoji="😠"
              name="Angry"
              value={percentage(angryCount)}
            />

            <EmotionBar
              emoji="😨"
              name="Fearful"
              value={percentage(fearfulCount)}
            />

            <EmotionBar
              emoji="🤢"
              name="Disgusted"
              value={percentage(disgustedCount)}
            />

            <EmotionBar
              emoji="😲"
              name="Surprised"
              value={percentage(surprisedCount)}
            />

          </div>

        </section>

        {/* ================================== */}
        {/* STUDENT PERFORMANCE */}
        {/* ================================== */}

        <section style={styles.cardLarge}>

          <div style={styles.cardHeader}>

            <div>

              <h2 style={styles.cardTitle}>
                👨‍🎓 Student Performance
              </h2>

              <p style={styles.cardSubtitle}>
                Individual AI classroom analysis
              </p>

            </div>

          </div>

          {recognizedStudents.length === 0 ? (

            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                🎥
              </div>

              <h3>
                No student data available
              </h3>

              <p>
                Start Live Monitoring to generate
                classroom analytics.
              </p>

            </div>

          ) : (

            <div style={styles.tableWrapper}>

              <table style={styles.table}>

                <thead>

                  <tr>

                    <th style={styles.th}>
                      Student
                    </th>

                    <th style={styles.th}>
                      Attention
                    </th>

                    <th style={styles.th}>
                      Emotion
                    </th>

                    <th style={styles.th}>
                      Distraction
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recognizedStudents.map(
                    (student, index) => (

                      <tr
                        key={
                          student.id || index
                        }
                      >

                        <td style={styles.td}>

                          <strong>
                            {student.name}
                          </strong>

                          {student.rollNo && (
                            <div
                              style={
                                styles.roll
                              }
                            >
                              {student.rollNo}
                            </div>
                          )}

                        </td>

                        <td style={styles.td}>

                          <div
                            style={
                              styles.studentScore
                            }
                          >
                            {student.attentionScore ??
                              0}%
                          </div>

                        </td>

                        <td style={styles.td}>
                          {student.emotion ||
                            "Unknown"}
                        </td>

                        <td style={styles.td}>

                          <span
                            style={
                              student.distraction ===
                              "Distracted"
                                ? styles.distractedBadge
                                : styles.focusedBadge
                            }
                          >
                            {student.distraction ||
                              "Not Available"}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* FOOTER */}
        <footer style={styles.footer}>
          🤖 AI Smart Classroom • Analytics
        </footer>

      </main>

    </div>
  );
}

// ======================================================
// EMOTION BAR COMPONENT
// ======================================================

function EmotionBar({ emoji, name, value }) {
  return (
    <div style={styles.emotionItem}>

      <div style={styles.emotionTop}>

        <span>
          {emoji} {name}
        </span>

        <strong>
          {value}%
        </strong>

      </div>

      <div style={styles.progressBackground}>

        <div
          style={{
            ...styles.progressBar,
            width: `${value}%`,
          }}
        />

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
    background: "#f8fafc",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#0f172a",
  },

  sidebar: {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    width: "235px",
    background: "#0f172a",
    color: "white",
    padding: "22px 15px",
    boxSizing: "border-box",
  },

  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "0 7px 22px",
    borderBottom: "1px solid #334155",
  },

  logoIcon: {
    width: "43px",
    height: "43px",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #2563eb, #7c3aed)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  logoTitle: {
    fontSize: "14px",
    fontWeight: "800",
  },

  logoSubtitle: {
    fontSize: "10px",
    color: "#94a3b8",
    marginTop: "3px",
  },

  nav: {
    paddingTop: "22px",
  },

  navTitle: {
    fontSize: "10px",
    color: "#64748b",
    fontWeight: "800",
    padding: "0 10px 10px",
    letterSpacing: "0.7px",
  },

  navItem: {
    display: "block",
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "11px 12px",
    borderRadius: "9px",
    marginBottom: "5px",
    fontSize: "13px",
  },

  activeNav: {
    background: "#2563eb",
    color: "white",
    fontWeight: "700",
  },

  main: {
    marginLeft: "235px",
    padding: "30px",
    maxWidth: "1500px",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "28px",
  },

  heading: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
  },

  welcome: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  statusBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 14px",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "17px",
    marginBottom: "22px",
  },

  card: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "15px",
    padding: "19px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow:
      "0 4px 15px rgba(15, 23, 42, 0.04)",
  },

  icon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
  },

  label: {
    margin: 0,
    fontSize: "11px",
    color: "#64748b",
    fontWeight: "600",
  },

  value: {
    margin: "4px 0 0",
    fontSize: "25px",
    fontWeight: "800",
  },

  emotionValue: {
    margin: "4px 0 0",
    fontSize: "18px",
    fontWeight: "800",
  },

  small: {
    margin: "3px 0 0",
    fontSize: "10px",
    color: "#94a3b8",
  },

  cardLarge: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "22px",
    marginBottom: "20px",
    boxShadow:
      "0 4px 15px rgba(15, 23, 42, 0.04)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "17px",
    borderBottom: "1px solid #f1f5f9",
    marginBottom: "18px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "17px",
    fontWeight: "800",
  },

  cardSubtitle: {
    margin: "4px 0 0",
    fontSize: "11px",
    color: "#64748b",
  },

  scoreBadge: {
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },

  bigScore: {
    fontSize: "38px",
    fontWeight: "800",
    marginBottom: "12px",
  },

  progressBackground: {
    width: "100%",
    height: "9px",
    background: "#e2e8f0",
    borderRadius: "10px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background:
      "linear-gradient(90deg, #2563eb, #4f46e5)",
    borderRadius: "10px",
    transition: "width 0.5s ease",
  },

  scaleRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "7px",
    color: "#94a3b8",
    fontSize: "10px",
  },

  emotionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  emotionItem: {
    padding: "12px",
    background: "#f8fafc",
    borderRadius: "10px",
  },

  emotionTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "12px",
  },

  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "40px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "12px",
    fontSize: "11px",
    color: "#64748b",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },

  td: {
    padding: "13px 12px",
    fontSize: "12px",
    borderBottom: "1px solid #f1f5f9",
  },

  roll: {
    fontSize: "10px",
    color: "#94a3b8",
    marginTop: "3px",
  },

  studentScore: {
    fontWeight: "800",
    color: "#2563eb",
  },

  distractedBadge: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
  },

  focusedBadge: {
    background: "#dcfce7",
    color: "#15803d",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
  },

  footer: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "10px",
    paddingBottom: "20px",
  },
};

export default Analytics;