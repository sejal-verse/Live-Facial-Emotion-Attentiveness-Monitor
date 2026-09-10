import React from "react";
import { Link } from "react-router-dom";

function TeacherDashboard() {

    return (

        <div className="dashboard">

            {/* Sidebar */}

            <div className="sidebar">

                <h2>AI CLASSROOM</h2>

                <Link to="/">
                    Dashboard
                </Link>

                <Link to="/attendance">
                    Attendance
                </Link>

                <Link to="/monitoring">
                    Monitoring
                </Link>

                <Link to="/analytics">
                    Analytics
                </Link>

                <Link to="/reports">
                    AI Reports
                </Link>

            </div>


            {/* Main Content */}

            <div className="main-content">

                <h1>Teacher Dashboard</h1>

                <p>Welcome, Teacher!</p>


                <div className="cards">

                    <div className="card">

                        <h3>Total Students</h3>

                        <h2>40</h2>

                    </div>


                    <div className="card">

                        <h3>Present</h3>

                        <h2>37</h2>

                    </div>


                    <div className="card">

                        <h3>Average Attention</h3>

                        <h2>78%</h2>

                    </div>


                    <div className="card">

                        <h3>Distraction</h3>

                        <h2>12%</h2>

                    </div>

                </div>


                <div className="start-class">

                    <h2>Start Class Monitoring</h2>

                    <p>
                        Monitor student attendance,
                        emotions, attention and distractions.
                    </p>

                    <Link to="/monitoring">

                        <button className="start-button">
                            START CLASS
                        </button>

                    </Link>

                </div>

            </div>

        </div>
    );
}

export default TeacherDashboard;