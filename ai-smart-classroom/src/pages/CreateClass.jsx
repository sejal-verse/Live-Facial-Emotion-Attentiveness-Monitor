import { useState } from "react";

function CreateClass() {
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [classLink, setClassLink] = useState("");

  const createClass = () => {
    if (!className.trim() || !subject.trim()) {
      alert("Please enter class name and subject.");
      return;
    }

    const classId =
      "CLASS-" +
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    const newClass = {
      id: classId,
      className: className.trim(),
      subject: subject.trim(),
      createdAt: new Date().toISOString(),
      joinedStudents: [],
    };

    // Save the created class
    localStorage.setItem(
      "activeClass",
      JSON.stringify(newClass)
    );

    // Create the online classroom link
    const link =
      `${window.location.origin}/classroom/${classId}`;

    setClassLink(link);
  };

  const copyLink = async () => {
    if (!classLink) return;

    try {
      await navigator.clipboard.writeText(classLink);

      alert("Class link copied!");
    } catch (error) {
      console.error(error);

      alert(
        "Unable to copy the link. Please copy it manually."
      );
    }
  };

  return (
    <div style={styles.page}>

      <div style={styles.card}>

        {/* HEADER */}

        <div style={styles.icon}>
          🎓
        </div>

        <h1 style={styles.title}>
          Create Online Class
        </h1>

        <p style={styles.subtitle}>
          Create your virtual classroom and share the
          joining link with your registered students.
        </p>

        {/* CLASS NAME */}

        <label style={styles.label}>
          Class Name
        </label>

        <input
          type="text"
          placeholder="Example: AI & Machine Learning"
          value={className}
          onChange={(e) =>
            setClassName(e.target.value)
          }
          style={styles.input}
        />

        {/* SUBJECT */}

        <label style={styles.label}>
          Subject
        </label>

        <input
          type="text"
          placeholder="Example: Artificial Intelligence"
          value={subject}
          onChange={(e) =>
            setSubject(e.target.value)
          }
          style={styles.input}
        />

        {/* CREATE BUTTON */}

        <button
          onClick={createClass}
          style={styles.createButton}
        >
          🚀 CREATE CLASS
        </button>

        {/* GENERATED LINK */}

        {classLink && (
          <div style={styles.linkBox}>

            <div style={styles.successHeader}>
              <span style={styles.successIcon}>
                ✓
              </span>

              <div>
                <div style={styles.successTitle}>
                  Class Created Successfully
                </div>

                <div style={styles.successText}>
                  Your online classroom is ready.
                </div>
              </div>
            </div>

            <p style={styles.linkTitle}>
              Classroom Link
            </p>

            <div style={styles.linkRow}>

              <input
                type="text"
                value={classLink}
                readOnly
                style={styles.linkInput}
              />

              <button
                onClick={copyLink}
                style={styles.copyButton}
              >
                COPY
              </button>

            </div>

            <p style={styles.note}>
              Share this link only with registered
              students.
            </p>

            <div style={styles.features}>

              <div style={styles.feature}>
                🎥 Camera
              </div>

              <div style={styles.feature}>
                🎤 Microphone
              </div>

              <div style={styles.feature}>
                🖥️ Screen Share
              </div>

              <div style={styles.feature}>
                💬 Chat
              </div>

              <div style={styles.feature}>
                👥 Participants
              </div>

              <div style={styles.feature}>
                🤖 AI Monitoring
              </div>

            </div>

            {/* OPEN CLASSROOM */}

            <a
              href={classLink}
              style={styles.openButton}
            >
              ENTER CLASSROOM →
            </a>

          </div>
        )}

      </div>

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #eff6ff, #f8fafc)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    boxSizing: "border-box",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "560px",
    background: "#ffffff",
    padding: "38px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 20px 50px rgba(15, 23, 42, 0.10)",
    boxSizing: "border-box",
  },

  icon: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "#dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    marginBottom: "16px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
    color: "#0f172a",
  },

  subtitle: {
    margin: "9px 0 28px",
    fontSize: "13px",
    color: "#64748b",
    lineHeight: "1.6",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    marginTop: "17px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#334155",
  },

  input: {
    width: "100%",
    padding: "13px 14px",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    fontSize: "13px",
    color: "#0f172a",
    outline: "none",
    background: "#ffffff",
  },

  createButton: {
    width: "100%",
    marginTop: "26px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "white",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
    letterSpacing: "0.3px",
  },

  linkBox: {
    marginTop: "25px",
    padding: "18px",
    background: "#f8fafc",
    border: "1px solid #dbeafe",
    borderRadius: "13px",
  },

  successHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px",
  },

  successIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },

  successTitle: {
    fontSize: "13px",
    fontWeight: "800",
    color: "#0f172a",
  },

  successText: {
    fontSize: "10px",
    color: "#64748b",
    marginTop: "2px",
  },

  linkTitle: {
    margin: "0 0 9px",
    fontSize: "11px",
    fontWeight: "800",
    color: "#334155",
  },

  linkRow: {
    display: "flex",
    gap: "8px",
  },

  linkInput: {
    flex: 1,
    minWidth: 0,
    padding: "11px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "10px",
    background: "#ffffff",
    color: "#475569",
    outline: "none",
  },

  copyButton: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#0f172a",
    color: "white",
    fontSize: "10px",
    fontWeight: "800",
    cursor: "pointer",
  },

  note: {
    margin: "10px 0 15px",
    fontSize: "10px",
    color: "#64748b",
    lineHeight: "1.5",
  },

  features: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "7px",
    marginBottom: "17px",
  },

  feature: {
    padding: "9px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "7px",
    fontSize: "10px",
    color: "#475569",
    fontWeight: "600",
  },

  openButton: {
    display: "block",
    width: "100%",
    padding: "12px",
    boxSizing: "border-box",
    textAlign: "center",
    textDecoration: "none",
    borderRadius: "9px",
    background: "#2563eb",
    color: "white",
    fontSize: "11px",
    fontWeight: "800",
  },
};

export default CreateClass;