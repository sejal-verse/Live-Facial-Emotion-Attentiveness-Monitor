import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";

function StudentRegistration() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [photo, setPhoto] = useState("");
  const [faceDetected, setFaceDetected] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // LOAD FACE-API MODELS
  // ==========================================
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("Loading Face AI models...");

        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");

        setModelsLoaded(true);

        console.log("Face AI models loaded successfully");
      } catch (error) {
        console.error("MODEL LOADING ERROR:", error);

        alert(
          `Face AI models could not be loaded.\n\n${
            error?.message || "Check the files inside public/models."
          }`
        );
      }
    };

    loadModels();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  // ==========================================
  // START CAMERA
  // ==========================================
  const startCamera = async () => {
    try {
      console.log("Starting camera...");

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert(
          "Camera is not supported by this browser."
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: {
            ideal: 640,
          },
          height: {
            ideal: 480,
          },
          facingMode: "user",
        },
        audio: false,
      });

      console.log("Camera permission granted");

      streamRef.current = stream;

      // Mark camera as started first.
      // The video element is already present in this component.
      setCameraStarted(true);

      // Attach stream to video
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        try {
          await videoRef.current.play();

          console.log("Camera started successfully");
          console.log(
            "Video size:",
            videoRef.current.videoWidth,
            videoRef.current.videoHeight
          );
        } catch (playError) {
          console.error("Video play error:", playError);
        }
      }
    } catch (error) {
      console.error("Camera error:", error);

      let message = "Unable to access the camera.";

      if (error?.name === "NotAllowedError") {
        message =
          "Camera permission was denied.\n\nPlease allow camera permission and try again.";
      } else if (error?.name === "NotFoundError") {
        message =
          "No camera was found on this device.";
      } else if (error?.name === "NotReadableError") {
        message =
          "Camera is already being used by another application.";
      } else if (error?.name === "OverconstrainedError") {
        message =
          "Camera does not support the requested settings.";
      } else if (error?.message) {
        message = error.message;
      }

      alert(message);
    }
  };

  // ==========================================
  // CAPTURE PHOTO + FACE DESCRIPTOR
  // ==========================================
  const capturePhoto = async () => {
    if (!modelsLoaded) {
      alert(
        "Face AI models are still loading. Please wait."
      );
      return;
    }

    if (!cameraStarted || !videoRef.current) {
      alert(
        "Please start the camera first."
      );
      return;
    }

    const video = videoRef.current;

    if (
      video.readyState < 2 ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      alert(
        "Camera video is not ready yet. Please wait a moment and try again."
      );
      return;
    }

    setLoading(true);

    try {
      console.log("Detecting face...");

      const detection = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320,
            scoreThreshold: 0.5,
          })
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setFaceDetected(false);

        alert(
          "No face detected.\n\nPlease sit in front of the camera and try again."
        );

        setLoading(false);
        return;
      }

      console.log("Face detected successfully");

      setFaceDetected(true);

      // ==========================================
      // CAPTURE IMAGE
      // ==========================================
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");

      // Draw normal orientation
      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const imageData = canvas.toDataURL(
        "image/jpeg",
        0.8
      );

      setPhoto(imageData);

      alert(
        "Face captured successfully! ✅"
      );
    } catch (error) {
      console.error(
        "Face detection error:",
        error
      );

      alert(
        `Unable to detect face.\n\n${
          error?.message || "Please try again."
        }`
      );
    }

    setLoading(false);
  };

  // ==========================================
  // REGISTER STUDENT
  // ==========================================
  const handleRegister = async (e) => {
    e.preventDefault();

    // ------------------------------------------
    // BASIC VALIDATION
    // ------------------------------------------
    if (!name.trim()) {
      alert("Please enter student name.");
      return;
    }

    if (!rollNo.trim()) {
      alert("Please enter roll number.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter email.");
      return;
    }

    if (!department) {
      alert("Please select department.");
      return;
    }

    if (!semester) {
      alert("Please select semester.");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter phone number.");
      return;
    }

    if (!password) {
      alert("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      alert(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (!confirmPassword) {
      alert("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!photo) {
      alert("Please capture your face photo.");
      return;
    }

    if (!faceDetected) {
      alert(
        "Please capture a valid face before registering."
      );
      return;
    }

    // ------------------------------------------
    // GET EXISTING STUDENTS
    // ------------------------------------------
    const students = JSON.parse(
      localStorage.getItem(
        "registeredStudents"
      ) || "[]"
    );

    // ------------------------------------------
    // CHECK DUPLICATE ROLL NUMBER
    // ------------------------------------------
    const existingRoll = students.find(
      (student) =>
        student.rollNo?.toLowerCase() ===
        rollNo.trim().toLowerCase()
    );

    if (existingRoll) {
      alert(
        "This roll number is already registered."
      );
      return;
    }

    // ------------------------------------------
    // CHECK DUPLICATE EMAIL
    // ------------------------------------------
    const existingEmail = students.find(
      (student) =>
        student.email?.toLowerCase() ===
        email.trim().toLowerCase()
    );

    if (existingEmail) {
      alert(
        "This email is already registered."
      );
      return;
    }

    // ------------------------------------------
    // CREATE FACE DESCRIPTOR
    // ------------------------------------------
    let descriptor = null;

    try {
      const video = videoRef.current;

      if (
        !video ||
        video.readyState < 2 ||
        video.videoWidth === 0
      ) {
        alert(
          "Camera is not ready. Please capture your face again."
        );
        return;
      }

      const detection = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320,
            scoreThreshold: 0.5,
          })
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        descriptor = Array.from(
          detection.descriptor
        );
      }
    } catch (error) {
      console.error(
        "Descriptor error:",
        error
      );
    }

    if (!descriptor) {
      alert(
        "Could not create face recognition data.\n\nPlease capture your face again."
      );
      return;
    }

    // ------------------------------------------
    // CREATE STUDENT OBJECT
    // ------------------------------------------
    const newStudent = {
      id: Date.now(),

      name: name.trim(),

      rollNo: rollNo.trim(),

      email: email.trim(),

      department,

      semester,

      phone: phone.trim(),

      // Prototype only
      password,

      photo,

      descriptor,

      registeredAt:
        new Date().toISOString(),

      status: "Registered",

      // Initial AI values
      attention: 0,

      emotion: "Neutral",

      distraction: "Not Distracted",
    };

    // ------------------------------------------
    // SAVE STUDENT
    // ------------------------------------------
    students.push(newStudent);

    localStorage.setItem(
      "registeredStudents",
      JSON.stringify(students)
    );

    // ------------------------------------------
    // STOP CAMERA
    // ------------------------------------------
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    setCameraStarted(false);

    alert(
      "Student registered successfully! 🎉\n\nYou can now login using your email or roll number."
    );

    navigate("/student-login");
  };

  // ==========================================
  // STYLES
  // ==========================================
  const styles = {
    page: {
      minHeight: "100vh",
      padding: "35px 20px",
      boxSizing: "border-box",
      background:
        "linear-gradient(135deg, #eff6ff, #eef2ff, #f5f3ff)",
      fontFamily:
        "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },

    container: {
      maxWidth: "1050px",
      margin: "0 auto",
    },

    header: {
      textAlign: "center",
      marginBottom: "30px",
    },

    logo: {
      width: "70px",
      height: "70px",
      margin: "0 auto 15px",
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
      fontSize: "30px",
      fontWeight: "800",
      color: "#0f172a",
    },

    subtitle: {
      margin: "8px 0 0",
      color: "#64748b",
      fontSize: "14px",
    },

    card: {
      background: "#ffffff",
      borderRadius: "24px",
      padding: "35px",
      boxShadow:
        "0 20px 55px rgba(15, 23, 42, 0.12)",
      border: "1px solid #e2e8f0",
    },

    sectionTitle: {
      margin: "0 0 20px",
      fontSize: "18px",
      fontWeight: "800",
      color: "#1e293b",
    },

    grid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "20px",
    },

    inputGroup: {
      marginBottom: "18px",
    },

    label: {
      display: "block",
      marginBottom: "7px",
      fontSize: "13px",
      fontWeight: "700",
      color: "#334155",
    },

    input: {
      width: "100%",
      boxSizing: "border-box",
      padding: "13px 14px",
      border: "1px solid #cbd5e1",
      borderRadius: "11px",
      outline: "none",
      fontSize: "14px",
      color: "#0f172a",
      background: "#ffffff",
    },

    select: {
      width: "100%",
      boxSizing: "border-box",
      padding: "13px 14px",
      border: "1px solid #cbd5e1",
      borderRadius: "11px",
      outline: "none",
      fontSize: "14px",
      color: "#0f172a",
      background: "#ffffff",
    },

    passwordWrapper: {
      display: "flex",
      alignItems: "center",
      border: "1px solid #cbd5e1",
      borderRadius: "11px",
      overflow: "hidden",
      background: "#ffffff",
    },

    passwordIcon: {
      paddingLeft: "13px",
      fontSize: "17px",
    },

    passwordInput: {
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

    passwordHint: {
      margin: "6px 0 0",
      fontSize: "11px",
      color: "#64748b",
    },

    cameraSection: {
      marginTop: "25px",
      paddingTop: "25px",
      borderTop: "1px solid #e2e8f0",
    },

    cameraBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "15px",
    },

    video: {
      width: "100%",
      maxWidth: "640px",
      minHeight: "360px",
      borderRadius: "18px",
      background: "#0f172a",
      border: "3px solid #e2e8f0",
      objectFit: "cover",
      transform: "scaleX(-1)",
    },

    canvas: {
      display: "none",
    },

    cameraButton: {
      border: "none",
      borderRadius: "11px",
      padding: "13px 22px",
      background:
        "linear-gradient(135deg, #0f766e, #0891b2)",
      color: "white",
      fontSize: "14px",
      fontWeight: "800",
      cursor: "pointer",
    },

    captureButton: {
      border: "none",
      borderRadius: "11px",
      padding: "13px 22px",
      background:
        "linear-gradient(135deg, #2563eb, #4f46e5)",
      color: "white",
      fontSize: "14px",
      fontWeight: "800",
      cursor: "pointer",
    },

    success: {
      padding: "12px 15px",
      borderRadius: "10px",
      background: "#dcfce7",
      color: "#166534",
      fontSize: "13px",
      fontWeight: "700",
    },

    photoPreview: {
      width: "150px",
      height: "150px",
      objectFit: "cover",
      borderRadius: "18px",
      border: "4px solid #22c55e",
      transform: "scaleX(-1)",
    },

    submitButton: {
      width: "100%",
      marginTop: "30px",
      border: "none",
      borderRadius: "12px",
      padding: "15px",
      background:
        "linear-gradient(135deg, #2563eb, #4f46e5)",
      color: "white",
      fontSize: "15px",
      fontWeight: "800",
      cursor: "pointer",
      boxShadow:
        "0 8px 20px rgba(37, 99, 235, 0.25)",
    },

    backLink: {
      display: "block",
      textAlign: "center",
      marginTop: "22px",
      color: "#64748b",
      textDecoration: "none",
      fontSize: "13px",
      fontWeight: "600",
    },

    footer: {
      textAlign: "center",
      marginTop: "25px",
      color: "#94a3b8",
      fontSize: "11px",
    },
  };

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.logo}>
            🤖
          </div>

          <h1 style={styles.title}>
            Face Registration
          </h1>

          <p style={styles.subtitle}>
            Your face will be used for smart attendance
            and classroom monitoring.
          </p>
        </div>

        {/* MAIN CARD */}
        <div style={styles.card}>

          <form onSubmit={handleRegister}>

            {/* PERSONAL INFORMATION */}
            <h2 style={styles.sectionTitle}>
              👤 Personal Information
            </h2>

            <div style={styles.grid}>

              {/* NAME */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  style={styles.input}
                />
              </div>

              {/* ROLL NUMBER */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Roll Number
                </label>

                <input
                  type="text"
                  placeholder="Enter roll number"
                  value={rollNo}
                  onChange={(e) =>
                    setRollNo(e.target.value)
                  }
                  style={styles.input}
                />
              </div>

              {/* EMAIL */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  style={styles.input}
                />
              </div>

              {/* PHONE */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  style={styles.input}
                />
              </div>

              {/* DEPARTMENT */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Department
                </label>

                <select
                  value={department}
                  onChange={(e) =>
                    setDepartment(e.target.value)
                  }
                  style={styles.select}
                >
                  <option value="">
                    Select Department
                  </option>

                  <option value="CSE">
                    Computer Science & Engineering
                  </option>

                  <option value="ECE">
                    Electronics & Communication
                  </option>

                  <option value="EEE">
                    Electrical & Electronics
                  </option>

                  <option value="ME">
                    Mechanical Engineering
                  </option>

                  <option value="CE">
                    Civil Engineering
                  </option>

                  <option value="IT">
                    Information Technology
                  </option>
                </select>
              </div>

              {/* SEMESTER */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Semester
                </label>

                <select
                  value={semester}
                  onChange={(e) =>
                    setSemester(e.target.value)
                  }
                  style={styles.select}
                >
                  <option value="">
                    Select Semester
                  </option>

                  <option value="1st Semester">
                    1st Semester
                  </option>

                  <option value="2nd Semester">
                    2nd Semester
                  </option>

                  <option value="3rd Semester">
                    3rd Semester
                  </option>

                  <option value="4th Semester">
                    4th Semester
                  </option>

                  <option value="5th Semester">
                    5th Semester
                  </option>

                  <option value="6th Semester">
                    6th Semester
                  </option>

                  <option value="7th Semester">
                    7th Semester
                  </option>

                  <option value="8th Semester">
                    8th Semester
                  </option>
                </select>
              </div>

            </div>

            {/* ACCOUNT SECURITY */}
            <div style={{ marginTop: "10px" }}>

              <h2 style={styles.sectionTitle}>
                🔐 Account Security
              </h2>

              <div style={styles.grid}>

                {/* PASSWORD */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    Password
                  </label>

                  <div
                    style={styles.passwordWrapper}
                  >
                    <span
                      style={styles.passwordIcon}
                    >
                      🔒
                    </span>

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      style={styles.passwordInput}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      style={styles.showButton}
                    >
                      {showPassword
                        ? "Hide"
                        : "Show"}
                    </button>
                  </div>

                  <p
                    style={styles.passwordHint}
                  >
                    Minimum 6 characters
                  </p>
                </div>

                {/* CONFIRM PASSWORD */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    Confirm Password
                  </label>

                  <div
                    style={styles.passwordWrapper}
                  >
                    <span
                      style={styles.passwordIcon}
                    >
                      🔒
                    </span>

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      style={styles.passwordInput}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      style={styles.showButton}
                    >
                      {showConfirmPassword
                        ? "Hide"
                        : "Show"}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* FACE REGISTRATION */}
            <div style={styles.cameraSection}>

              <h2 style={styles.sectionTitle}>
                🤖 Face Registration
              </h2>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                  marginBottom: "18px",
                }}
              >
                Your face will be used for smart
                attendance and classroom monitoring.
              </p>

              <div style={styles.cameraBox}>

                {/* VIDEO IS ALWAYS PRESENT */}
                <video
                  ref={videoRef}
                  style={{
                    ...styles.video,
                    display: cameraStarted
                      ? "block"
                      : "none",
                  }}
                  autoPlay
                  muted
                  playsInline
                  width="640"
                  height="480"
                />

                {/* START CAMERA BUTTON */}
                {!cameraStarted && (
                  <button
                    type="button"
                    onClick={startCamera}
                    style={styles.cameraButton}
                  >
                    📷 Start Camera
                  </button>
                )}

                {/* CANVAS */}
                <canvas
                  ref={canvasRef}
                  style={styles.canvas}
                />

                {/* CAPTURE BUTTON */}
                {cameraStarted && (
                  <button
                    type="button"
                    onClick={capturePhoto}
                    style={styles.captureButton}
                    disabled={loading}
                  >
                    {loading
                      ? "Detecting Face..."
                      : "📸 Capture Face"}
                  </button>
                )}

                {/* PHOTO PREVIEW */}
                {photo && faceDetected && (
                  <>
                    <img
                      src={photo}
                      alt="Student face"
                      style={styles.photoPreview}
                    />

                    <div style={styles.success}>
                      ✅ Face detected and captured
                      successfully
                    </div>
                  </>
                )}

              </div>
            </div>

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              style={styles.submitButton}
            >
              🎓 Register Student
            </button>

          </form>

          {/* BACK TO LOGIN */}
          <Link
            to="/student-login"
            style={styles.backLink}
          >
            ← Back to Student Login
          </Link>

        </div>

        {/* FOOTER */}
        <p style={styles.footer}>
          🤖 AI Smart Classroom
        </p>

      </div>
    </div>
  );
}

export default StudentRegistration;