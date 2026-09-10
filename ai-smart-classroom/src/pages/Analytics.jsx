import React from "react";

function Analytics() {

    return (
        <div className="page">

            <h1>Class Analytics</h1>

            <p>
                View student performance and class statistics.
            </p>

            <div className="cards">

                <div className="card">
                    <h3>Average Attention</h3>
                    <h2>78%</h2>
                </div>

                <div className="card">
                    <h3>Happy</h3>
                    <h2>35%</h2>
                </div>

                <div className="card">
                    <h3>Neutral</h3>
                    <h2>45%</h2>
                </div>

                <div className="card">
                    <h3>Distraction</h3>
                    <h2>12%</h2>
                </div>

            </div>

        </div>
    );
}

export default Analytics;