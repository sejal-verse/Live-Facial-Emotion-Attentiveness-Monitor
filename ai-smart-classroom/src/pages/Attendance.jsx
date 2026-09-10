import React from "react";

function Attendance() {

    const students = [
        { id: 1, name: "Rahul", status: "Present" },
        { id: 2, name: "Anita", status: "Present" },
        { id: 3, name: "Riya", status: "Absent" },
        { id: 4, name: "Aman", status: "Present" },
        { id: 5, name: "Priya", status: "Present" }
    ];

    return (
        <div className="page">

            <h1>Smart Attendance</h1>

            <p>
                Student attendance during the online class.
            </p>

            <table>

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Student Name</th>
                        <th>Status</th>
                    </tr>

                </thead>

                <tbody>

                    {students.map((student) => (

                        <tr key={student.id}>

                            <td>{student.id}</td>

                            <td>{student.name}</td>

                            <td>{student.status}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default Attendance;