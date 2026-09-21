import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Analytics() {
  const [liveData, setLiveData] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [students, setStudents] = useState([]);

  // ==========================================
  // LOAD ALL ANALYTICS DATA
  // ==========================================

  const loadData = () => {
    try {
      const savedLiveData = localStorage.getItem(
        "liveMonitoringData"
      );

      const savedAttendance = localStorage.getItem(
        "classAttendance"
      );

      const savedStudents = localStorage.getItem(
        "registeredStudents"
      );

      if (savedLiveData) {
        setLiveData(JSON.parse(savedLiveData));
      } else {
        setLiveData(null);
      }

      if (savedAttendance) {
        setAttendance(JSON.parse(savedAttendance));
      } else {
        setAttendance({});
      }

      if (savedStudents) {
        setStudents(JSON.parse(savedStudents));
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error(
        "Error loading analytics data:",
        error
      );
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
  // LIVE MONITORING DATA
  // ==========================================

  const liveStudents =
    liveData?.students || [];

  const recognizedStudents =
    liveStudents.filter(
      (student) => student.recognized
    );

  const studentPerformance =
    liveData?.studentPerformance || [];

  const monitoringActive =
    liveData?.monitoringActive ?? false;

  const averageAttention =
    Number(liveData?.averageAttention) || 0;

  const distractedCount =
    Number(
      liveData?.distractedCount ??
        liveData?.distracted ??
        0
    );

  // ==========================================
  // EMOTION ANALYSIS
  // ==========================================

  const emotionCounts = {
    happy: 0,
    neutral: 0,
    sad: 0,
    angry: 0,
    fearful: 0,
    disgusted: 0,
    surprised: 0,
  };

  recognizedStudents.forEach((student) => {
    const emotion = (
      student.emotion || "neutral"
    ).toLowerCase();

    if (
      Object.prototype.hasOwnProperty.call(
        emotionCounts,
        emotion
      )
    ) {
      emotionCounts[emotion]++;
    }
  });

  const totalRecognized =
    recognizedStudents.length;

  const emotionPercentage = (count) =>
    totalRecognized > 0
      ? Math.round(
          (count / totalRecognized) * 100
        )
      : 0;

  // ==========================================
  // MAIN EMOTION
  // ==========================================

  const mainEmotion =
    liveData?.mainEmotion ||
    getMainEmotion(emotionCounts);

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
  // DISTRACTION
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
  // ATTENDANCE ANALYTICS
  // ==========================================

  const attendanceDates =
    Object.keys(attendance);

  const totalAttendanceDays =
    attendanceDates.length;

  const getPresentDays = (student) => {
    return attendanceDates.filter(
      (date) =>
        attendance[date]?.[student.name] ===
        "Present"
    ).length;
  };

  const getAttendancePercentage = (student) => {
    if (totalAttendanceDays === 0) {
      return 0;
    }

    return Math.round(
      (getPresentDays(student) /
        totalAttendanceDays) *
        100
    );
  };

  const overallAttendance =
    students.length > 0 &&
    totalAttendanceDays > 0
      ? Math.round(
          students.reduce(
            (total, student) =>
              total +
              getAttendancePercentage(student),
            0
          ) / students.length
        )
      : 0;

  // ==========================================
  // ATTENDANCE CATEGORIES
  // ==========================================

  const goodAttendance = students.filter(
    (student) =>
      getAttendancePercentage(student) >= 75
  ).length;

  const averageAttendance = students.filter(
    (student) => {
      const percentage =
        getAttendancePercentage(student);

      return (
        percentage >= 50 &&
        percentage < 75
      );
    }
  ).length;

  const poorAttendance = students.filter(
    (student) =>
      getAttendancePercentage(student) < 50
  ).length;

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
            to="/students"
            style={styles.navItem}
          >
            👥 Students
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

          <div style={styles.headerRight}>

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

            <Link
              to="/monitoring"
              style={styles.monitorButton}
            >
              🎥 Monitoring
            </Link>

          </div>

        </header>

        {/* ================================== */}
        {/* SUMMARY CARDS */}
        {/* ================================== */}

        <section style={styles.statsGrid}>

          {/* ATTENDANCE */}

          <div style={styles.card}>

            <div
              style={{
                ...styles.icon,
                background: "#dbeafe",
              }}
            >
              📋
            </div>

            <div>

              <p style={styles.label}>
                Overall Attendance
              </p>

              <h2 style={styles.value}>
                {overallAttendance}%
              </h2>

              <p style={styles.small}>
                {totalAttendanceDays} day
                {totalAttendanceDays !== 1
                  ? "s"
                  : ""}{" "}
                tracked
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
                {Math.round(averageAttention)}%
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
                background: "#ede9fe",
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
                {students.length} registered
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
        {/* CLASSROOM OVERVIEW */}
        {/* ================================== */}

        <section style={styles.cardLarge}>

          <div style={styles.cardHeader}>

            <div>

              <h2 style={styles.cardTitle}>
                📊 Classroom Overview
              </h2>

              <p style={styles.cardSubtitle}>
                Current AI-generated classroom
                performance
              </p>

            </div>

            <span style={styles.liveBadge}>
              {monitoringActive
                ? "● LIVE"
                : "○ OFFLINE"}
            </span>

          </div>

          <div style={styles.overviewGrid}>

            <MetricBox
              icon="👀"
              title="Attention"
              value={`${Math.round(
                averageAttention
              )}%`}
              description={attentionLevel}
              percentage={averageAttention}
              type="attention"
            />

            <MetricBox
              icon="⚠️"
              title="Distraction"
              value={`${distractionPercentage}%`}
              description={
                distractionPercentage >= 40
                  ? "High"
                  : distractionPercentage >= 20
                  ? "Medium"
                  : "Low"
              }
              percentage={distractionPercentage}
              type="distraction"
            />

            <MetricBox
              icon="😊"
              title="Main Emotion"
              value={mainEmotion}
              description="Most detected emotion"
              percentage={
                totalRecognized > 0
                  ? emotionPercentage(
                      emotionCounts[
                        String(
                          mainEmotion
                        ).toLowerCase()
                      ] || 0
                    )
                  : 0
              }
              type="emotion"
            />

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
            {Math.round(averageAttention)}%
          </div>

          <div style={styles.progressBackground}>

            <div
              style={{
                ...styles.progressBar,
                width: `${Math.min(
                  Math.max(
                    Number(averageAttention) || 0,
                    0
                  ),
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
                Distribution of currently detected
                student emotions
              </p>

            </div>

          </div>

          <div style={styles.emotionGrid}>

            <EmotionBar
              emoji="😊"
              name="Happy"
              value={emotionPercentage(
                emotionCounts.happy
              )}
            />

            <EmotionBar
              emoji="😐"
              name="Neutral"
              value={emotionPercentage(
                emotionCounts.neutral
              )}
            />

            <EmotionBar
              emoji="😢"
              name="Sad"
              value={emotionPercentage(
                emotionCounts.sad
              )}
            />

            <EmotionBar
              emoji="😠"
              name="Angry"
              value={emotionPercentage(
                emotionCounts.angry
              )}
            />

            <EmotionBar
              emoji="😨"
              name="Fearful"
              value={emotionPercentage(
                emotionCounts.fearful
              )}
            />

            <EmotionBar
              emoji="🤢"
              name="Disgusted"
              value={emotionPercentage(
                emotionCounts.disgusted
              )}
            />

            <EmotionBar
              emoji="😲"
              name="Surprised"
              value={emotionPercentage(
                emotionCounts.surprised
              )}
            />

          </div>

        </section>

        {/* ================================== */}
        {/* ATTENDANCE DISTRIBUTION */}
        {/* ================================== */}

        <section style={styles.cardLarge}>

          <div style={styles.cardHeader}>

            <div>

              <h2 style={styles.cardTitle}>
                📋 Attendance Distribution
              </h2>

              <p style={styles.cardSubtitle}>
                Student attendance performance
              </p>

            </div>

          </div>

          <div style={styles.attendanceDistribution}>

            <AttendanceBox
              icon="🟢"
              title="Good Attendance"
              value={goodAttendance}
              description="75% and above"
              styleType="good"
            />

            <AttendanceBox
              icon="🟡"
              title="Average"
              value={averageAttendance}
              description="50% - 74%"
              styleType="average"
            />

            <AttendanceBox
              icon="🔴"
              title="Poor Attendance"
              value={poorAttendance}
              description="Below 50%"
              styleType="poor"
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

          {recognizedStudents.length === 0 &&
          studentPerformance.length === 0 ? (

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

              <Link
                to="/monitoring"
                style={styles.primaryButton}
              >
                Start Monitoring
              </Link>

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

                    <th style={styles.th}>
                      Attendance
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {students.map(
                    (student, index) => {

                      const performance =
                        studentPerformance.find(
                          (item) =>
                            item.id ===
                              student.id ||
                            (
                              item.name &&
                              student.name &&
                              item.name.toLowerCase() ===
                                student.name.toLowerCase()
                            )
                        );

                      const recognized =
                        recognizedStudents.find(
                          (item) =>
                            item.id ===
                              student.id
                        );

                      const attention =
                        performance?.attention ??
                        performance?.attentionScore ??
                        recognized?.attention ??
                        recognized?.attentionScore ??
                        0;

                      const emotion =
                        performance?.emotion ??
                        recognized?.emotion ??
                        "Unknown";

                      const distraction =
                        performance?.distraction ??
                        recognized?.distraction ??
                        "Not Available";

                      const attendancePercent =
                        getAttendancePercentage(
                          student
                        );

                      return (

                        <tr
                          key={
                            student.id || index
                          }
                        >

                          <td style={styles.td}>

                            <div
                              style={
                                styles.studentCell
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

                                <div
                                  style={
                                    styles.roll
                                  }
                                >
                                  {student.rollNo ||
                                    "No roll number"}
                                </div>

                              </div>

                            </div>

                          </td>

                          <td style={styles.td}>

                            <div
                              style={
                                styles.attentionCell
                              }
                            >

                              <strong>
                                {Math.round(
                                  Number(
                                    attention
                                  ) || 0
                                )}
                                %
                              </strong>

                              <div
                                style={
                                  styles.miniProgress
                                }
                              >

                                <div
                                  style={{
                                    ...styles.miniProgressFill,
                                    width: `${Math.min(
                                      Math.max(
                                        Number(
                                          attention
                                        ) || 0,
                                        0
                                      ),
                                      100
                                    )}%`,
                                  }}
                                />

                              </div>

                            </div>

                          </td>

                          <td style={styles.td}>

                            <span
                              style={
                                styles.emotionBadge
                              }
                            >
                              {getEmotionEmoji(
                                emotion
                              )}{" "}
                              {emotion}
                            </span>

                          </td>

                          <td style={styles.td}>

                            <span
                              style={
                                distraction ===
                                "Distracted"
                                  ? styles.distractedBadge
                                  : styles.focusedBadge
                              }
                            >
                              {distraction ||
                                "Not Available"}
                            </span>

                          </td>

                          <td style={styles.td}>

                            <span
                              style={{
                                ...styles.attendanceBadge,
                                ...getAttendanceBadgeStyle(
                                  attendancePercent
                                ),
                              }}
                            >
                              {attendancePercent}%
                            </span>

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

        {/* ================================== */}
        {/* FOOTER */}
        {/* ================================== */}

        <footer style={styles.footer}>
          🤖 AI Smart Classroom • Real-time Analytics
        </footer>

      </main>

    </div>
  );
}

// ======================================================
// GET MAIN EMOTION
// ======================================================

function getMainEmotion(emotionCounts) {
  const entries = Object.entries(emotionCounts);

  if (
    entries.every(
      ([, count]) => count === 0
    )
  ) {
    return "Waiting";
  }

  entries.sort((a, b) => b[1] - a[1]);

  const emotion = entries[0][0];

  return (
    emotion.charAt(0).toUpperCase() +
    emotion.slice(1)
  );
}

// ======================================================
// EMOTION EMOJI
// ======================================================

function getEmotionEmoji(emotion) {
  const value = String(
    emotion || ""
  ).toLowerCase();

  const emojis = {
    happy: "😊",
    neutral: "😐",
    sad: "😢",
    angry: "😠",
    fearful: "😨",
    disgusted: "🤢",
    surprised: "😲",
  };

  return emojis[value] || "🙂";
}

// ======================================================
// METRIC BOX
// ======================================================

function MetricBox({
  icon,
  title,
  value,
  description,
  percentage,
  type,
}) {
  return (
    <div style={styles.metricBox}>

      <div style={styles.metricTop}>

        <span style={styles.metricIcon}>
          {icon}
        </span>

        <div>

          <p style={styles.metricTitle}>
            {title}
          </p>

          <h3 style={styles.metricValue}>
            {value}
          </h3>

        </div>

      </div>

      <div style={styles.metricProgressBackground}>

        <div
          style={{
            ...styles.metricProgress,
            background:
              type === "distraction"
                ? "linear-gradient(90deg,#f59e0b,#ef4444)"
                : "linear-gradient(90deg,#2563eb,#4f46e5)",
            width: `${Math.min(
              Math.max(
                Number(percentage) || 0,
                0
              ),
              100
            )}%`,
          }}
        />

      </div>

      <p style={styles.metricDescription}>
        {description}
      </p>

    </div>
  );
}

// ======================================================
// EMOTION BAR
// ======================================================

function EmotionBar({
  emoji,
  name,
  value,
}) {
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
// ATTENDANCE BOX
// ======================================================

function AttendanceBox({
  icon,
  title,
  value,
  description,
  styleType,
}) {
  const colorStyles = {
    good: {
      background: "#f0fdf4",
      border: "#bbf7d0",
      text: "#15803d",
    },

    average: {
      background: "#fffbeb",
      border: "#fde68a",
      text: "#b45309",
    },

    poor: {
      background: "#fef2f2",
      border: "#fecaca",
      text: "#dc2626",
    },
  };

  const selected =
    colorStyles[styleType];

  return (
    <div
      style={{
        ...styles.attendanceBox,
        background: selected.background,
        borderColor: selected.border,
      }}
    >

      <div style={styles.attendanceIcon}>
        {icon}
      </div>

      <div>

        <p
          style={{
            ...styles.attendanceTitle,
            color: selected.text,
          }}
        >
          {title}
        </p>

        <h3
          style={{
            ...styles.attendanceNumber,
            color: selected.text,
          }}
        >
          {value}
        </h3>

        <p style={styles.attendanceDescription}>
          {description}
        </p>

      </div>

    </div>
  );
}

// ======================================================
// ATTENDANCE BADGE STYLE
// ======================================================

function getAttendanceBadgeStyle(
  percentage
) {
  if (percentage >= 75) {
    return {
      background: "#dcfce7",
      color: "#15803d",
    };
  }

  if (percentage >= 50) {
    return {
      background: "#fef3c7",
      color: "#b45309",
    };
  }

  return {
    background: "#fee2e2",
    color: "#dc2626",
  };
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

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
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

  monitorButton: {
    textDecoration: "none",
    background: "#2563eb",
    color: "white",
    padding: "10px 14px",
    borderRadius: "9px",
    fontSize: "12px",
    fontWeight: "700",
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

  liveBadge: {
    background: "#dcfce7",
    color: "#15803d",
    padding: "7px 11px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
  },

  overviewGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "16px",
  },

  metricBox: {
    padding: "18px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    background: "#f8fafc",
  },

  metricTop: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "15px",
  },

  metricIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  metricTitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "10px",
    fontWeight: "700",
  },

  metricValue: {
    margin: "3px 0 0",
    fontSize: "20px",
    fontWeight: "800",
  },

  metricProgressBackground: {
    height: "7px",
    background: "#e2e8f0",
    borderRadius: "10px",
    overflow: "hidden",
  },

  metricProgress: {
    height: "100%",
    borderRadius: "10px",
    transition: "width 0.5s ease",
  },

  metricDescription: {
    margin: "8px 0 0",
    color: "#94a3b8",
    fontSize: "10px",
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

  attendanceDistribution: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "16px",
  },

  attendanceBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "18px",
    border: "1px solid",
    borderRadius: "12px",
  },

  attendanceIcon: {
    fontSize: "25px",
  },

  attendanceTitle: {
    margin: 0,
    fontSize: "11px",
    fontWeight: "700",
  },

  attendanceNumber: {
    margin: "3px 0",
    fontSize: "25px",
    fontWeight: "800",
  },

  attendanceDescription: {
    margin: 0,
    color: "#64748b",
    fontSize: "10px",
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
    borderBottom:
      "1px solid #e2e8f0",
  },

  td: {
    padding: "13px 12px",
    fontSize: "12px",
    borderBottom:
      "1px solid #f1f5f9",
  },

  studentCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  studentAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "13px",
  },

  roll: {
    fontSize: "10px",
    color: "#94a3b8",
    marginTop: "3px",
  },

  attentionCell: {
    minWidth: "100px",
  },

  miniProgress: {
    marginTop: "5px",
    height: "5px",
    background: "#e2e8f0",
    borderRadius: "10px",
    overflow: "hidden",
  },

  miniProgressFill: {
    height: "100%",
    background:
      "linear-gradient(90deg,#2563eb,#4f46e5)",
    borderRadius: "10px",
  },

  emotionBadge: {
    background: "#f1f5f9",
    color: "#334155",
    padding: "6px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "600",
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

  attendanceBadge: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
  },

  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "40px",
  },

  primaryButton: {
    display: "inline-block",
    marginTop: "12px",
    background: "#2563eb",
    color: "white",
    textDecoration: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    fontSize: "11px",
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