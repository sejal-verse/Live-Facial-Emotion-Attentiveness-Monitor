import React from "react";

function Reports() {

    const students = [
        {
            name: "Rahul",
            attendance: "100%",
            attention: "92%",
            emotion: "Happy",
            performance: "Excellent"
        },
        {
            name: "Anita",
            attendance: "100%",
            attention: "84%",
            emotion: "Neutral",
            performance: "Good"
        },
        {
            name: "Riya",
            attendance: "0%",
            attention: "61%",
            emotion: "Sad",
            performance: "Needs Attention"
        },
        {
            name: "Aman",
            attendance: "100%",
            attention: "89%",
            emotion: "Happy",
            performance: "Excellent"
        },
        {
            name: "Priya",
            attendance: "100%",
            attention: "74%",
            emotion: "Neutral",
            performance: "Good"
        }
    ];

    return (

        <div className="page">

            {/* Header */}

            <div className="report-header">

                <div>

                    <h1>AI Class Reports</h1>

                    <p>
                        AI-generated analysis of classroom performance.
                    </p>

                </div>

                <button
                    className="generate-report-button"
                    onClick={() => window.print()}
                >
                    GENERATE REPORT
                </button>

            </div>


            {/* Class Summary */}

            <div className="report-summary">

                <div className="report-card">

                    <span>Total Students</span>

                    <h2>40</h2>

                </div>

                <div className="report-card">

                    <span>Attendance</span>

                    <h2>92%</h2>

                </div>

                <div className="report-card">

                    <span>Average Attention</span>

                    <h2>78%</h2>

                </div>

                <div className="report-card">

                    <span>Distraction</span>

                    <h2>12%</h2>

                </div>

            </div>


            {/* AI Summary */}

            <div className="ai-summary">

                <div className="ai-title">

                    <span>🤖</span>

                    <div>

                        <h2>AI Class Summary</h2>

                        <p>
                            Automatically generated classroom insights
                        </p>

                    </div>

                </div>


                <p className="summary-text">

                    The class showed an overall attention level of
                    <strong> 78%</strong> with good student engagement.
                    Most students remained focused during the session.
                    The most commonly detected emotion was
                    <strong> Neutral</strong>. A small number of students
                    showed signs of distraction and may require additional
                    attention from the teacher.

                </p>

            </div>


            {/* Key Insights */}

            <div className="insights-grid">

                <div className="insight-box">

                    <h3>👁️ Attention Analysis</h3>

                    <p>
                        Class attention remained stable throughout the
                        session, with an average of 78%.
                    </p>

                </div>


                <div className="insight-box">

                    <h3>😊 Emotion Analysis</h3>

                    <p>
                        Neutral was the most frequently detected emotion,
                        followed by Happy.
                    </p>

                </div>


                <div className="insight-box">

                    <h3>⚠️ Distraction Analysis</h3>

                    <p>
                        Overall distraction was low, but a few students
                        showed reduced attention.
                    </p>

                </div>


                <div className="insight-box">

                    <h3>💡 AI Recommendation</h3>

                    <p>
                        Consider interactive questions or short activities
                        when attention levels decrease.
                    </p>

                </div>

            </div>


            {/* Student Report */}

            <div className="student-report">

                <h2>Student Performance Report</h2>

                <p>
                    AI-based individual student analysis
                </p>


                <table>

                    <thead>

                        <tr>

                            <th>Student</th>
                            <th>Attendance</th>
                            <th>Attention</th>
                            <th>Emotion</th>
                            <th>Performance</th>

                        </tr>

                    </thead>


                    <tbody>

                        {students.map((student) => (

                            <tr key={student.name}>

                                <td>
                                    <strong>{student.name}</strong>
                                </td>

                                <td>{student.attendance}</td>

                                <td>{student.attention}</td>

                                <td>{student.emotion}</td>

                                <td>

                                    <span
                                        className={
                                            student.performance === "Excellent"
                                                ? "performance-excellent"
                                                : student.performance === "Good"
                                                    ? "performance-good"
                                                    : "performance-attention"
                                        }
                                    >

                                        {student.performance}

                                    </span>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>


            {/* Teacher Recommendation */}

            <div className="teacher-recommendation">

                <h2>💡 Teacher Recommendations</h2>

                <ul>

                    <li>
                        Encourage students with low attention to participate
                        in interactive activities.
                    </li>

                    <li>
                        Monitor students who frequently appear distracted.
                    </li>

                    <li>
                        Use short breaks when classroom attention decreases.
                    </li>

                    <li>
                        Continue using interactive teaching methods to maintain
                        student engagement.
                    </li>

                </ul>

            </div>

        </div>
    );
}

export default Reports;