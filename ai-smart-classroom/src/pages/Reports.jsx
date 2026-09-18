import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Reports() {
  const [liveData, setLiveData] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    const loadData = () => {
      const savedLiveData = JSON.parse(
        localStorage.getItem("liveMonitoringData") || "null"
      );

      const savedAttendance = JSON.parse(
        localStorage.getItem("classAttendance") || "{}"
      );

      setLiveData(savedLiveData);
      setAttendanceData(savedAttendance);
    };

    loadData();

    const interval = setInterval(loadData, 1000);

    return () => clearInterval(interval);
  }, []);

  const students = liveData?.students || [];

  const recognizedStudents = students.filter(
    (student) => student.recognized
  );

  const totalStudents = students.length;

  const studentsPresent =
    liveData?.studentsPresent ?? recognizedStudents.length;

  const averageAttention = liveData?.averageAttention ?? 0;

  const distractedCount =
    liveData?.distractedCount ?? liveData?.distracted ?? 0;

  const monitoringActive = liveData?.monitoringActive ?? false;

  // =========================
  // TODAY'S ATTENDANCE
  // =========================

  const today = new Date().toISOString().split("T")[0];

  const todayAttendance = attendanceData[today] || {};

  const attendancePresent = Object.values(todayAttendance).filter(
    (status) => status === "Present"
  ).length;

  const attendanceTotal = Object.keys(todayAttendance).length;

  const attendancePercentage =
    attendanceTotal > 0
      ? Math.round((attendancePresent / attendanceTotal) * 100)
      : 0;

  // =========================
  // EMOTION ANALYSIS
  // =========================

  const emotionCounts = {};

  recognizedStudents.forEach((student) => {
    const emotion = student.emotion || "neutral";
    const key = emotion.toLowerCase();

    emotionCounts[key] = (emotionCounts[key] || 0) + 1;
  });

  let mainEmotion = "Waiting";

  if (Object.keys(emotionCounts).length > 0) {
    mainEmotion = Object.entries(emotionCounts).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    mainEmotion =
      mainEmotion.charAt(0).toUpperCase() +
      mainEmotion.slice(1);
  }

  // =========================
  // DISTRACTION
  // =========================

  const distractionPercentage =
    recognizedStudents.length > 0
      ? Math.round(
          (distractedCount / recognizedStudents.length) * 100
        )
      : 0;

  // =========================
  // ATTENTION LEVEL
  // =========================

  let attentionLevel = "Low";

  if (averageAttention >= 80) {
    attentionLevel = "High";
  } else if (averageAttention >= 60) {
    attentionLevel = "Medium";
  }

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}
      <aside style={styles.sidebar}>

        <div style={styles.logo}>
          <div style={styles.logoIcon}>AI</div>

          <div>
            <h2 style={styles.logoTitle}>AI CLASSROOM</h2>
            <p style={styles.logoSub}>Teacher Panel</p>
          </div>
        </div>

        <nav style={styles.nav}>

          <Link to="/dashboard" style={styles.navItem}>
            🏠 Dashboard
          </Link>

          <Link to="/attendance" style={styles.navItem}>
            📋 Attendance
          </Link>

          <Link to="/monitoring" style={styles.navItem}>
            🎥 Monitoring
          </Link>

          <Link to="/analytics" style={styles.navItem}>
            📊 Analytics
          </Link>

          <Link
            to="/reports"
            style={{
              ...styles.navItem,
              ...styles.activeNav,
            }}
          >
            📄 AI Reports
          </Link>

        </nav>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>

        {/* HEADER */}
        <div style={styles.header}>

          <div>
            <h1 style={styles.heading}>
              AI Reports
            </h1>

            <p style={styles.subtitle}>
              AI-generated classroom performance report
            </p>
          </div>

          <div
            style={{
              ...styles.status,
              background: monitoringActive
                ? "#dcfce7"
                : "#f1f5f9",
              color: monitoringActive
                ? "#15803d"
                : "#64748b",
            }}
          >
            ●{" "}
            {monitoringActive
              ? "Monitoring Active"
              : "Monitoring Inactive"}
          </div>

        </div>

        {/* SUMMARY CARDS */}
        <section style={styles.cardGrid}>

          <div style={styles.card}>
            <div style={styles.cardIcon}>👨‍🎓</div>

            <div>
              <p style={styles.cardLabel}>
                Students Present
              </p>

              <h2 style={styles.cardValue}>
                {studentsPresent}
              </h2>

              <p style={styles.cardSmall}>
                {totalStudents} registered students
              </p>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardIcon}>📅</div>

            <div>
              <p style={styles.cardLabel}>
                Today's Attendance
              </p>

              <h2 style={styles.cardValue}>
                {attendancePercentage}%
              </h2>

              <p style={styles.cardSmall}>
                {attendancePresent} present
              </p>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardIcon}>🎯</div>

            <div>
              <p style={styles.cardLabel}>
                Average Attention
              </p>

              <h2 style={styles.cardValue}>
                {averageAttention}%
              </h2>

              <p style={styles.cardSmall}>
                Level: {attentionLevel}
              </p>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardIcon}>😊</div>

            <div>
              <p style={styles.cardLabel}>
                Main Emotion
              </p>

              <h2 style={styles.cardValue}>
                {mainEmotion}
              </h2>

              <p style={styles.cardSmall}>
                Based on detected students
              </p>
            </div>
          </div>

        </section>

        {/* AI CLASSROOM SUMMARY */}
        <section style={styles.reportBox}>

          <div style={styles.reportHeader}>

            <h2 style={styles.sectionTitle}>
              🤖 AI Classroom Summary
            </h2>

            <p style={styles.sectionSub}>
              Current classroom insights generated from live monitoring
            </p>

          </div>

          <div style={styles.summaryGrid}>

            <div style={styles.summaryItem}>
              <span style={styles.summaryIcon}>🎯</span>

              <div>
                <strong>Attention</strong>

                <p style={styles.summaryText}>
                  Average classroom attention is{" "}
                  <b>{averageAttention}%</b>.
                </p>
              </div>
            </div>

            <div style={styles.summaryItem}>
              <span style={styles.summaryIcon}>😊</span>

              <div>
                <strong>Emotion</strong>

                <p style={styles.summaryText}>
                  The most common detected emotion is{" "}
                  <b>{mainEmotion}</b>.
                </p>
              </div>
            </div>

            <div style={styles.summaryItem}>
              <span style={styles.summaryIcon}>⚠️</span>

              <div>
                <strong>Distraction</strong>

                <p style={styles.summaryText}>
                  <b>{distractedCount}</b>{" "}
                  student
                  {distractedCount !== 1 ? "s are" : " is"}{" "}
                  currently distracted.
                </p>
              </div>
            </div>

            <div style={styles.summaryItem}>
              <span style={styles.summaryIcon}>📋</span>

              <div>
                <strong>Attendance</strong>

                <p style={styles.summaryText}>
                  Today's recorded attendance is{" "}
                  <b>{attendancePercentage}%</b>.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* STUDENT PERFORMANCE */}
        <section style={styles.reportBox}>

          <h2 style={styles.sectionTitle}>
            👨‍🎓 Student Performance Report
          </h2>

          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>
                <tr>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Roll No.</th>
                  <th style={styles.th}>Attendance</th>
                  <th style={styles.th}>Attention</th>
                  <th style={styles.th}>Emotion</th>
                  <th style={styles.th}>Distraction</th>
                </tr>
              </thead>

              <tbody>

                {recognizedStudents.length > 0 ? (

                  recognizedStudents.map((student) => (

                    <tr key={student.id}>

                      <td style={styles.td}>
                        <strong>{student.name}</strong>
                      </td>

                      <td style={styles.td}>
                        {student.rollNo || "-"}
                      </td>

                      <td style={styles.td}>

                        <span style={styles.presentBadge}>
                          {student.attendance || "Present"}
                        </span>

                      </td>

                      <td style={styles.td}>

                        <span
                          style={{
                            ...styles.attentionBadge,
                            background:
                              student.attentionScore >= 80
                                ? "#dcfce7"
                                : student.attentionScore >= 60
                                ? "#fef3c7"
                                : "#fee2e2",
                            color:
                              student.attentionScore >= 80
                                ? "#15803d"
                                : student.attentionScore >= 60
                                ? "#a16207"
                                : "#dc2626",
                          }}
                        >
                          {student.attentionScore ?? 0}%
                        </span>

                      </td>

                      <td style={styles.td}>
                        {student.emotion || "Neutral"}
                      </td>

                      <td style={styles.td}>

                        <span
                          style={{
                            ...styles.distractionBadge,
                            background:
                              student.distraction === "Distracted"
                                ? "#fee2e2"
                                : "#dcfce7",
                            color:
                              student.distraction === "Distracted"
                                ? "#dc2626"
                                : "#15803d",
                          }}
                        >
                          {student.distraction ||
                            "Not Distracted"}
                        </span>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td
                      colSpan="6"
                      style={styles.empty}
                    >
                      No recognized students yet.
                      Start monitoring to generate the AI report.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>
        </section>

        {/* CLASSROOM INSIGHTS */}
        <section style={styles.insightBox}>

          <h2 style={styles.sectionTitle}>
            💡 Classroom Insights
          </h2>

          <div style={styles.insights}>

            <div>
              <strong>Attention Level</strong>

              <p>
                {attentionLevel === "High"
                  ? "Students are showing a high level of attention."
                  : attentionLevel === "Medium"
                  ? "Students are showing a moderate level of attention."
                  : "Attention level is currently low or insufficient data is available."}
              </p>
            </div>

            <div>
              <strong>Distraction Rate</strong>

              <p>
                Current distraction rate:{" "}
                <b>{distractionPercentage}%</b>
              </p>
            </div>

            <div>
              <strong>Monitoring Status</strong>

              <p>
                {monitoringActive
                  ? "The classroom is currently being monitored by the AI system."
                  : "Live monitoring is currently stopped."}
              </p>
            </div>

          </div>
        </section>

        {/* FOOTER */}
        <footer style={styles.footer}>

          <p>
            AI Smart Classroom • AI Reports
          </p>

          <p>
            Last updated:{" "}
            {liveData?.updatedAt
              ? new Date(
                  liveData.updatedAt
                ).toLocaleTimeString()
              : "Waiting for data"}
          </p>

        </footer>

      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "Arial, sans-serif",
    color: "#0f172a",
  },

  sidebar: {
    position: "fixed",
    left: 0,
    top: 0,
    width: "230px",
    height: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "25px 15px",
    boxSizing: "border-box",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "40px",
  },

  logoIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  logoTitle: {
    margin: 0,
    fontSize: "15px",
  },

  logoSub: {
    margin: "3px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  navItem: {
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "13px 14px",
    borderRadius: "8px",
    fontSize: "14px",
  },

  activeNav: {
    background: "#2563eb",
    color: "white",
  },

  main: {
    marginLeft: "230px",
    padding: "30px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  heading: {
    margin: 0,
    fontSize: "30px",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#64748b",
  },

  status: {
    padding: "10px 15px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "bold",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
    marginBottom: "22px",
  },

  card: {
    background: "white",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    gap: "15px",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  cardIcon: {
    fontSize: "27px",
  },

  cardLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  cardValue: {
    margin: "5px 0",
    fontSize: "25px",
  },

  cardSmall: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "11px",
  },

  reportBox: {
    background: "white",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "22px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  reportHeader: {
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "20px",
  },

  sectionSub: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
  },

  summaryItem: {
    background: "#f8fafc",
    padding: "18px",
    borderRadius: "10px",
    display: "flex",
    gap: "15px",
  },

  summaryIcon: {
    fontSize: "24px",
  },

  summaryText: {
    color: "#64748b",
    fontSize: "13px",
  },

  tableWrapper: {
    overflowX: "auto",
    marginTop: "18px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "13px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "13px",
  },

  td: {
    padding: "14px 13px",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "13px",
  },

  presentBadge: {
    background: "#dcfce7",
    color: "#15803d",
    padding: "5px 9px",
    borderRadius: "15px",
    fontSize: "11px",
    fontWeight: "bold",
  },

  attentionBadge: {
    padding: "5px 9px",
    borderRadius: "15px",
    fontSize: "11px",
    fontWeight: "bold",
  },

  distractionBadge: {
    padding: "5px 9px",
    borderRadius: "15px",
    fontSize: "11px",
    fontWeight: "bold",
  },

  empty: {
    textAlign: "center",
    padding: "30px",
    color: "#64748b",
  },

  insightBox: {
    background: "#eff6ff",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "25px",
  },

  insights: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "18px",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    color: "#94a3b8",
    fontSize: "12px",
    padding: "10px 0 20px",
  },
};

export default Reports;