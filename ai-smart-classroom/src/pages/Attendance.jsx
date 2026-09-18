import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [search, setSearch] = useState("");

  // ================= LOAD STUDENTS =================
  const loadStudents = () => {
    const registeredStudents = JSON.parse(
      localStorage.getItem("registeredStudents") || "[]"
    );

    setStudents(registeredStudents);
  };

  // ================= LOAD ATTENDANCE =================
  const loadAttendance = () => {
    const savedAttendance = JSON.parse(
      localStorage.getItem("classAttendance") || "{}"
    );

    setAttendance(savedAttendance);
  };

  useEffect(() => {
    loadStudents();
    loadAttendance();

    // Refresh automatically
    const interval = setInterval(() => {
      loadStudents();
      loadAttendance();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ================= TODAY'S ATTENDANCE =================
  const todayAttendance =
    attendance[selectedDate] || {};

  // ================= FILTER STUDENTS =================
  const filteredStudents = students.filter((student) => {
    const text = search.toLowerCase();

    return (
      (student.name || "")
        .toLowerCase()
        .includes(text) ||
      (student.rollNo || "")
        .toLowerCase()
        .includes(text) ||
      (student.email || "")
        .toLowerCase()
        .includes(text)
    );
  });

  // ================= COUNTS =================
  const presentCount = students.filter(
    (student) =>
      todayAttendance[student.name] === "Present"
  ).length;

  const absentCount =
    students.length - presentCount;

  const attendancePercentage =
    students.length > 0
      ? Math.round(
          (presentCount / students.length) * 100
        )
      : 0;

  return (
    <div style={styles.app}>

      {/* ================= SIDEBAR ================= */}
      <aside style={styles.sidebar}>

        <div style={styles.logoSection}>

          <div style={styles.logoIcon}>
            🤖
          </div>

          <div>
            <h2 style={styles.logoTitle}>
              AI CLASSROOM
            </h2>

            <p style={styles.logoSubtitle}>
              Smart Learning System
            </p>
          </div>

        </div>

        <div style={styles.menuTitle}>
          MAIN MENU
        </div>

        <nav>

          <Link
            to="/dashboard"
            style={styles.menuItem}
          >
            <span style={styles.menuIcon}>📊</span>
            Dashboard
          </Link>

          <Link
            to="/students"
            style={styles.menuItem}
          >
            <span style={styles.menuIcon}>👥</span>
            Students
          </Link>

          <Link
            to="/attendance"
            style={{
              ...styles.menuItem,
              ...styles.activeMenuItem,
            }}
          >
            <span style={styles.menuIcon}>📋</span>
            Attendance
          </Link>

          <Link
            to="/monitoring"
            style={styles.menuItem}
          >
            <span style={styles.menuIcon}>🎥</span>
            Monitoring
          </Link>

          <Link
            to="/analytics"
            style={styles.menuItem}
          >
            <span style={styles.menuIcon}>📈</span>
            Analytics
          </Link>

          <Link
            to="/reports"
            style={styles.menuItem}
          >
            <span style={styles.menuIcon}>🤖</span>
            AI Reports
          </Link>

        </nav>

        {/* AI BOX */}
        <div style={styles.sidebarBottom}>

          <div style={styles.aiBox}>

            <div style={styles.aiIcon}>
              ✨
            </div>

            <div>
              <strong>
                AI Monitoring
              </strong>

              <p style={styles.aiText}>
                Face recognition attendance
              </p>
            </div>

          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}
      <main style={styles.main}>

        {/* HEADER */}
        <header style={styles.header}>

          <div>

            <h1 style={styles.heading}>
              Smart Attendance
            </h1>

            <p style={styles.subtitle}>
              Face-recognition based classroom attendance
            </p>

          </div>

          <Link
            to="/monitoring"
            style={styles.monitorButton}
          >
            🎥 Open Monitoring
          </Link>

        </header>

        {/* ================= DATE + SEARCH ================= */}
        <section style={styles.controlPanel}>

          <div>

            <label style={styles.label}>
              Select Date
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(e.target.value)
              }
              style={styles.dateInput}
            />

          </div>

          <div style={styles.searchBox}>

            <label style={styles.label}>
              Search Student
            </label>

            <input
              type="text"
              placeholder="Search by name, roll number..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={styles.searchInput}
            />

          </div>

        </section>

        {/* ================= STAT CARDS ================= */}
        <section style={styles.cards}>

          <div style={styles.card}>

            <div style={styles.cardIcon}>
              👥
            </div>

            <div>
              <p style={styles.cardLabel}>
                TOTAL STUDENTS
              </p>

              <h2 style={styles.cardNumber}>
                {students.length}
              </h2>
            </div>

          </div>

          <div style={styles.card}>

            <div
              style={{
                ...styles.cardIcon,
                backgroundColor: "#dcfce7",
              }}
            >
              ✅
            </div>

            <div>
              <p style={styles.cardLabel}>
                PRESENT
              </p>

              <h2 style={styles.cardNumber}>
                {presentCount}
              </h2>
            </div>

          </div>

          <div style={styles.card}>

            <div
              style={{
                ...styles.cardIcon,
                backgroundColor: "#fee2e2",
              }}
            >
              ❌
            </div>

            <div>
              <p style={styles.cardLabel}>
                ABSENT
              </p>

              <h2 style={styles.cardNumber}>
                {absentCount}
              </h2>
            </div>

          </div>

          <div style={styles.card}>

            <div
              style={{
                ...styles.cardIcon,
                backgroundColor: "#dbeafe",
              }}
            >
              📊
            </div>

            <div>
              <p style={styles.cardLabel}>
                ATTENDANCE
              </p>

              <h2 style={styles.cardNumber}>
                {attendancePercentage}%
              </h2>
            </div>

          </div>

        </section>

        {/* ================= ATTENDANCE TABLE ================= */}
        <section style={styles.panel}>

          <div style={styles.panelHeader}>

            <div>

              <h2 style={styles.panelTitle}>
                Student Attendance
              </h2>

              <p style={styles.panelSubtitle}>
                Attendance for {selectedDate}
              </p>

            </div>

            <span style={styles.liveBadge}>
              ● LIVE DATA
            </span>

          </div>

          {students.length === 0 ? (

            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                👥
              </div>

              <h3>
                No students registered
              </h3>

              <p>
                Register students first to view
                attendance.
              </p>

              <Link
                to="/students"
                style={styles.primaryButton}
              >
                Register Student
              </Link>

            </div>

          ) : filteredStudents.length === 0 ? (

            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                🔍
              </div>

              <h3>
                No student found
              </h3>

              <p>
                Try another name or roll number.
              </p>

            </div>

          ) : (

            <div style={styles.tableContainer}>

              <table style={styles.table}>

                <thead>

                  <tr>

                    <th style={styles.th}>
                      Student
                    </th>

                    <th style={styles.th}>
                      Roll Number
                    </th>

                    <th style={styles.th}>
                      Department
                    </th>

                    <th style={styles.th}>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredStudents.map(
                    (student, index) => {

                      const status =
                        todayAttendance[
                          student.name
                        ] || "Absent";

                      return (
                        <tr
                          key={
                            student.id || index
                          }
                        >

                          {/* STUDENT */}
                          <td style={styles.td}>

                            <div
                              style={
                                styles.studentInfo
                              }
                            >

                              <div
                                style={
                                  styles.studentAvatar
                                }
                              >
                                {student.name
                                  ? student.name
                                      .charAt(0)
                                      .toUpperCase()
                                  : "S"}
                              </div>

                              <div>

                                <strong>
                                  {student.name ||
                                    "Student"}
                                </strong>

                                <p
                                  style={
                                    styles.email
                                  }
                                >
                                  {student.email ||
                                    "No email"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* ROLL NUMBER */}
                          <td style={styles.td}>
                            {student.rollNo || "—"}
                          </td>

                          {/* DEPARTMENT */}
                          <td style={styles.td}>
                            {student.department ||
                              "—"}
                          </td>

                          {/* STATUS */}
                          <td style={styles.td}>

                            {status ===
                            "Present" ? (

                              <span
                                style={
                                  styles.presentBadge
                                }
                              >
                                ✓ Present
                              </span>

                            ) : (

                              <span
                                style={
                                  styles.absentBadge
                                }
                              >
                                ✕ Absent
                              </span>

                            )}

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* ================= INFO ================= */}
        <section style={styles.infoBox}>

          <div style={styles.infoIcon}>
            🤖
          </div>

          <div>

            <h3 style={styles.infoTitle}>
              AI Attendance System
            </h3>

            <p style={styles.infoText}>
              Attendance is automatically updated when
              registered students are recognized by the
              camera during Live Monitoring.
            </p>

          </div>

          <Link
            to="/monitoring"
            style={styles.infoButton}
          >
            Start Monitoring →
          </Link>

        </section>

      </main>

    </div>
  );
}


/* =========================================================
   STYLES
========================================================= */

const styles = {

  app: {
    minHeight: "100vh",
    display: "flex",
    backgroundColor: "#f8fafc",
    fontFamily:
      "Inter, Arial, Helvetica, sans-serif",
    color: "#0f172a",
  },

  /* SIDEBAR */

  sidebar: {
    width: "250px",
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #0f172a 0%, #172554 100%)",
    color: "white",
    padding: "24px 16px",
    boxSizing: "border-box",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
  },

  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "5px 8px 28px",
    borderBottom:
      "1px solid rgba(255,255,255,0.1)",
  },

  logoIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg,#2563eb,#7c3aed)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  logoTitle: {
    margin: 0,
    fontSize: "16px",
    letterSpacing: "1px",
  },

  logoSubtitle: {
    margin: "3px 0 0",
    fontSize: "10px",
    color: "#94a3b8",
  },

  menuTitle: {
    fontSize: "10px",
    color: "#64748b",
    letterSpacing: "1.5px",
    margin: "28px 10px 10px",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "13px 14px",
    marginBottom: "6px",
    borderRadius: "10px",
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },

  activeMenuItem: {
    background:
      "linear-gradient(90deg,#2563eb,#4f46e5)",
    color: "#ffffff",
    boxShadow:
      "0 5px 15px rgba(37,99,235,0.25)",
  },

  menuIcon: {
    width: "22px",
    textAlign: "center",
    fontSize: "18px",
  },

  sidebarBottom: {
    position: "absolute",
    bottom: "20px",
    left: "16px",
    right: "16px",
  },

  aiBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    borderRadius: "12px",
    background:
      "rgba(255,255,255,0.06)",
  },

  aiIcon: {
    fontSize: "20px",
  },

  aiText: {
    margin: "3px 0 0",
    color: "#94a3b8",
    fontSize: "10px",
  },

  /* MAIN */

  main: {
    marginLeft: "250px",
    width: "calc(100% - 250px)",
    padding: "30px 35px",
    boxSizing: "border-box",
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
    fontWeight: "700",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  monitorButton: {
    textDecoration: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "11px 17px",
    borderRadius: "9px",
    fontSize: "13px",
    fontWeight: "600",
  },

  /* CONTROLS */

  controlPanel: {
    display: "flex",
    gap: "20px",
    alignItems: "end",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "15px",
    padding: "18px 20px",
    marginBottom: "22px",
  },

  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    color: "#64748b",
    marginBottom: "6px",
  },

  dateInput: {
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
  },

  searchBox: {
    flex: 1,
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
  },

  /* CARDS */

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "18px",
    marginBottom: "22px",
  },

  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "15px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.04)",
  },

  cardIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "11px",
    backgroundColor: "#dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  cardLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "0.7px",
  },

  cardNumber: {
    margin: "5px 0 0",
    fontSize: "25px",
  },

  /* PANEL */

  panel: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "15px",
    padding: "22px",
    marginBottom: "22px",
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.04)",
  },

  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  panelTitle: {
    margin: 0,
    fontSize: "18px",
  },

  panelSubtitle: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: "11px",
  },

  liveBadge: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
    padding: "7px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
  },

  /* TABLE */

  tableContainer: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom:
      "1px solid #e2e8f0",
    color: "#64748b",
    fontSize: "11px",
    textTransform: "uppercase",
  },

  td: {
    padding: "14px 12px",
    borderBottom:
      "1px solid #f1f5f9",
    fontSize: "13px",
  },

  studentInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  studentAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },

  email: {
    margin: "3px 0 0",
    color: "#94a3b8",
    fontSize: "10px",
  },

  presentBadge: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
  },

  absentBadge: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
  },

  /* EMPTY */

  emptyState: {
    textAlign: "center",
    padding: "45px",
    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "45px",
    marginBottom: "10px",
  },

  primaryButton: {
    display: "inline-block",
    marginTop: "10px",
    textDecoration: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
  },

  /* INFO */

  infoBox: {
    background:
      "linear-gradient(135deg,#eff6ff,#eef2ff)",
    border: "1px solid #dbeafe",
    borderRadius: "15px",
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  infoIcon: {
    fontSize: "32px",
  },

  infoTitle: {
    margin: 0,
    fontSize: "15px",
  },

  infoText: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  infoButton: {
    marginLeft: "auto",
    textDecoration: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "9px 13px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "600",
  },
};

export default Attendance;