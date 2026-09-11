import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend
);

function Analytics() {

    /* Attention data */

    const attentionData = {
        labels: [
            "9:00",
            "9:10",
            "9:20",
            "9:30",
            "9:40",
            "9:50",
            "10:00"
        ],

        datasets: [
            {
                label: "Average Attention",
                data: [72, 76, 81, 78, 84, 80, 86],
                tension: 0.4
            }
        ]
    };


    const attentionOptions = {
        responsive: true,

        plugins: {
            legend: {
                display: true
            }
        },

        scales: {
            y: {
                min: 0,
                max: 100
            }
        }
    };


    /* Emotion data */

    const emotionData = {

        labels: [
            "Happy",
            "Neutral",
            "Sad",
            "Angry",
            "Surprised"
        ],

        datasets: [
            {
                data: [35, 45, 8, 5, 7]
            }
        ]
    };


    const emotionOptions = {
        responsive: true,

        plugins: {
            legend: {
                position: "bottom"
            }
        }
    };


    const students = [
        {
            name: "Rahul",
            attention: 92,
            emotion: "Happy",
            distraction: "Low"
        },
        {
            name: "Anita",
            attention: 84,
            emotion: "Neutral",
            distraction: "Low"
        },
        {
            name: "Riya",
            attention: 61,
            emotion: "Sad",
            distraction: "High"
        },
        {
            name: "Aman",
            attention: 89,
            emotion: "Happy",
            distraction: "Low"
        },
        {
            name: "Priya",
            attention: 74,
            emotion: "Neutral",
            distraction: "Medium"
        }
    ];


    return (

        <div className="page">

            {/* Header */}

            <div className="analytics-header">

                <div>

                    <h1>Class Analytics</h1>

                    <p>
                        Analyze student attention, emotions and classroom performance.
                    </p>

                </div>

                <button className="report-button">
                    GENERATE REPORT
                </button>

            </div>


            {/* Summary Cards */}

            <div className="analytics-cards">

                <div className="analytics-card">

                    <span>Average Attention</span>

                    <h2>78%</h2>

                    <small>↑ 5% from previous class</small>

                </div>


                <div className="analytics-card">

                    <span>Positive Emotions</span>

                    <h2>80%</h2>

                    <small>Happy + Neutral</small>

                </div>


                <div className="analytics-card">

                    <span>Distraction Rate</span>

                    <h2>12%</h2>

                    <small>↓ 3% from previous class</small>

                </div>


                <div className="analytics-card">

                    <span>Class Participation</span>

                    <h2>86%</h2>

                    <small>Overall engagement</small>

                </div>

            </div>


            {/* Charts */}

            <div className="analytics-grid">

                <div className="chart-card">

                    <h2>Attention Trend</h2>

                    <p>
                        Average classroom attention during the class
                    </p>

                    <div className="chart-container">

                        <Line
                            data={attentionData}
                            options={attentionOptions}
                        />

                    </div>

                </div>


                <div className="chart-card">

                    <h2>Emotion Distribution</h2>

                    <p>
                        Detected student emotions
                    </p>

                    <div className="emotion-chart">

                        <Doughnut
                            data={emotionData}
                            options={emotionOptions}
                        />

                    </div>

                </div>

            </div>


            {/* Student Performance */}

            <div className="performance-card">

                <div className="section-header">

                    <div>

                        <h2>Student Performance</h2>

                        <p>
                            AI-based student engagement analysis
                        </p>

                    </div>

                </div>


                <table>

                    <thead>

                        <tr>

                            <th>Student</th>
                            <th>Attention</th>
                            <th>Emotion</th>
                            <th>Distraction</th>
                            <th>Performance</th>

                        </tr>

                    </thead>


                    <tbody>

                        {students.map((student) => (

                            <tr key={student.name}>

                                <td>
                                    <strong>{student.name}</strong>
                                </td>

                                <td>

                                    <div className="analytics-attention">

                                        <div
                                            style={{
                                                width: `${student.attention}%`
                                            }}
                                        ></div>

                                    </div>

                                    {student.attention}%

                                </td>

                                <td>
                                    {student.emotion}
                                </td>

                                <td>

                                    <span
                                        className={
                                            student.distraction === "Low"
                                                ? "distraction-low"
                                                : student.distraction === "Medium"
                                                    ? "distraction-medium"
                                                    : "distraction-high"
                                        }
                                    >

                                        {student.distraction}

                                    </span>

                                </td>

                                <td>

                                    {student.attention >= 85
                                        ? "Excellent"
                                        : student.attention >= 70
                                            ? "Good"
                                            : "Needs Attention"}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Analytics;