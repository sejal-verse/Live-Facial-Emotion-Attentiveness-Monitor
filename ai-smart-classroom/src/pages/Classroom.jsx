import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { useNavigate, useParams } from "react-router-dom";

function Classroom() {
  const { classId } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const screenVideoRef = useRef(null);

  const [classInfo, setClassInfo] = useState(null);
  const [joinedStudents, setJoinedStudents] = useState([]);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [accessAllowed, setAccessAllowed] = useState(false);

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [raisedHand, setRaisedHand] = useState(false);

  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showAI, setShowAI] = useState(true);
  const [eyeWarning, setEyeWarning] = useState("");
  const warningCountRef = useRef(0);
  const distractionActiveRef = useRef(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // =========================================
  // REAL-TIME CHAT STORAGE
  // =========================================

  const chatStorageKey = `classChat_${classId}`;
  const raiseHandStorageKey = `classRaisedHands_${classId}`;

  // =========================================
  // REAL-TIME RAISE HAND STORAGE
  // =========================================

  useEffect(() => {
    if (!accessAllowed) return;

    const loadRaisedHands = () => {
      try {
        const savedHands = JSON.parse(
          localStorage.getItem(raiseHandStorageKey) || "{}"
        );

        const loggedStudent = localStorage.getItem("loggedInStudent");
        const teacherName = localStorage.getItem("teacherName");

        let currentKey = "teacher";

        if (loggedStudent) {
          try {
            const student = JSON.parse(loggedStudent);
            currentKey = `student_${student.id || student.email || student.rollNo}`;
          } catch (error) {
            console.error(error);
          }
        } else if (teacherName) {
          currentKey = "teacher";
        }

        setRaisedHand(Boolean(savedHands[currentKey]?.raised));
      } catch (error) {
        console.error("Unable to load raised hands:", error);
      }
    };

    loadRaisedHands();
    const interval = setInterval(loadRaisedHands, 500);

    const handleStorage = (event) => {
      if (event.key === raiseHandStorageKey) loadRaisedHands();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
    };
  }, [accessAllowed, raiseHandStorageKey]);

  useEffect(() => {
    if (!accessAllowed) return;

    const loadMessages = () => {
      try {
        const savedMessages = JSON.parse(
          localStorage.getItem(chatStorageKey) || "[]"
        );

        setMessages(
          Array.isArray(savedMessages)
            ? savedMessages
            : []
        );
      } catch (error) {
        console.error("Unable to load chat messages:", error);
      }
    };

    loadMessages();

    const interval = setInterval(loadMessages, 500);

    const handleStorage = (event) => {
      if (event.key === chatStorageKey) {
        loadMessages();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
    };
  }, [accessAllowed, chatStorageKey]);

  const [stream, setStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);

  const [liveData, setLiveData] = useState({
    averageAttention: 0,
    mainEmotion: "Neutral",
    distractedCount: 0,
    students: [],
  });

  // =========================================
  // CHECK CLASS + STUDENT ACCESS
  // =========================================

  useEffect(() => {
    const checkAccess = () => {
      const savedClass =
        localStorage.getItem("activeClass");

      if (!savedClass) {
        alert("Class not found.");
        navigate("/dashboard");
        return;
      }

      try {
        const parsedClass = JSON.parse(savedClass);

        // Check class ID
        if (parsedClass.id !== classId) {
          alert("Invalid class link.");
          navigate("/dashboard");
          return;
        }

        setClassInfo(parsedClass);
        setJoinedStudents(
          Array.isArray(parsedClass.joinedStudents)
            ? parsedClass.joinedStudents
            : []
        );

        // -------------------------------------
        // CHECK IF TEACHER
        // -------------------------------------

        const teacherName =
          localStorage.getItem("teacherName");

        if (teacherName) {
          setAccessAllowed(true);
          setCheckingAccess(false);
          return;
        }

        // -------------------------------------
        // CHECK STUDENT LOGIN
        // -------------------------------------

        const loggedStudent =
          localStorage.getItem("loggedInStudent");

        if (!loggedStudent) {
          alert(
            "Please login with your registered student account before joining the class."
          );

          navigate("/student-login");
          return;
        }

        let student;

        try {
          student = JSON.parse(loggedStudent);
        } catch (error) {
          console.error(error);

          alert("Invalid student login.");

          navigate("/student-login");
          return;
        }

        // -------------------------------------
        // LOAD REGISTERED STUDENTS
        // -------------------------------------

        const registeredStudents =
          JSON.parse(
            localStorage.getItem(
              "registeredStudents"
            ) || "[]"
          );

        // -------------------------------------
        // VERIFY STUDENT
        // -------------------------------------

        const registeredStudent =
          registeredStudents.find((item) => {
            const sameId =
              item.id &&
              student.id &&
              String(item.id) ===
                String(student.id);

            const sameEmail =
              item.email &&
              student.email &&
              item.email.toLowerCase() ===
                student.email.toLowerCase();

            const sameRollNo =
              item.rollNo &&
              student.rollNo &&
              item.rollNo.toLowerCase() ===
                student.rollNo.toLowerCase();

            return (
              sameId ||
              sameEmail ||
              sameRollNo
            );
          });

        if (!registeredStudent) {
          alert(
            "Access denied. Only registered students can join this class."
          );

          localStorage.removeItem(
            "loggedInStudent"
          );

          navigate("/student-login");
          return;
        }

        // -------------------------------------
        // AUTOMATIC ATTENDANCE
        // -------------------------------------

        // Attendance is recorded only after the student
        // has successfully passed the registration check.
        const today =
          new Date().toISOString().split("T")[0];

        const attendance =
          JSON.parse(
            localStorage.getItem(
              "classAttendance"
            ) || "{}"
          );

        if (!attendance[today]) {
          attendance[today] = {};
        }

        attendance[today][registeredStudent.name] =
          "Present";

        localStorage.setItem(
          "classAttendance",
          JSON.stringify(attendance)
        );

        // Also save the student inside the active class
        // so the teacher can see who has joined.
        const activeClass =
          JSON.parse(
            localStorage.getItem("activeClass") || "null"
          );

        if (
          activeClass &&
          activeClass.id === classId
        ) {
          const joinedStudents =
            Array.isArray(activeClass.joinedStudents)
              ? activeClass.joinedStudents
              : [];

          const alreadyJoined =
            joinedStudents.some(
              (item) =>
                String(item.id) ===
                String(registeredStudent.id)
            );

          if (!alreadyJoined) {
            const updatedClass = {
              ...activeClass,
              joinedStudents: [
                ...joinedStudents,
                {
                  id: registeredStudent.id,
                  name: registeredStudent.name,
                  rollNo: registeredStudent.rollNo,
                  email: registeredStudent.email,
                  joinedAt: new Date().toISOString(),
                },
              ],
            };

            localStorage.setItem(
              "activeClass",
              JSON.stringify(updatedClass)
            );

            setClassInfo(updatedClass);
            setJoinedStudents(updatedClass.joinedStudents);
          } else {
            setClassInfo(activeClass);
            setJoinedStudents(joinedStudents);
          }
        }

        // -------------------------------------
        // ACCESS GRANTED
        // -------------------------------------

        setAccessAllowed(true);
        setCheckingAccess(false);

      } catch (error) {
        console.error(error);

        alert("Unable to verify class.");

        navigate("/dashboard");
      }
    };

    checkAccess();
  }, [classId, navigate]);

  // =========================================
  // REFRESH JOINED STUDENTS
  // =========================================

  useEffect(() => {
    if (!accessAllowed) return;

    const loadJoinedStudents = () => {
      try {
        const savedClass = JSON.parse(
          localStorage.getItem("activeClass") || "null"
        );

        if (savedClass && savedClass.id === classId) {
          const students = Array.isArray(savedClass.joinedStudents)
            ? savedClass.joinedStudents
            : [];

          setJoinedStudents(students);
          setClassInfo(savedClass);
        }
      } catch (error) {
        console.error("Unable to load joined students:", error);
      }
    };

    loadJoinedStudents();

    const interval = setInterval(loadJoinedStudents, 1000);

    return () => clearInterval(interval);
  }, [accessAllowed, classId]);

  // =========================================
  // START CAMERA + MICROPHONE
  // =========================================

  useEffect(() => {
    if (!accessAllowed) return;

    let mounted = true;

    const startMedia = async () => {
      try {
        const mediaStream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        if (!mounted) {
          mediaStream
            .getTracks()
            .forEach((track) => track.stop());

          return;
        }

        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject =
            mediaStream;
        }

      } catch (error) {
        console.error(
          "Camera/Microphone error:",
          error
        );

        alert(
          "Camera or microphone permission was not granted."
        );
      }
    };

    startMedia();

    return () => {
      mounted = false;

      if (mediaStreamCleanupRef.current) {
        mediaStreamCleanupRef.current();
      }
    };
  }, [accessAllowed]);

  // =========================================
  // STREAM CLEANUP
  // =========================================

  const mediaStreamCleanupRef = useRef(null);

  useEffect(() => {
    mediaStreamCleanupRef.current = () => {
      if (stream) {
        stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };

    return () => {
      if (mediaStreamCleanupRef.current) {
        mediaStreamCleanupRef.current();
      }
    };
  }, [stream]);

  // =========================================
  // ATTACH VIDEO STREAM
  // =========================================

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // =========================================
  // EYE-CLOSURE / SLEEPINESS DETECTION
  // =========================================

  useEffect(() => {
    if (!accessAllowed || !stream) return;

    const loggedStudent = localStorage.getItem("loggedInStudent");

    // Eye-warning detection is for students only.
    if (!loggedStudent) return;

    let mounted = true;
    let detectionInterval;
    let closedSince = null;
    let lastWarningTime = 0;
    let modelsLoaded = false;

    const eyeAspectRatio = (eye) => {
      if (!eye || eye.length < 6) return 1;

      const vertical1 = Math.hypot(
        eye[1].x - eye[5].x,
        eye[1].y - eye[5].y
      );
      const vertical2 = Math.hypot(
        eye[2].x - eye[4].x,
        eye[2].y - eye[4].y
      );
      const horizontal = Math.hypot(
        eye[0].x - eye[3].x,
        eye[0].y - eye[3].y
      );

      if (!horizontal) return 1;

      return (vertical1 + vertical2) / (2 * horizontal);
    };

    const saveStudentMonitoring = (overrides = {}) => {
      try {
        const student = JSON.parse(loggedStudent);
        const studentId = student.id || student.email || student.rollNo || student.name;
        const warningCount = warningCountRef.current;
        const distraction = Boolean(overrides.distraction ?? distractionActiveRef.current);
        const attention = Math.max(0, Math.min(100, 100 - warningCount * 10 - (distraction ? 10 : 0)));

        const saved = JSON.parse(
          localStorage.getItem("liveMonitoringData") || "{}"
        );
        const students = Array.isArray(saved.students) ? saved.students : [];

        const updatedStudent = {
          id: studentId,
          name: student.name || "Student",
          rollNo: student.rollNo || "",
          attention,
          distraction: distraction ? "Distracted" : "Focused",
          warningCount,
          lastUpdated: new Date().toISOString(),
        };

        const existingIndex = students.findIndex(
          (item) => String(item.id) === String(studentId)
        );

        if (existingIndex >= 0) {
          students[existingIndex] = updatedStudent;
        } else {
          students.push(updatedStudent);
        }

        const distractedCount = students.filter(
          (item) => item.distraction === "Distracted"
        ).length;

        const averageAttention = students.length
          ? Math.round(
              students.reduce(
                (total, item) => total + Number(item.attention || 0),
                0
              ) / students.length
            )
          : 0;

        localStorage.setItem(
          "liveMonitoringData",
          JSON.stringify({
            ...saved,
            averageAttention,
            distractedCount,
            monitoringActive: true,
            students,
          })
        );
      } catch (error) {
        console.error("Unable to save student monitoring data:", error);
      }
    };

    const startEyeDetection = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        modelsLoaded = true;
        saveStudentMonitoring({ distraction: false });

        if (!mounted) return;

        detectionInterval = setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) return;
          if (!cameraOn || !modelsLoaded) return;

          try {
            const detection = await faceapi
              .detectSingleFace(
                videoRef.current,
                new faceapi.TinyFaceDetectorOptions({
                  inputSize: 320,
                  scoreThreshold: 0.5,
                })
              )
              .withFaceLandmarks();

            if (!detection) {
              closedSince = null;
              return;
            }

            const landmarks = detection.landmarks;
            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();

            const leftEAR = eyeAspectRatio(leftEye);
            const rightEAR = eyeAspectRatio(rightEye);
            const averageEAR = (leftEAR + rightEAR) / 2;

            // A short closed-eye period avoids warning for normal blinking.
            const eyesClosed = averageEAR < 0.20;

            if (eyesClosed) {
              if (!closedSince) closedSince = Date.now();

              const closedFor = Date.now() - closedSince;
              const cooldownOver = Date.now() - lastWarningTime > 8000;

              if (closedFor >= 5000 && cooldownOver) {
                lastWarningTime = Date.now();
                warningCountRef.current += 1;
                distractionActiveRef.current = true;
                saveStudentMonitoring({ distraction: true });
                setEyeWarning(
                  "👀 Wake up! Please open your eyes and concentrate on your study."
                );

                setTimeout(() => {
                  if (mounted) setEyeWarning("");
                }, 5000);
              }
            } else {
              closedSince = null;
              if (distractionActiveRef.current) {
                distractionActiveRef.current = false;
                saveStudentMonitoring({ distraction: false });
              } else {
                saveStudentMonitoring({ distraction: false });
              }
            }
          } catch (error) {
            console.error("Eye detection error:", error);
          }
        }, 700);
      } catch (error) {
        console.error("Unable to load eye detection models:", error);
      }
    };

    startEyeDetection();

    return () => {
      mounted = false;
      if (detectionInterval) clearInterval(detectionInterval);
    };
  }, [accessAllowed, stream, cameraOn]);

  // =========================================
  // LOAD AI MONITORING DATA
  // =========================================

  useEffect(() => {
    if (!accessAllowed) return;

    const loadLiveData = () => {
      const savedData =
        localStorage.getItem(
          "liveMonitoringData"
        );

      if (!savedData) {
        return;
      }

      try {
        const data = JSON.parse(savedData);

        setLiveData({
          averageAttention:
            data.averageAttention || 0,

          mainEmotion:
            data.mainEmotion || "Neutral",

          distractedCount:
            data.distractedCount ||
            data.distracted ||
            0,

          students:
            data.students || [],
        });

      } catch (error) {
        console.error(error);
      }
    };

    loadLiveData();

    const interval = setInterval(
      loadLiveData,
      1000
    );

    return () =>
      clearInterval(interval);
  }, [accessAllowed]);

  // =========================================
  // CAMERA TOGGLE
  // =========================================

  const toggleCamera = () => {
    if (!stream) return;

    const videoTracks =
      stream.getVideoTracks();

    videoTracks.forEach((track) => {
      track.enabled = !cameraOn;
    });

    setCameraOn(!cameraOn);
  };

  // =========================================
  // MICROPHONE TOGGLE
  // =========================================

  const toggleMic = () => {
    if (!stream) return;

    const audioTracks =
      stream.getAudioTracks();

    audioTracks.forEach((track) => {
      track.enabled = !micOn;
    });

    setMicOn(!micOn);
  };

  // =========================================
  // SCREEN SHARING
  // =========================================

  const startScreenShare = async () => {
    try {
      if (screenSharing) {
        stopScreenShare();
        return;
      }

      const displayStream =
        await navigator.mediaDevices.getDisplayMedia(
          {
            video: true,
            audio: true,
          }
        );

      setScreenStream(displayStream);
      setScreenSharing(true);

      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject =
          displayStream;
      }

      const screenTrack =
        displayStream.getVideoTracks()[0];

      screenTrack.onended = () => {
        stopScreenShare();
      };

    } catch (error) {
      console.error(
        "Screen sharing cancelled:",
        error
      );
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream
        .getTracks()
        .forEach((track) => track.stop());
    }

    setScreenStream(null);
    setScreenSharing(false);
  };

  // =========================================
  // RAISE HAND
  // =========================================

  const toggleRaiseHand = () => {
    const loggedStudent = localStorage.getItem("loggedInStudent");
    const teacherName = localStorage.getItem("teacherName");

    let participantKey = "teacher";
    let participantName = teacherName || "Teacher";

    if (loggedStudent) {
      try {
        const student = JSON.parse(loggedStudent);
        participantKey = `student_${student.id || student.email || student.rollNo}`;
        participantName = student.name || "Student";
      } catch (error) {
        console.error(error);
      }
    }

    const nextRaisedHand = !raisedHand;

    try {
      const savedHands = JSON.parse(
        localStorage.getItem(raiseHandStorageKey) || "{}"
      );

      const updatedHands = {
        ...(savedHands && typeof savedHands === "object" ? savedHands : {}),
        [participantKey]: {
          name: participantName,
          raised: nextRaisedHand,
          updatedAt: new Date().toISOString(),
        },
      };

      localStorage.setItem(raiseHandStorageKey, JSON.stringify(updatedHands));
      setRaisedHand(nextRaisedHand);
    } catch (error) {
      console.error("Unable to update raised hand:", error);
    }
  };

  // =========================================
  // CHAT
  // =========================================

  const sendMessage = () => {
    if (!message.trim()) return;

    const loggedStudent =
      localStorage.getItem(
        "loggedInStudent"
      );

    let sender =
      localStorage.getItem(
        "teacherName"
      ) || "You";

    if (loggedStudent) {
      try {
        const student =
          JSON.parse(loggedStudent);

        sender =
          student.name || "Student";

      } catch (error) {
        console.error(error);
      }
    }

    const newMessage = {
      id: Date.now(),
      sender,
      text: message.trim(),
      time: new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
    };

    try {
      const savedMessages = JSON.parse(
        localStorage.getItem(chatStorageKey) || "[]"
      );

      const updatedMessages = [
        ...(Array.isArray(savedMessages)
          ? savedMessages
          : []),
        newMessage,
      ];

      localStorage.setItem(
        chatStorageKey,
        JSON.stringify(updatedMessages)
      );

      setMessages(updatedMessages);
    } catch (error) {
      console.error("Unable to send chat message:", error);
    }

    setMessage("");
  };

  // =========================================
  // CHAT ENTER KEY
  // =========================================

  const handleChatKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  // =========================================
  // LEAVE CLASS
  // =========================================

  const leaveClass = () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to leave this class?"
      );

    if (!confirmed) return;

    if (stream) {
      stream
        .getTracks()
        .forEach((track) => track.stop());
    }

    stopScreenShare();

    const loggedStudent =
      localStorage.getItem(
        "loggedInStudent"
      );

    try {
      const savedHands = JSON.parse(
        localStorage.getItem(raiseHandStorageKey) || "{}"
      );
      let participantKey = "teacher";

      if (loggedStudent) {
        try {
          const student = JSON.parse(loggedStudent);
          participantKey = `student_${student.id || student.email || student.rollNo}`;
        } catch (error) {
          console.error(error);
        }
      }

      delete savedHands[participantKey];
      localStorage.setItem(raiseHandStorageKey, JSON.stringify(savedHands));
    } catch (error) {
      console.error("Unable to clear raised hand:", error);
    }

    if (loggedStudent) {
      navigate("/student-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  // =========================================
  // END CLASS - TEACHER ONLY
  // =========================================

  const endClass = () => {
    const currentTeacher = localStorage.getItem("teacherName");

    if (!currentTeacher) {
      alert("Only the teacher can end the class.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to end this class? All students will be disconnected."
    );

    if (!confirmed) return;

    localStorage.removeItem("activeClass");
    localStorage.removeItem(raiseHandStorageKey);
    localStorage.removeItem(chatStorageKey);

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    stopScreenShare();
    alert("Class ended successfully.");
    navigate("/dashboard");
  };

  // =========================================
  // PARTICIPANTS
  // =========================================

  const loggedStudent =
    localStorage.getItem(
      "loggedInStudent"
    );

  const teacherName =
    localStorage.getItem(
      "teacherName"
    );

  let currentUser = "You";

  if (teacherName) {
    currentUser = teacherName;
  }

  if (loggedStudent) {
    try {
      const student =
        JSON.parse(loggedStudent);

      currentUser =
        student.name || "You";

    } catch (error) {
      console.error(error);
    }
  }

  const getStudentRaiseHandKey = (student) =>
    `student_${student.id || student.email || student.rollNo}`;

  const getRaisedHandStatus = (student) => {
    try {
      const savedHands = JSON.parse(
        localStorage.getItem(raiseHandStorageKey) || "{}"
      );

      return Boolean(savedHands[getStudentRaiseHandKey(student)]?.raised);
    } catch (error) {
      return false;
    }
  };

  // =========================================
  // ACCESS CHECK SCREEN
  // =========================================

  if (checkingAccess) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingIcon}>
            🔐
          </div>

          <h2>
            Checking Class Access
          </h2>

          <p>
            Verifying your registered
            account...
          </p>
        </div>
      </div>
    );
  }

  if (!accessAllowed) {
    return null;
  }

  // =========================================
  // CLASSROOM
  // =========================================

  return (
    <div style={styles.page}>
      {eyeWarning && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            background: "#b91c1c",
            color: "white",
            padding: "14px 22px",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "16px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
            textAlign: "center",
          }}
        >
          {eyeWarning}
        </div>
      )}

      {/* HEADER */}

      <header style={styles.header}>

        <div>

          <div style={styles.logo}>
            AI SMART CLASSROOM
          </div>

          <div style={styles.classTitle}>
            {classInfo.className}
          </div>

          <div style={styles.subject}>
            {classInfo.subject}
          </div>

        </div>

        <div style={styles.headerRight}>

          <div style={styles.classId}>
            {classInfo.id}
          </div>

          <button
            style={styles.headerButton}
            onClick={() =>
              navigator.clipboard.writeText(
                window.location.href
              )
            }
          >
            🔗 COPY LINK
          </button>

        </div>

      </header>

      {/* MAIN */}

      <main style={styles.main}>

        {/* VIDEO AREA */}

        <section style={styles.videoArea}>

          {screenSharing && (
            <div style={styles.screenShareBox}>

              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                muted
                style={styles.screenVideo}
              />

              <div style={styles.screenLabel}>
                🖥️ You are sharing your screen
              </div>

            </div>
          )}

          {!screenSharing && (
            <div style={styles.mainVideo}>

              {cameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={styles.video}
                />
              ) : (
                <div style={styles.cameraOff}>

                  <div style={styles.avatar}>
                    {currentUser
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    Camera Off
                  </div>

                </div>
              )}

              <div style={styles.nameTag}>
                {currentUser}
                {raisedHand && " ✋"}
              </div>

              <div style={styles.liveTag}>
                ● LIVE
              </div>

            </div>
          )}

          {/* REGISTERED STUDENTS */}

          <div style={styles.participantGrid}>

            {joinedStudents
              .slice(0, 5)
              .map((student) => (

                <div
                  key={student.id}
                  style={styles.participantCard}
                >

                  <div
                    style={
                      styles.participantAvatar
                    }
                  >
                    {student.name
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  <div
                    style={
                      styles.participantName
                    }
                  >
                    {student.name}
                  </div>

                  <div
                    style={styles.micStatus}
                  >
                    🎤
                    {getRaisedHandStatus(student) && " ✋"}
                  </div>

                </div>

              ))}

          </div>

        </section>

        {/* SIDEBAR */}

        {(showChat ||
          showParticipants ||
          showAI) && (

          <aside style={styles.sidebar}>

            {/* CHAT */}

            {showChat && (
              <div style={styles.panel}>

                <div
                  style={
                    styles.panelHeader
                  }
                >

                  <span>
                    💬 Chat
                  </span>

                  <button
                    onClick={() =>
                      setShowChat(false)
                    }
                    style={
                      styles.closeButton
                    }
                  >
                    ✕
                  </button>

                </div>

                <div
                  style={
                    styles.chatMessages
                  }
                >

                  {messages.length === 0 ? (
                    <div
                      style={
                        styles.emptyText
                      }
                    >
                      No messages yet.
                    </div>
                  ) : (
                    messages.map(
                      (item) => (
                        <div
                          key={item.id}
                          style={
                            styles.message
                          }
                        >

                          <strong>
                            {item.sender}
                          </strong>

                          <div>
                            {item.text}
                          </div>

                          <small>
                            {item.time}
                          </small>

                        </div>
                      )
                    )
                  )}

                </div>

                <div
                  style={
                    styles.chatInputRow
                  }
                >

                  <input
                    value={message}
                    onChange={(e) =>
                      setMessage(
                        e.target.value
                      )
                    }
                    onKeyDown={
                      handleChatKeyDown
                    }
                    placeholder="Type a message..."
                    style={
                      styles.chatInput
                    }
                  />

                  <button
                    onClick={
                      sendMessage
                    }
                    style={
                      styles.sendButton
                    }
                  >
                    ➤
                  </button>

                </div>

              </div>
            )}

            {/* PARTICIPANTS */}

            {showParticipants && (
              <div style={styles.panel}>

                <div
                  style={
                    styles.panelHeader
                  }
                >

                  <span>
                    👥 Participants
                  </span>

                  <button
                    onClick={() =>
                      setShowParticipants(
                        false
                      )
                    }
                    style={
                      styles.closeButton
                    }
                  >
                    ✕
                  </button>

                </div>

                <div
                  style={
                    styles.participantList
                  }
                >

                  <div
                    style={
                      styles.listItem
                    }
                  >

                    <div
                      style={
                        styles.smallAvatar
                      }
                    >
                      {currentUser
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div
                      style={{
                        flex: 1,
                      }}
                    >
                      {currentUser}

                      <small
                        style={
                          styles.youText
                        }
                      >
                        You
                      </small>
                    </div>

                    <span>
                      {micOn
                        ? "🎤"
                        : "🔇"}
                    </span>

                  </div>

                  {joinedStudents.map(
                    (student) => (

                      <div
                        key={student.id}
                        style={
                          styles.listItem
                        }
                      >

                        <div
                          style={
                            styles.smallAvatar
                          }
                        >
                          {student.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <div
                          style={{
                            flex: 1,
                          }}
                        >

                          {student.name}

                          <small
                            style={
                              styles.youText
                            }
                          >
                            Joined Student
                          </small>

                        </div>

                        <span>
                          🎤
                          {getRaisedHandStatus(student) && " ✋"}
                        </span>

                      </div>

                    )
                  )}

                </div>

              </div>
            )}

            {/* AI */}

            {showAI && (
              <div style={styles.panel}>

                <div
                  style={
                    styles.panelHeader
                  }
                >

                  <span>
                    🤖 AI Monitoring
                  </span>

                  <button
                    onClick={() =>
                      setShowAI(false)
                    }
                    style={
                      styles.closeButton
                    }
                  >
                    ✕
                  </button>

                </div>

                <div
                  style={styles.aiStatus}
                >

                  <span
                    style={
                      styles.greenDot
                    }
                  >
                    ●
                  </span>

                  AI monitoring connected

                </div>

                <div
                  style={styles.aiCards}
                >

                  <div
                    style={styles.aiCard}
                  >
                    <span>
                      Average Attention
                    </span>

                    <strong>
                      {
                        liveData.averageAttention
                      }%
                    </strong>
                  </div>

                  <div
                    style={styles.aiCard}
                  >
                    <span>
                      Main Emotion
                    </span>

                    <strong>
                      {
                        liveData.mainEmotion
                      }
                    </strong>
                  </div>

                  <div
                    style={styles.aiCard}
                  >
                    <span>
                      Distracted
                    </span>

                    <strong>
                      {
                        liveData.distractedCount
                      }
                    </strong>
                  </div>

                </div>

              </div>
            )}

          </aside>
        )}

      </main>

      {/* CONTROLS */}

      <footer style={styles.controls}>

        <div style={styles.controlGroup}>

          <button
            onClick={toggleMic}
            style={{
              ...styles.controlButton,
              background: micOn
                ? "#1e293b"
                : "#dc2626",
            }}
          >
            {micOn ? "🎤" : "🔇"}

            <span>
              {micOn
                ? "Mute"
                : "Unmute"}
            </span>

          </button>

          <button
            onClick={toggleCamera}
            style={{
              ...styles.controlButton,
              background: cameraOn
                ? "#1e293b"
                : "#dc2626",
            }}
          >
            {cameraOn
              ? "📹"
              : "📵"}

            <span>
              {cameraOn
                ? "Camera"
                : "Camera Off"}
            </span>

          </button>

          <button
            onClick={startScreenShare}
            style={{
              ...styles.controlButton,
              background: screenSharing
                ? "#2563eb"
                : "#1e293b",
            }}
          >
            🖥️

            <span>
              {screenSharing
                ? "Stop Share"
                : "Share Screen"}
            </span>

          </button>

          <button
            onClick={toggleRaiseHand}
            style={{
              ...styles.controlButton,
              background: raisedHand
                ? "#f59e0b"
                : "#1e293b",
            }}
          >
            ✋

            <span>
              {raisedHand
                ? "Lower Hand"
                : "Raise Hand"}
            </span>

          </button>

          <button
            onClick={() =>
              setShowParticipants(
                !showParticipants
              )
            }
            style={
              styles.controlButton
            }
          >
            👥

            <span>
              People
            </span>

          </button>

          <button
            onClick={() =>
              setShowChat(!showChat)
            }
            style={
              styles.controlButton
            }
          >
            💬

            <span>
              Chat
            </span>

          </button>

          <button
            onClick={() =>
              setShowAI(!showAI)
            }
            style={
              styles.controlButton
            }
          >
            🤖

            <span>
              AI
            </span>

          </button>

        </div>

        {teacherName ? (
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={leaveClass} style={styles.leaveButton}>
              ☎ Leave Class
            </button>
            <button
              onClick={endClass}
              style={{ ...styles.leaveButton, background: "#991b1b" }}
            >
              🛑 End Class
            </button>
          </div>
        ) : (
          <button onClick={leaveClass} style={styles.leaveButton}>
            ☎ Leave Class
          </button>
        )}

      </footer>

    </div>
  );
}

// =============================================
// STYLES
// =============================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#020617",
    color: "white",
    display: "flex",
    flexDirection: "column",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  loading: {
    minHeight: "100vh",
    background: "#020617",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingCard: {
    width: "320px",
    padding: "35px",
    borderRadius: "18px",
    background: "#0f172a",
    border: "1px solid #1e293b",
    textAlign: "center",
  },

  loadingIcon: {
    fontSize: "35px",
    marginBottom: "15px",
  },

  header: {
    height: "72px",
    padding: "0 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#0f172a",
    borderBottom: "1px solid #1e293b",
    boxSizing: "border-box",
  },

  logo: {
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "1px",
  },

  classTitle: {
    marginTop: "4px",
    fontSize: "16px",
    fontWeight: "800",
  },

  subject: {
    fontSize: "11px",
    color: "#94a3b8",
    marginTop: "2px",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  classId: {
    padding: "8px 12px",
    borderRadius: "8px",
    background: "#1e293b",
    color: "#cbd5e1",
    fontSize: "11px",
  },

  headerButton: {
    border: "none",
    background: "#2563eb",
    color: "white",
    padding: "9px 12px",
    borderRadius: "8px",
    fontSize: "10px",
    fontWeight: "800",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    display: "flex",
    minHeight: 0,
  },

  videoArea: {
    flex: 1,
    padding: "18px",
    position: "relative",
    overflow: "auto",
  },

  mainVideo: {
    width: "100%",
    height: "430px",
    minHeight: "300px",
    background: "#111827",
    borderRadius: "14px",
    overflow: "hidden",
    position: "relative",
    border: "1px solid #1e293b",
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "scaleX(-1)",
  },

  cameraOff: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    color: "#94a3b8",
  },

  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "800",
  },

  nameTag: {
    position: "absolute",
    left: "14px",
    bottom: "14px",
    background: "rgba(0,0,0,0.65)",
    padding: "7px 10px",
    borderRadius: "7px",
    fontSize: "11px",
  },

  liveTag: {
    position: "absolute",
    right: "14px",
    top: "14px",
    background: "#dc2626",
    padding: "6px 9px",
    borderRadius: "6px",
    fontSize: "10px",
    fontWeight: "800",
  },

  participantGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "10px",
    marginTop: "12px",
  },

  participantCard: {
    height: "120px",
    background: "#111827",
    borderRadius: "10px",
    border: "1px solid #1e293b",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  participantAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#334155",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  participantName: {
    marginTop: "8px",
    fontSize: "11px",
    color: "#cbd5e1",
  },

  micStatus: {
    position: "absolute",
    right: "8px",
    top: "8px",
    fontSize: "10px",
  },

  screenShareBox: {
    width: "100%",
    height: "550px",
    background: "#000",
    borderRadius: "14px",
    overflow: "hidden",
    position: "relative",
  },

  screenVideo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  screenLabel: {
    position: "absolute",
    left: "15px",
    bottom: "15px",
    background: "rgba(0,0,0,0.7)",
    padding: "8px 12px",
    borderRadius: "7px",
    fontSize: "11px",
  },

  sidebar: {
    width: "330px",
    background: "#0f172a",
    borderLeft: "1px solid #1e293b",
    overflowY: "auto",
  },

  panel: {
    borderBottom: "1px solid #1e293b",
    padding: "15px",
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "800",
    fontSize: "13px",
    marginBottom: "15px",
  },

  closeButton: {
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "14px",
  },

  chatMessages: {
    height: "180px",
    overflowY: "auto",
  },

  emptyText: {
    color: "#64748b",
    fontSize: "11px",
    textAlign: "center",
    padding: "30px 0",
  },

  message: {
    background: "#1e293b",
    borderRadius: "8px",
    padding: "8px",
    marginBottom: "7px",
    fontSize: "11px",
  },

  chatInputRow: {
    display: "flex",
    gap: "6px",
    marginTop: "10px",
  },

  chatInput: {
    flex: 1,
    minWidth: 0,
    padding: "9px",
    borderRadius: "7px",
    border: "1px solid #334155",
    background: "#020617",
    color: "white",
    outline: "none",
  },

  sendButton: {
    border: "none",
    borderRadius: "7px",
    padding: "0 12px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },

  participantList: {
    maxHeight: "250px",
    overflowY: "auto",
  },

  listItem: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "9px 0",
    borderBottom: "1px solid #1e293b",
    fontSize: "11px",
  },

  smallAvatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#334155",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "11px",
  },

  youText: {
    display: "block",
    color: "#64748b",
    marginTop: "2px",
  },

  aiStatus: {
    fontSize: "10px",
    color: "#94a3b8",
    marginBottom: "12px",
  },

  greenDot: {
    color: "#22c55e",
    marginRight: "5px",
  },

  aiCards: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "7px",
  },

  aiCard: {
    background: "#1e293b",
    padding: "10px",
    borderRadius: "8px",
  },

  controls: {
    minHeight: "82px",
    background: "#0f172a",
    borderTop: "1px solid #1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 18px",
    boxSizing: "border-box",
    gap: "15px",
  },

  controlGroup: {
    display: "flex",
    gap: "7px",
    flexWrap: "wrap",
  },

  controlButton: {
    border: "none",
    borderRadius: "9px",
    padding: "9px 11px",
    background: "#1e293b",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "10px",
    fontWeight: "700",
  },

  leaveButton: {
    border: "none",
    borderRadius: "9px",
    padding: "11px 15px",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },
};

export default Classroom;