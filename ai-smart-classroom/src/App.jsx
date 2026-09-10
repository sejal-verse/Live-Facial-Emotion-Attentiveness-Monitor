import React from "react";

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import TeacherDashboard from "./pages/TeacherDashboard";
import Attendance from "./pages/Attendance";
import Monitoring from "./pages/Monitoring";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<TeacherDashboard />}
                />

                <Route
                    path="/attendance"
                    element={<Attendance />}
                />

                <Route
                    path="/monitoring"
                    element={<Monitoring />}
                />

                <Route
                    path="/analytics"
                    element={<Analytics />}
                />

                <Route
                    path="/reports"
                    element={<Reports />}
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;