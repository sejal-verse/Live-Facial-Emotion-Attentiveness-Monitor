import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [liveData, setLiveData] = useState(null);
  const [attendance, setAttendance] = useState({});

  // ==========================================
  // LOAD LIVE DATA
  // ==========================================

  const loadData = () => {
    const savedLiveData = localStorage.getItem(
      "liveMonitoringData"
    );

    if (savedLiveData) {
      try {
        setLiveData(JSON.parse(savedLiveData));
      } catch (error) {
        console.error("Error loading live data:", error);
      }
    }

    const savedAttendance = localStorage.getItem(
      "classAttendance"
    );

    if (savedAttendance) {
      try {
        setAttendance(JSON.parse(savedAttendance));
      } catch (error) {
        console.error(
          "Error loading attendance:",
          error
        );
      }
    }
  };

  // ==========================================
  // AUTO REFRESH
  // ==========================================

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // LIVE VALUES
  // ==========================================

  const studentsPresent =
    liveData?.studentsPresent ?? 0;

  const averageAttention =
    liveData?.averageAttention ?? 0;

  const mainEmotion =
    liveData?.mainEmotion ?? "Waiting";

  const distracted =
    liveData?.distractedCount ??
    liveData?.distracted ??
    0;

  const monitoringActive =
    liveData?.monitoringActive ?? false;

  const students =
    liveData?.students ?? [];

  // ==========================================
  // TODAY'S ATTENDANCE
  // ==========================================

  const today =
    new Date().toISOString().split("T")[0];

  const todayAttendance =
    attendance[today] || {};

  const totalAttendanceStudents =
    Object.keys(todayAttendance).length;

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}
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
            style={{
              ...styles.navItem,
              ...styles.activeNav,
            }}
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
            style={styles.navItem}
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

      {/* MAIN */}
      <main style={styles.main}>

        {/* HEADER */}
        <header style={styles.header}>

          <div>
            <h1 style={styles.heading}>
              Teacher Dashboard
            </h1>

            <p style={styles.welcome}>
              Welcome, Teacher! 👋
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
              ? "Monitoring Active"
              : "Monitoring Inactive"}

          </div>

        </header>

        {/* ================================== */}
        {/* STAT CARDS */}
        {/* ================================== */}

        <section style={styles.statsGrid}>

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
                Students Present
              </p>

              <h2 style={styles.value}>
                {studentsPresent}
              </h2>

              <p style={styles.small}>
                Currently recognized
              </p>
            </div>

          </div>

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
                Live classroom score
              </p>
            </div>

          </div>

          {/* EMOTION */}
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
                Most detected
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
                Distracted
              </p>

              <h2 style={styles.value}>
                {distracted}
              </h2>

              <p style={styles.small}>
                Students currently distracted
              </p>
            </div>

          </div>

        </section>

        {/* ================================== */}
        {/* CLASSROOM OVERVIEW */}
        {/* ================================== */}

        <section style={styles.largeCard}>

          <div style={styles.cardHeader}>

            <div>
              <h2 style={styles.cardTitle}>
                👁️ Live Classroom Overview
              </h2>

              <p style={styles.cardSubtitle}>
                Real-time AI classroom monitoring
              </p>
            </div>

            <Link
              to="/monitoring"
              style={styles.monitorButton}
            >
              Open Monitoring →
            </Link>

          </div>

          {!monitoringActive ? (
            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                🎥
              </div>

              <h3>
                Monitoring is not active
              </h3>

              <p>
                Start live monitoring to see
                classroom AI data here.
              </p>

              <Link
                to="/monitoring"
                style={styles.startButton}
              >
                START MONITORING
              </Link>

            </div>
          ) : (
            <div>

              {/* LIVE STATUS */}
              <div style={styles.liveBanner}>

                <span style={styles.liveDot} />

                <strong>
                  LIVE
                </strong>

                <span>
                  AI monitoring is currently
                  analyzing the classroom
                </span>

              </div>

              {/* STUDENT TABLE */}
              <div style={styles.tableWrapper}>

                <table style={styles.table}>

                  <thead>
                    <tr>

                      <th style={styles.th}>
                        Student
                      </th>

                      <th style={styles.th}>
                        Recognition
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

                    {students.length === 0 ? (
                      <tr>

                        <td
                          colSpan="5"
                          style={styles.noData}
                        >
                          No students detected
                        </td>

                      </tr>
                    ) : (
                      students.map(
                        (student, index) => (

                          <tr key={student.id || index}>

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

                              <span
                                style={
                                  student.recognized
                                    ? styles.recognizedBadge
                                    : styles.unknownBadge
                                }
                              >
                                {student.recognized
                                  ? "✓ Recognized"
                                  : "Unknown"}
                              </span>

                            </td>

                            <td style={styles.td}>

                              <strong>
                                {student.attentionScore ??
                                  0}%
                              </strong>

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
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>
          )}

        </section>

        {/* ================================== */}
        {/* ATTENDANCE SUMMARY */}
        {/* ================================== */}

        <section style={styles.largeCard}>

          <div style={styles.cardHeader}>

            <div>
              <h2 style={styles.cardTitle}>
                📋 Today's Attendance
              </h2>

              <p style={styles.cardSubtitle}>
                Attendance recorded through AI
                face recognition
              </p>
            </div>

            <Link
              to="/attendance"
              style={styles.monitorButton}
            >
              View Attendance →
            </Link>

          </div>

          <div style={styles.attendanceBox}>

            <div>
              <span style={styles.attendanceNumber}>
                {totalAttendanceStudents}
              </span>

              <span style={styles.attendanceText}>
                students marked present today
              </span>
            </div>

            <div style={styles.attendanceDate}>
              📅 {today}
            </div>

          </div>

        </section>

        {/* FOOTER */}
        <footer style={styles.footer}>
          🤖 AI Smart Classroom • Teacher Dashboard
        </footer>

      </main>

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
    display: "flex",
    flexDirection: "column",
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

  largeCard: {
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
    gap: "15px",
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

  monitorButton: {
    textDecoration: "none",
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
  },

  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "8px",
  },

  startButton: {
    display: "inline-block",
    marginTop: "12px",
    textDecoration: "none",
    background: "#2563eb",
    color: "white",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
  },

  liveBanner: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    padding: "12px 15px",
    borderRadius: "10px",
    marginBottom: "15px",
    fontSize: "12px",
    color: "#166534",
  },

  liveDot: {
    width: "9px",
    height: "9px",
    background: "#22c55e",
    borderRadius: "50%",
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

  recognizedBadge: {
    display: "inline-block",
    background: "#dcfce7",
    color: "#15803d",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
  },

  unknownBadge: {
    display: "inline-block",
    background: "#f1f5f9",
    color: "#64748b",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
  },

  distractedBadge: {
    display: "inline-block",
    background: "#fee2e2",
    color: "#dc2626",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
  },

  focusedBadge: {
    display: "inline-block",
    background: "#dcfce7",
    color: "#15803d",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
  },

  noData: {
    textAlign: "center",
    padding: "30px",
    color: "#94a3b8",
    fontSize: "12px",
  },

  attendanceBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "20px",
  },

  attendanceNumber: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#2563eb",
    marginRight: "10px",
  },

  attendanceText: {
    fontSize: "12px",
    color: "#64748b",
  },

  attendanceDate: {
    fontSize: "11px",
    color: "#64748b",
  },

  footer: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "10px",
    paddingBottom: "20px",
  },
};

export default Dashboard;