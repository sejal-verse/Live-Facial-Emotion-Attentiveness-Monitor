import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [liveData, setLiveData] = useState(null);

  // ==================================================
  // LOAD STUDENT DATA
  // ==================================================

  useEffect(() => {
    const savedStudent = localStorage.getItem("loggedInStudent");

    if (!savedStudent) {
      navigate("/student-login");
      return;
    }

    const studentData = JSON.parse(savedStudent);
    setStudent(studentData);

    loadAttendance(studentData);
    loadLiveData();
  }, [navigate]);

  // ==================================================
  // REFRESH LIVE DATA + ATTENDANCE
  // ==================================================

  useEffect(() => {
    if (!student) return;

    const interval = setInterval(() => {
      loadAttendance(student);
      loadLiveData();
    }, 1000);

    return () => clearInterval(interval);
  }, [student]);

  // ==================================================
  // LOAD LIVE MONITORING DATA
  // ==================================================

  const loadLiveData = () => {
    const savedLiveData = localStorage.getItem(
      "liveMonitoringData"
    );

    if (savedLiveData) {
      try {
        setLiveData(JSON.parse(savedLiveData));
      } catch (error) {
        console.error(
          "Error loading live monitoring data:",
          error
        );
      }
    }
  };

  // ==================================================
  // LOAD ATTENDANCE
  // ==================================================

  const loadAttendance = (studentData) => {
    const savedAttendance = JSON.parse(
      localStorage.getItem("classAttendance") || "{}"
    );

    const result = [];

    Object.keys(savedAttendance).forEach((date) => {
      const studentStatus =
        savedAttendance[date]?.[studentData.name];

      if (studentStatus) {
        result.push({
          date,
          status: studentStatus,
        });
      }
    });

    result.sort(
      (a, b) =>
        new Date(b.date) - new Date(a.date)
    );

    setAttendance(result);
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem("loggedInStudent");
    navigate("/student-login");
  };

  // ==================================================
  // CALCULATE ATTENDANCE
  // ==================================================

  const totalClasses = attendance.length;

  const presentClasses = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absentClasses = attendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const attendancePercentage =
    totalClasses > 0
      ? Math.round(
          (presentClasses / totalClasses) * 100
        )
      : 0;

  // ==================================================
  // GET STUDENT LIVE DATA
  // ==================================================

  let studentLiveData = null;

  if (liveData && student) {
    if (liveData.studentPerformance) {
      studentLiveData =
        liveData.studentPerformance.find(
          (item) =>
            item.name?.toLowerCase() ===
            student.name?.toLowerCase()
        );
    }
  }

  const attention =
    studentLiveData?.attention ??
    student?.attention ??
    0;

  const emotion =
    studentLiveData?.emotion ??
    student?.emotion ??
    "Not Available";

  const distraction =
    studentLiveData?.distraction ??
    student?.distraction ??
    "Not Available";

  const monitoringActive =
    liveData?.monitoringActive || false;

  // ==================================================
  // LOADING
  // ==================================================

  if (!student) {
    return (
      <div style={styles.loading}>
        Loading Student Dashboard...
      </div>
    );
  }

  // ==================================================
  // DASHBOARD
  // ==================================================

  return (
    <div style={styles.page}>

      {/* ============================================ */}
      {/* SIDEBAR */}
      {/* ============================================ */}

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
              Student Portal
            </div>
          </div>

        </div>

        {/* STUDENT PROFILE */}
        <div style={styles.profileBox}>

          {student.photo ? (
            <img
              src={student.photo}
              alt="Student"
              style={styles.profileImage}
            />
          ) : (
            <div style={styles.profileInitial}>
              {student.name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>
          )}

          <div style={styles.profileInfo}>

            <strong style={styles.profileName}>
              {student.name}
            </strong>

            <span style={styles.profileRole}>
              Student
            </span>

          </div>

        </div>

        {/* NAVIGATION */}
        <nav style={styles.nav}>

          <div style={styles.navTitle}>
            MY CLASSROOM
          </div>

          <Link
            to="/student-dashboard"
            style={{
              ...styles.navItem,
              ...styles.activeNav,
            }}
          >
            🏠 Dashboard
          </Link>

          <a
            href="#profile"
            style={styles.navItem}
          >
            👤 My Profile
          </a>

          <a
            href="#attendance"
            style={styles.navItem}
          >
            📋 My Attendance
          </a>

          <a
            href="#performance"
            style={styles.navItem}
          >
            📊 My Performance
          </a>

        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          style={styles.logoutButton}
        >
          🚪 Logout
        </button>

      </aside>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}

      <main style={styles.main}>

        {/* HEADER */}
        <header style={styles.header}>

          <div>
            <h1 style={styles.heading}>
              Student Dashboard
            </h1>

            <p style={styles.welcome}>
              Welcome back, {student.name}! 👋
            </p>
          </div>

          <div style={styles.classStatus}>

            <span
              style={{
                ...styles.statusDot,
                backgroundColor: monitoringActive
                  ? "#22c55e"
                  : "#94a3b8",
              }}
            />

            {monitoringActive
              ? "Class Monitoring Active"
              : "Class Not Active"}

          </div>

        </header>

        {/* ======================================== */}
        {/* PERFORMANCE CARDS */}
        {/* ======================================== */}

        <section
          id="performance"
          style={styles.statsGrid}
        >

          {/* ATTENDANCE */}
          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                background: "#dbeafe",
              }}
            >
              📋
            </div>

            <div>
              <p style={styles.statLabel}>
                My Attendance
              </p>

              <h2 style={styles.statValue}>
                {attendancePercentage}%
              </h2>

              <p style={styles.statSmall}>
                {presentClasses} present classes
              </p>
            </div>

          </div>

          {/* ATTENTION */}
          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                background: "#dcfce7",
              }}
            >
              👀
            </div>

            <div>
              <p style={styles.statLabel}>
                Attention Score
              </p>

              <h2 style={styles.statValue}>
                {attention}%
              </h2>

              <p style={styles.statSmall}>
                During monitoring
              </p>
            </div>

          </div>

          {/* EMOTION */}
          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                background: "#fef3c7",
              }}
            >
              😊
            </div>

            <div>
              <p style={styles.statLabel}>
                Current Emotion
              </p>

              <h2 style={styles.emotionValue}>
                {emotion}
              </h2>

              <p style={styles.statSmall}>
                AI detected
              </p>
            </div>

          </div>

          {/* DISTRACTION */}
          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                background: "#fee2e2",
              }}
            >
              ⚠️
            </div>

            <div>
              <p style={styles.statLabel}>
                Distraction
              </p>

              <h2 style={styles.emotionValue}>
                {distraction}
              </h2>

              <p style={styles.statSmall}>
                Current status
              </p>
            </div>

          </div>

        </section>

        {/* ======================================== */}
        {/* PROFILE + PERFORMANCE */}
        {/* ======================================== */}

        <section
          id="profile"
          style={styles.twoColumn}
        >

          {/* PROFILE */}
          <div style={styles.card}>

            <div style={styles.cardHeader}>

              <div>
                <h2 style={styles.cardTitle}>
                  👤 My Details
                </h2>

                <p style={styles.cardSubtitle}>
                  Your registered student information
                </p>
              </div>

            </div>

            <div style={styles.profileDetails}>

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>
                  Full Name
                </span>

                <strong style={styles.detailValue}>
                  {student.name}
                </strong>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>
                  Roll Number
                </span>

                <strong style={styles.detailValue}>
                  {student.rollNo}
                </strong>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>
                  Email
                </span>

                <strong style={styles.detailValue}>
                  {student.email}
                </strong>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>
                  Phone
                </span>

                <strong style={styles.detailValue}>
                  {student.phone}
                </strong>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>
                  Department
                </span>

                <strong style={styles.detailValue}>
                  {student.department}
                </strong>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>
                  Semester
                </span>

                <strong style={styles.detailValue}>
                  {student.semester}
                </strong>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>
                  Account Status
                </span>

                <span style={styles.activeBadge}>
                  ● Active
                </span>
              </div>

            </div>

          </div>

          {/* AI PERFORMANCE */}
          <div style={styles.card}>

            <div style={styles.cardHeader}>

              <div>
                <h2 style={styles.cardTitle}>
                  🤖 AI Class Performance
                </h2>

                <p style={styles.cardSubtitle}>
                  Your latest classroom analysis
                </p>
              </div>

            </div>

            {/* ATTENTION */}
            <div style={styles.performanceItem}>

              <div style={styles.performanceTop}>

                <span>
                  👀 Attention
                </span>

                <strong>
                  {attention}%
                </strong>

              </div>

              <div style={styles.progressBackground}>

                <div
                  style={{
                    ...styles.progressBar,
                    width: `${Math.min(
                      Number(attention) || 0,
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

            {/* ATTENDANCE */}
            <div style={styles.performanceItem}>

              <div style={styles.performanceTop}>

                <span>
                  📋 Attendance
                </span>

                <strong>
                  {attendancePercentage}%
                </strong>

              </div>

              <div style={styles.progressBackground}>

                <div
                  style={{
                    ...styles.progressBar,
                    width: `${attendancePercentage}%`,
                  }}
                />

              </div>

            </div>

            {/* EMOTION */}
            <div style={styles.aiBox}>

              <span style={styles.aiEmoji}>
                😊
              </span>

              <div>
                <strong>
                  Current Emotion
                </strong>

                <p style={styles.aiText}>
                  {emotion}
                </p>
              </div>

            </div>

            {/* DISTRACTION */}
            <div style={styles.aiBox}>

              <span style={styles.aiEmoji}>
                🎯
              </span>

              <div>
                <strong>
                  Distraction Status
                </strong>

                <p style={styles.aiText}>
                  {distraction}
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* ======================================== */}
        {/* ATTENDANCE HISTORY */}
        {/* ======================================== */}

        <section
          id="attendance"
          style={styles.card}
        >

          <div style={styles.cardHeader}>

            <div>
              <h2 style={styles.cardTitle}>
                📅 My Attendance History
              </h2>

              <p style={styles.cardSubtitle}>
                Your recorded classroom attendance
              </p>
            </div>

            <div style={styles.attendanceSummary}>
              {presentClasses} / {totalClasses} Classes Present
            </div>

          </div>

          {attendance.length === 0 ? (
            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                📋
              </div>

              <h3>
                No Attendance Records Yet
              </h3>

              <p>
                Your attendance will appear here
                after you attend a monitored class.
              </p>

            </div>
          ) : (
            <div style={styles.tableWrapper}>

              <table style={styles.table}>

                <thead>

                  <tr>

                    <th style={styles.th}>
                      Date
                    </th>

                    <th style={styles.th}>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {attendance.map(
                    (record, index) => (

                      <tr key={index}>

                        <td style={styles.td}>
                          {record.date}
                        </td>

                        <td style={styles.td}>

                          <span
                            style={
                              record.status ===
                              "Present"
                                ? styles.presentBadge
                                : styles.absentBadge
                            }
                          >

                            {record.status ===
                            "Present"
                              ? "✓ Present"
                              : "✕ Absent"}

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

        {/* ======================================== */}
        {/* PERFORMANCE MESSAGE */}
        {/* ======================================== */}

        <section style={styles.performanceMessage}>

          <div style={styles.messageIcon}>
            💡
          </div>

          <div>

            <h3 style={styles.messageTitle}>
              Keep improving your classroom performance!
            </h3>

            <p style={styles.messageText}>
              Attend classes regularly and stay focused
              during lectures. Your AI classroom analytics
              will help you understand your attendance,
              attention and classroom engagement.
            </p>

          </div>

        </section>

        {/* FOOTER */}
        <footer style={styles.footer}>
          🤖 AI Smart Classroom • Student Dashboard
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

  profileBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "20px 7px",
    borderBottom: "1px solid #334155",
  },

  profileImage: {
    width: "43px",
    height: "43px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #60a5fa",
  },

  profileInitial: {
    width: "43px",
    height: "43px",
    borderRadius: "50%",
    background: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "18px",
  },

  profileInfo: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },

  profileName: {
    fontSize: "13px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  profileRole: {
    fontSize: "11px",
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

  logoutButton: {
    marginTop: "auto",
    width: "100%",
    border: "1px solid #334155",
    background: "transparent",
    color: "#cbd5e1",
    padding: "11px",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
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

  classStatus: {
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

  statCard: {
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

  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
  },

  statLabel: {
    margin: 0,
    fontSize: "11px",
    color: "#64748b",
    fontWeight: "600",
  },

  statValue: {
    margin: "4px 0 0",
    fontSize: "25px",
    fontWeight: "800",
  },

  emotionValue: {
    margin: "4px 0 0",
    fontSize: "18px",
    fontWeight: "800",
  },

  statSmall: {
    margin: "3px 0 0",
    fontSize: "10px",
    color: "#94a3b8",
  },

  twoColumn: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1fr) minmax(0, 1fr)",
    gap: "20px",
    marginBottom: "20px",
  },

  card: {
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
    marginBottom: "15px",
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

  profileDetails: {
    display: "flex",
    flexDirection: "column",
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    padding: "11px 0",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "12px",
  },

  detailLabel: {
    color: "#64748b",
  },

  detailValue: {
    textAlign: "right",
    maxWidth: "65%",
    wordBreak: "break-word",
  },

  activeBadge: {
    color: "#059669",
    fontWeight: "700",
  },

  performanceItem: {
    marginBottom: "21px",
  },

  performanceTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "13px",
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

  aiBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    background: "#f8fafc",
    borderRadius: "10px",
    marginTop: "10px",
    fontSize: "12px",
  },

  aiEmoji: {
    fontSize: "23px",
  },

  aiText: {
    margin: "3px 0 0",
    color: "#64748b",
  },

  attendanceSummary: {
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "7px 11px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
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

  presentBadge: {
    display: "inline-block",
    background: "#dcfce7",
    color: "#15803d",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
  },

  absentBadge: {
    display: "inline-block",
    background: "#fee2e2",
    color: "#dc2626",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
  },

  emptyState: {
    textAlign: "center",
    padding: "45px 20px",
    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "38px",
    marginBottom: "8px",
  },

  performanceMessage: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "14px",
    padding: "17px",
    marginBottom: "25px",
  },

  messageIcon: {
    fontSize: "25px",
  },

  messageTitle: {
    margin: 0,
    fontSize: "14px",
    color: "#1e40af",
  },

  messageText: {
    margin: "5px 0 0",
    color: "#475569",
    fontSize: "11px",
    lineHeight: "1.6",
  },

  footer: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "10px",
    paddingBottom: "20px",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    color: "#475569",
  },
};

export default StudentDashboard;