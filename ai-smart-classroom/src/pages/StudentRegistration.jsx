import { useEffect, useState } from "react";
import * as faceapi from "face-api.js";

function StudentRegistration() {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [photo, setPhoto] = useState(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);

  const [students, setStudents] = useState(() => {
    return JSON.parse(
      localStorage.getItem("registeredStudents") || "[]"
    );
  });

  // Load face recognition models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(
          "/models"
        );

        await faceapi.nets.faceLandmark68Net.loadFromUri(
          "/models"
        );

        await faceapi.nets.faceRecognitionNet.loadFromUri(
          "/models"
        );

        setModelsLoaded(true);

        console.log("Face recognition models loaded");
      } catch (error) {
        console.error(
          "Error loading face recognition models:",
          error
        );
      }
    };

    loadModels();
  }, []);

  // Select photo
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPhoto(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // Register student
  const registerStudent = async () => {

    if (!studentId || !studentName || !photo) {
      alert(
        "Please enter Student ID, Name and Photo."
      );
      return;
    }

    if (!modelsLoaded) {
      alert(
        "Face recognition models are still loading. Please wait."
      );
      return;
    }

    // Check duplicate ID
    const alreadyExists = students.some(
      (student) => student.id === studentId
    );

    if (alreadyExists) {
      alert("Student ID already exists.");
      return;
    }

    try {

      // Create image element
      const image = new Image();

      image.src = photo;

      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      // Detect face and create descriptor
      const detection = await faceapi
        .detectSingleFace(
          image,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320,
            scoreThreshold: 0.5,
          })
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        alert(
          "No face detected in this photo. Please choose a clear face photo."
        );
        return;
      }

      // Convert descriptor to normal array
      const descriptor = Array.from(
        detection.descriptor
      );

      const newStudent = {
        id: studentId,
        name: studentName,
        photo: photo,
        descriptor: descriptor,
      };

      const updatedStudents = [
        ...students,
        newStudent,
      ];

      setStudents(updatedStudents);

      localStorage.setItem(
        "registeredStudents",
        JSON.stringify(updatedStudents)
      );

      // Clear form
      setStudentId("");
      setStudentName("");
      setPhoto(null);

      const photoInput =
        document.getElementById("studentPhoto");

      if (photoInput) {
        photoInput.value = "";
      }

      alert(
        `${studentName} registered successfully!`
      );

    } catch (error) {

      console.error(
        "Face registration error:",
        error
      );

      alert(
        "Unable to process the face. Please use a clear photo."
      );
    }
  };

  // Delete student
  const deleteStudent = (id) => {

    const updatedStudents = students.filter(
      (student) => student.id !== id
    );

    setStudents(updatedStudents);

    localStorage.setItem(
      "registeredStudents",
      JSON.stringify(updatedStudents)
    );
  };

  return (
    <div className="page-container">

      {/* Header */}
      <div className="dashboard-header">

        <div>
          <h1>Student Registration</h1>

          <p>
            Register students for AI face recognition
            and attendance.
          </p>
        </div>

        <span
          className={`monitor-status ${
            modelsLoaded ? "active" : ""
          }`}
        >
          {modelsLoaded
            ? "🟢 AI Ready"
            : "🟡 Loading AI..."}
        </span>

      </div>


      {/* Registration Form */}
      <div className="camera-card">

        <h2>Register New Student</h2>

        <p className="form-description">
          Enter student details and upload a clear
          face photo.
        </p>

        <div className="student-form">

          {/* Student ID */}
          <div className="form-group">

            <label>
              Student ID
            </label>

            <input
              type="text"
              placeholder="Example: ST001"
              value={studentId}
              onChange={(e) =>
                setStudentId(e.target.value)
              }
            />

          </div>


          {/* Student Name */}
          <div className="form-group">

            <label>
              Student Name
            </label>

            <input
              type="text"
              placeholder="Enter student name"
              value={studentName}
              onChange={(e) =>
                setStudentName(e.target.value)
              }
            />

          </div>


          {/* Photo */}
          <div className="form-group">

            <label>
              Student Photo
            </label>

            <input
              id="studentPhoto"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />

          </div>


          {/* Photo Preview */}
          {photo && (
            <div className="photo-preview">

              <img
                src={photo}
                alt="Student preview"
              />

            </div>
          )}


          {/* Register Button */}
          <button
            className="monitor-button register-button"
            onClick={registerStudent}
            disabled={!modelsLoaded}
          >
            {modelsLoaded
              ? "+ Register Student"
              : "Loading AI Models..."}
          </button>

        </div>

      </div>


      {/* Registered Students */}
      <div className="camera-card">

        <h2>Registered Students</h2>

        <p className="form-description">
          Students currently registered for
          face recognition.
        </p>

        {students.length === 0 ? (

          <div className="no-students">

            <p>
              No students registered
            </p>

            <span>
              Register a student using the form above.
            </span>

          </div>

        ) : (

          <div className="registered-student-grid">

            {students.map((student) => (

              <div
                className="registered-student-card"
                key={student.id}
              >

                <img
                  src={student.photo}
                  alt={student.name}
                  className="registered-student-photo"
                />

                <div className="registered-student-info">

                  <h3>
                    {student.name}
                  </h3>

                  <p>
                    ID: {student.id}
                  </p>

                  <p className="status-good">
                    ✓ Face Registered
                  </p>

                  <button
                    className="delete-student-button"
                    onClick={() =>
                      deleteStudent(student.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default StudentRegistration;