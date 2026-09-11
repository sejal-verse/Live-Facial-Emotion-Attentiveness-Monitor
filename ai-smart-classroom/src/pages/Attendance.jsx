import { useEffect, useState } from "react";

function Attendance() {

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Load attendance from localStorage
  const loadAttendance = () => {

    const attendanceData = JSON.parse(
      localStorage.getItem("classAttendance") || "{}"
    );

    const todayAttendance =
      attendanceData[date] || {};

    const registeredStudents = JSON.parse(
      localStorage.getItem("registeredStudents") || "[]"
    );

    const studentList = registeredStudents.map(
      (student) => {

        const status =
          todayAttendance[student.name] ||
          "Absent";

        return {
          id: student.id,
          name: student.name,
          status: status,
        };
      }
    );

    setStudents(studentList);
  };


  // Load when page opens
  useEffect(() => {

    loadAttendance();

  }, [date]);


  // Automatically refresh attendance
  useEffect(() => {

    const interval = setInterval(() => {
      loadAttendance();
    }, 2000);

    return () => {
      clearInterval(interval);
    };

  }, [date]);


  // Search students
  const filteredStudents = students.filter(
    (student) =>
      student.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      student.id
        .toLowerCase()
        .includes(search.toLowerCase())
  );


  // Statistics
  const totalStudents = students.length;

  const presentStudents = students.filter(
    (student) =>
      student.status === "Present"
  ).length;

  const absentStudents =
    totalStudents - presentStudents;

  const attendancePercentage =
    totalStudents > 0
      ? Math.round(
          (presentStudents /
            totalStudents) *
            100
        )
      : 0;


  return (
    <div className="page-container">

      {/* Header */}
      <div className="dashboard-header">

        <div>

          <h1>
            Attendance
          </h1>

          <p>
            AI-powered student attendance
            tracking.
          </p>

        </div>

      </div>


      {/* Date and Search */}
      <div className="camera-card">

        <div className="attendance-controls">

          <div className="form-group">

            <label>
              Select Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
            />

          </div>


          <div className="form-group">

            <label>
              Search Student
            </label>

            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

      </div>


      {/* Statistics */}
      <div className="attendance-stats">

        {/* Total */}
        <div className="attendance-stat-card">

          <div className="attendance-stat-icon">
            👥
          </div>

          <div>

            <span>
              Total Students
            </span>

            <h2>
              {totalStudents}
            </h2>

          </div>

        </div>


        {/* Present */}
        <div className="attendance-stat-card">

          <div className="attendance-stat-icon">
            ✓
          </div>

          <div>

            <span>
              Present
            </span>

            <h2 className="status-good">
              {presentStudents}
            </h2>

          </div>

        </div>


        {/* Absent */}
        <div className="attendance-stat-card">

          <div className="attendance-stat-icon">
            ✕
          </div>

          <div>

            <span>
              Absent
            </span>

            <h2 className="status-danger">
              {absentStudents}
            </h2>

          </div>

        </div>


        {/* Percentage */}
        <div className="attendance-stat-card">

          <div className="attendance-stat-icon">
            📊
          </div>

          <div>

            <span>
              Attendance
            </span>

            <h2>
              {attendancePercentage}%
            </h2>

          </div>

        </div>

      </div>


      {/* Attendance Table */}
      <div className="camera-card">

        <div className="card-title">

          <div>

            <h2>
              Attendance Records
            </h2>

            <p>
              Date: {date}
            </p>

          </div>

          <span className="camera-live">
            ● LIVE
          </span>

        </div>


        {students.length === 0 ? (

          <div className="no-students">

            <p>
              No students registered
            </p>

            <span>
              Register students first from
              Student Registration.
            </span>

          </div>

        ) : (

          <div className="attendance-table-container">

            <table className="attendance-table">

              <thead>

                <tr>

                  <th>
                    Student ID
                  </th>

                  <th>
                    Student Name
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Detection
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredStudents.map(
                  (student) => (

                    <tr key={student.id}>

                      <td>
                        {student.id}
                      </td>

                      <td>
                        <strong>
                          {student.name}
                        </strong>
                      </td>

                      <td>

                        <span
                          className={
                            student.status ===
                            "Present"
                              ? "attendance-present"
                              : "attendance-absent"
                          }
                        >
                          {student.status ===
                          "Present"
                            ? "✓ Present"
                            : "✕ Absent"}
                        </span>

                      </td>

                      <td>

                        {student.status ===
                        "Present" ? (
                          <span className="status-good">
                            AI Recognized
                          </span>
                        ) : (
                          <span className="status-warning">
                            Not Detected
                          </span>
                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* Information */}
      <div className="ai-monitor-status">

        <h2>
          How AI Attendance Works
        </h2>

        <div className="attendance-flow">

          <div className="attendance-flow-item">

            <span>
              📹
            </span>

            <h3>
              Camera
            </h3>

            <p>
              Classroom camera captures
              student faces.
            </p>

          </div>


          <div className="attendance-flow-item">

            <span>
              🤖
            </span>

            <h3>
              AI Recognition
            </h3>

            <p>
              Face recognition identifies
              registered students.
            </p>

          </div>


          <div className="attendance-flow-item">

            <span>
              📋
            </span>

            <h3>
              Attendance
            </h3>

            <p>
              Recognized students are
              automatically marked present.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Attendance;