import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [liveData, setLiveData] = useState(null);
  const [showStudents, setShowStudents] = useState(false);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [joinedStudents, setJoinedStudents] = useState([]);
  const [studentMonitoring, setStudentMonitoring] = useState([]);

  // ==========================================
  // LOAD LIVE MONITORING DATA
  // ==========================================

  const loadData = () => {
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
    } else {
      setLiveData(null);
    }
  };

  // ==========================================
  // LOAD REGISTERED STUDENTS
  // ==========================================

  const loadRegisteredStudents = () => {
    const savedStudents =
      localStorage.getItem("registeredStudents");

    if (savedStudents) {
      try {
        setRegisteredStudents(JSON.parse(savedStudents));
      } catch (error) {
        console.error(
          "Error loading registered students:",
          error
        );
        setRegisteredStudents([]);
      }
    } else {
      setRegisteredStudents([]);
    }
  };

  // ==========================================
  // LOAD ACTIVE CLASS + LIVE STUDENT MONITORING
  // ==========================================

  const loadClassMonitoring = () => {
    try {
      const activeClass = JSON.parse(
        localStorage.getItem("activeClass") || "null"
      );
      const monitoring = JSON.parse(
        localStorage.getItem("liveMonitoringData") || "{}"
      );

      const joined = activeClass && Array.isArray(activeClass.joinedStudents)
        ? activeClass.joinedStudents
        : [];
      const monitored = Array.isArray(monitoring.students)
        ? monitoring.students
        : [];

      setJoinedStudents(joined);
      setStudentMonitoring(monitored);
    } catch (error) {
      console.error("Error loading class monitoring:", error);
      setJoinedStudents([]);
      setStudentMonitoring([]);
    }
  };

  // ==========================================
  // AUTO REFRESH
  // ==========================================

  useEffect(() => {
    loadData();
    loadRegisteredStudents();
    loadClassMonitoring();

    const interval = setInterval(() => {
      loadData();
      loadRegisteredStudents();
      loadClassMonitoring();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // DELETE STUDENT
  // ==========================================

  const deleteStudent = (studentId) => {
    const student = registeredStudents.find(
      (item) => item.id === studentId
    );

    if (!student) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmDelete) return;

    const updatedStudents = registeredStudents.filter(
      (item) => item.id !== studentId
    );

    localStorage.setItem(
      "registeredStudents",
      JSON.stringify(updatedStudents)
    );

    setRegisteredStudents(updatedStudents);
  };

  // ==========================================
  // LIVE VALUES
  // ==========================================

  const studentsPresent =
    liveData?.studentsPresent ?? 0;

  const averageAttention =
    liveData?.averageAttention ?? 0;

  const mainEmotion =
    liveData?.mainEmotion ?? "Not Monitoring";

  const distracted =
    liveData?.distractedCount ??
    liveData?.distracted ??
    0;

  const monitoringActive =
    liveData?.monitoringActive ?? false;

  const students =
    liveData?.students ?? [];

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div style={styles.page}>

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside style={styles.sidebar}>

        {/* LOGO */}

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

        {/* NAVIGATION */}

        <nav style={styles.nav}>

          <div style={styles.navTitle}>
            TEACHER MENU
          </div>

          {/* DASHBOARD */}

          <button
            onClick={() => setShowStudents(false)}
            style={{
              ...styles.navItem,
              ...(showStudents
                ? {}
                : styles.activeNav),
            }}
          >
            🏠 Dashboard
          </button>

          {/* STUDENTS */}

          <button
            onClick={() => setShowStudents(true)}
            style={{
              ...styles.navItem,
              ...(showStudents
                ? styles.activeNav
                : {}),
            }}
          >
            👨‍🎓 Students
          </button>

          {/* CREATE CLASS */}

          <Link
            to="/create-class"
            style={styles.navItem}
          >
            🔗 Create Class
          </Link>

          {/* ATTENDANCE */}

          <Link
            to="/attendance"
            style={styles.navItem}
          >
            📋 Attendance
          </Link>

          {/* MONITORING */}

          <Link
            to="/monitoring"
            style={styles.navItem}
          >
            👁️ Live Monitoring
          </Link>

          {/* ANALYTICS */}

          <Link
            to="/analytics"
            style={styles.navItem}
          >
            📊 Analytics
          </Link>

          {/* REPORTS */}

          <Link
            to="/reports"
            style={styles.navItem}
          >
            🤖 AI Reports
          </Link>

        </nav>

      </aside>

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main style={styles.main}>

        {showStudents ? (

          /* =================================
             REGISTERED STUDENTS
          ================================= */

          <>

            {/* HEADER */}

            <header style={styles.header}>

              <div>

                <h1 style={styles.heading}>
                  Registered Students
                </h1>

                <p style={styles.welcome}>
                  View all students registered in your classroom
                </p>

              </div>

              <div style={styles.totalBox}>

                <span style={styles.totalNumber}>
                  {registeredStudents.length}
                </span>

                <span style={styles.totalText}>
                  Students
                </span>

              </div>

            </header>

            {/* LIVE STUDENT MONITORING */}

            <section style={styles.monitoringSection}>

              <div style={styles.monitoringHeader}>
                <div>
                  <h2 style={styles.monitoringTitle}>
                    🧠 Live Student Monitoring
                  </h2>
                  <p style={styles.monitoringSubtitle}>
                    Attention, distraction and AI warning status from the active class
                  </p>
                </div>
                <div style={styles.liveBadge}>
                  <span style={styles.liveDot}></span> LIVE
                </div>
              </div>

              {joinedStudents.length === 0 ? (
                <div style={styles.monitoringEmpty}>
                  No students have joined the active class yet.
                </div>
              ) : (
                <div style={styles.monitoringGrid}>
                  {joinedStudents.map((student) => {
                    const data = studentMonitoring.find(
                      (item) =>
                        String(item.id) === String(student.id) ||
                        String(item.rollNo || "") === String(student.rollNo || "")
                    );

                    const attention = data?.attention ?? 0;
                    const distraction = data?.distraction || "Waiting";
                    const warnings = data?.warningCount ?? 0;

                    return (
                      <div key={student.id} style={styles.monitoringCard}>
                        <div style={styles.monitoringStudentTop}>
                          <div style={styles.monitoringAvatar}>
                            {student.name?.charAt(0)?.toUpperCase() || "S"}
                          </div>
                          <div>
                            <h3 style={styles.monitoringStudentName}>
                              {student.name}
                            </h3>
                            <p style={styles.monitoringRoll}>
                              Roll No: {student.rollNo || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div style={styles.monitoringStats}>
                          <div style={styles.monitoringStat}>
                            <span>🎯 Attention</span>
                            <strong>{attention}%</strong>
                          </div>
                          <div style={styles.monitoringStat}>
                            <span>⚠️ Distraction</span>
                            <strong>{distraction}</strong>
                          </div>
                          <div style={styles.monitoringStat}>
                            <span>🔔 Warnings</span>
                            <strong>{warnings}</strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </section>

            {/* STUDENT DETAILS */}

            <section style={styles.studentSection}>

              <div style={styles.studentSectionHeader}>

                <div>

                  <h2 style={styles.studentSectionTitle}>
                    👨‍🎓 Student Details
                  </h2>

                  <p style={styles.studentSectionSubtitle}>
                    Information provided during student registration
                  </p>

                </div>

              </div>

              {registeredStudents.length === 0 ? (

                <div style={styles.emptyStudentState}>

                  <div style={styles.emptyStudentIcon}>
                    👨‍🎓
                  </div>

                  <h3 style={styles.emptyStudentTitle}>
                    No students registered
                  </h3>

                  <p style={styles.emptyStudentText}>
                    Students who register will appear here.
                  </p>

                </div>

              ) : (

                <div style={styles.studentGrid}>

                  {registeredStudents.map((student) => (

                    <div
                      key={student.id}
                      style={styles.studentCard}
                    >

                      {/* PROFILE */}

                      <div style={styles.profileSection}>

                        {student.photo ? (

                          <img
                            src={student.photo}
                            alt={student.name}
                            style={styles.profileImage}
                          />

                        ) : (

                          <div style={styles.profilePlaceholder}>
                            👤
                          </div>

                        )}

                        <div>

                          <h3 style={styles.studentName}>
                            {student.name}
                          </h3>

                          <p style={styles.rollNumber}>
                            Roll No:{" "}
                            {student.rollNo ||
                              "Not Available"}
                          </p>

                        </div>

                      </div>

                      {/* DETAILS */}

                      <div style={styles.details}>

                        <div style={styles.detailRow}>

                          <span style={styles.detailLabel}>
                            📧 Email
                          </span>

                          <span style={styles.detailValue}>
                            {student.email ||
                              "Not Available"}
                          </span>

                        </div>

                        <div style={styles.detailRow}>

                          <span style={styles.detailLabel}>
                            📱 Phone
                          </span>

                          <span style={styles.detailValue}>
                            {student.phone ||
                              "Not Available"}
                          </span>

                        </div>

                        <div style={styles.detailRow}>

                          <span style={styles.detailLabel}>
                            🎓 Department
                          </span>

                          <span style={styles.detailValue}>
                            {student.department ||
                              "Not Available"}
                          </span>

                        </div>

                        <div style={styles.detailRow}>

                          <span style={styles.detailLabel}>
                            📚 Semester
                          </span>

                          <span style={styles.detailValue}>
                            {student.semester ||
                              "Not Available"}
                          </span>

                        </div>

                        <div style={styles.detailRow}>

                          <span style={styles.detailLabel}>
                            🟢 Status
                          </span>

                          <span style={styles.status}>
                            {student.status ||
                              "Registered"}
                          </span>

                        </div>

                      </div>

                      {/* DELETE */}

                      <button
                        onClick={() =>
                          deleteStudent(student.id)
                        }
                        style={styles.deleteButton}
                      >
                        🗑️ Delete Student
                      </button>

                    </div>

                  ))}

                </div>

              )}

            </section>

          </>

        ) : (

          /* =================================
             MAIN DASHBOARD
          ================================= */

          <>

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

              {/* MONITORING STATUS */}

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

            {/* =====================================
                STAT CARDS
            ===================================== */}

            <section style={styles.statsGrid}>

              {/* STUDENTS PRESENT */}

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

            {/* =====================================
                LIVE CLASSROOM OVERVIEW
            ===================================== */}

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

              {/* MONITORING NOT ACTIVE */}

              {!monitoringActive ? (

                <div style={styles.emptyState}>

                  <div style={styles.emptyIcon}>
                    🎥
                  </div>

                  <h3 style={styles.emptyTitle}>
                    Monitoring is not active
                  </h3>

                  <p style={styles.emptyText}>
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

                /* MONITORING ACTIVE */

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

                              <tr
                                key={
                                  student.id ||
                                  index
                                }
                              >

                                {/* STUDENT */}

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
                                      Roll No:{" "}
                                      {student.rollNo}
                                    </div>

                                  )}

                                </td>

                                {/* RECOGNITION */}

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

                                {/* ATTENTION */}

                                <td style={styles.td}>

                                  <strong>
                                    {student.attentionScore ??
                                      student.attention ??
                                      0}
                                    %
                                  </strong>

                                </td>

                                {/* EMOTION */}

                                <td style={styles.td}>

                                  {student.emotion ||
                                    "Unknown"}

                                </td>

                                {/* DISTRACTION */}

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

            {/* =====================================
                QUICK ACCESS
            ===================================== */}

            <section style={styles.quickSection}>

              <h2 style={styles.quickTitle}>
                Quick Access
              </h2>

              <div style={styles.quickGrid}>

                {/* STUDENTS */}

                <button
                  onClick={() =>
                    setShowStudents(true)
                  }
                  style={styles.quickCard}
                >

                  <div
                    style={{
                      ...styles.quickIcon,
                      background: "#dbeafe",
                    }}
                  >
                    👨‍🎓
                  </div>

                  <div>

                    <h3 style={styles.quickCardTitle}>
                      Students
                    </h3>

                    <p style={styles.quickCardText}>
                      View registered students
                    </p>

                  </div>

                </button>

                {/* ATTENDANCE */}

                <Link
                  to="/attendance"
                  style={styles.quickCard}
                >

                  <div
                    style={{
                      ...styles.quickIcon,
                      background: "#dcfce7",
                    }}
                  >
                    📋
                  </div>

                  <div>

                    <h3 style={styles.quickCardTitle}>
                      Attendance
                    </h3>

                    <p style={styles.quickCardText}>
                      View classroom attendance
                    </p>

                  </div>

                </Link>

                {/* ANALYTICS */}

                <Link
                  to="/analytics"
                  style={styles.quickCard}
                >

                  <div
                    style={{
                      ...styles.quickIcon,
                      background: "#fef3c7",
                    }}
                  >
                    📊
                  </div>

                  <div>

                    <h3 style={styles.quickCardTitle}>
                      Analytics
                    </h3>

                    <p style={styles.quickCardText}>
                      View AI classroom analytics
                    </p>

                  </div>

                </Link>

                {/* REPORTS */}

                <Link
                  to="/reports"
                  style={styles.quickCard}
                >

                  <div
                    style={{
                      ...styles.quickIcon,
                      background: "#ede9fe",
                    }}
                  >
                    🤖
                  </div>

                  <div>

                    <h3 style={styles.quickCardTitle}>
                      AI Reports
                    </h3>

                    <p style={styles.quickCardText}>
                      Generate classroom reports
                    </p>

                  </div>

                </Link>

              </div>

            </section>

            {/* FOOTER */}

            <footer style={styles.footer}>
              🤖 AI Smart Classroom • Teacher Dashboard
            </footer>

          </>

        )}

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

  // ==========================================
  // SIDEBAR
  // ==========================================

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
    borderBottom:
      "1px solid #334155",
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
    width: "100%",
    boxSizing: "border-box",
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "11px 12px",
    borderRadius: "9px",
    marginBottom: "5px",
    fontSize: "13px",
    background: "transparent",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontFamily: "inherit",
  },

  activeNav: {
    background: "#2563eb",
    color: "white",
    fontWeight: "700",
  },

  // ==========================================
  // MAIN
  // ==========================================

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
    border:
      "1px solid #e2e8f0",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },

  // ==========================================
  // TOTAL STUDENTS BOX
  // ==========================================

  totalBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "white",
    border:
      "1px solid #e2e8f0",
    padding: "10px 17px",
    borderRadius: "12px",
  },

  totalNumber: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#2563eb",
  },

  totalText: {
    fontSize: "12px",
    color: "#64748b",
  },

  // ==========================================
  // STAT CARDS
  // ==========================================

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "17px",
    marginBottom: "22px",
  },

  card: {
    background: "white",
    border:
      "1px solid #e2e8f0",
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

  // ==========================================
  // LARGE CARD
  // ==========================================

  largeCard: {
    background: "white",
    border:
      "1px solid #e2e8f0",
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
    borderBottom:
      "1px solid #f1f5f9",
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

  // ==========================================
  // EMPTY MONITORING
  // ==========================================

  emptyState: {
    textAlign: "center",
    padding: "55px 20px",
    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "8px",
  },

  emptyTitle: {
    color: "#64748b",
    margin: "5px 0",
  },

  emptyText: {
    margin: "5px 0",
    color: "#64748b",
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

  // ==========================================
  // LIVE MONITORING
  // ==========================================

  liveBanner: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#f0fdf4",
    border:
      "1px solid #bbf7d0",
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

  // ==========================================
  // TABLE
  // ==========================================

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
    borderBottom:
      "1px solid #e2e8f0",
  },

  td: {
    padding: "13px 12px",
    fontSize: "12px",
    borderBottom:
      "1px solid #f1f5f9",
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

  // ==========================================
  // REGISTERED STUDENTS
  // ==========================================

  monitoringSection: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "22px",
    marginBottom: "28px",
    boxShadow: "0 8px 25px rgba(15, 23, 42, 0.05)",
  },

  monitoringHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "18px",
  },

  monitoringTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
  },

  monitoringSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 11px",
    borderRadius: "20px",
    background: "#f0fdf4",
    color: "#15803d",
    fontSize: "11px",
    fontWeight: "800",
  },

  liveDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#22c55e",
  },

  monitoringGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "14px",
  },

  monitoringCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "13px",
    padding: "16px",
    background: "#f8fafc",
  },

  monitoringStudentTop: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "14px",
  },

  monitoringAvatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontWeight: "800",
  },

  monitoringStudentName: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "800",
  },

  monitoringRoll: {
    margin: "3px 0 0",
    color: "#64748b",
    fontSize: "11px",
  },

  monitoringStats: {
    display: "grid",
    gap: "8px",
  },

  monitoringStat: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "9px 10px",
    background: "white",
    borderRadius: "8px",
    fontSize: "12px",
  },

  monitoringEmpty: {
    padding: "22px",
    textAlign: "center",
    color: "#64748b",
    background: "#f8fafc",
    borderRadius: "10px",
  },

  studentSection: {
    background: "white",
    border:
      "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "22px",
    boxShadow:
      "0 4px 15px rgba(15, 23, 42, 0.04)",
  },

  studentSectionHeader: {
    paddingBottom: "17px",
    borderBottom:
      "1px solid #f1f5f9",
    marginBottom: "20px",
  },

  studentSectionTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
  },

  studentSectionSubtitle: {
    margin: "5px 0 0",
    fontSize: "11px",
    color: "#64748b",
  },

  emptyStudentState: {
    textAlign: "center",
    padding: "70px 20px",
  },

  emptyStudentIcon: {
    fontSize: "50px",
    marginBottom: "10px",
  },

  emptyStudentTitle: {
    margin: "5px 0",
    fontSize: "18px",
  },

  emptyStudentText: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  studentGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },

  studentCard: {
    border:
      "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "18px",
    background: "#ffffff",
  },

  profileSection: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    paddingBottom: "15px",
    borderBottom:
      "1px solid #f1f5f9",
  },

  profileImage: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #dbeafe",
  },

  profilePlaceholder: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "#dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
  },

  studentName: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "800",
  },

  rollNumber: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "11px",
  },

  details: {
    paddingTop: "12px",
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    padding: "9px 0",
    borderBottom:
      "1px solid #f1f5f9",
  },

  detailLabel: {
    color: "#64748b",
    fontSize: "11px",
    flexShrink: 0,
  },

  detailValue: {
    color: "#0f172a",
    fontSize: "11px",
    fontWeight: "600",
    textAlign: "right",
    wordBreak: "break-word",
  },

  status: {
    color: "#16a34a",
    fontSize: "11px",
    fontWeight: "700",
  },

  deleteButton: {
    width: "100%",
    marginTop: "15px",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#fee2e2",
    color: "#dc2626",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
  },

  // ==========================================
  // QUICK ACCESS
  // ==========================================

  quickSection: {
    marginBottom: "25px",
  },

  quickTitle: {
    fontSize: "18px",
    marginBottom: "15px",
    fontWeight: "800",
  },

  quickGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "15px",
  },

  quickCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "17px",
    background: "white",
    border:
      "1px solid #e2e8f0",
    borderRadius: "13px",
    textDecoration: "none",
    color: "#0f172a",
    boxShadow:
      "0 4px 15px rgba(15, 23, 42, 0.04)",
    borderStyle: "solid",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
  },

  quickIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  quickCardTitle: {
    margin: 0,
    fontSize: "13px",
    fontWeight: "800",
  },

  quickCardText: {
    margin: "4px 0 0",
    fontSize: "10px",
    color: "#64748b",
  },

  // ==========================================
  // FOOTER
  // ==========================================

  footer: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "10px",
    paddingBottom: "20px",
  },

};

export default Dashboard;