import React, { useState } from 'react';
import {SERVER_URL} from "../../Constants";

// student views a list of assignments and assignment grades 
// use the URL  /assignments?studentId= &year= &semester=
// The REST api returns a list of SectionDTO objects
// Use a value of studentId=3 for now. Until login is implemented in assignment 7.

// display a table with columns  Course Id, Assignment Title, Assignment DueDate, Score

const AssignmentsStudentView = (props) => {

    const studentId = 3; // Placeholder until login is implemented
    const headers = ['Course', 'Title', 'Due Date', 'Score'];

    // States
    const [assignments, setAssignments] = useState([]);
    const [showHeaders, setShowHeaders] = useState(false);
    const [message, setMessage] = useState('');
    const [search, setSearch] = useState({ studentId: studentId, year: '', semester: '' });

    // Function to fetch assignments data from the server
    const fetchAssignments = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments?studentId=${search.studentId}&year=${search.year}&semester=${search.semester}`);
            if (response.ok) {
                const data = await response.json();
                setAssignments(data);
                setShowHeaders(true);
            } else {
                const error = await response.json();
                setMessage('Error: ' + error.message);
            }
        } catch (err) {
            setMessage('Network error: ' + err.message);
        }
    };

    // Function to handle changes in search parameters
    const editChange = (event) => {
        setSearch(prevSearch => ({ ...prevSearch, [event.target.name]: event.target.value }));
    };

    // JSX for rendering the component
    return (
        <div>
            <h3>Assignments</h3>
            <table className="Center">
                <tbody>
                <tr>
                    <td>Year:</td>
                    <td>
                        <select name="year" value={search.year} onChange={editChange}>
                            <option value="">Select Year</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Semester:</td>
                    <td>
                        <select name="semester" value={search.semester} onChange={editChange}>
                            <option value="">Select Semester</option>
                            <option value="Spring">Spring</option>
                            <option value="Summer">Summer</option>
                            <option value="Fall">Fall</option>
                        </select>
                    </td>
                </tr>
                </tbody>
            </table>
            <br/><button type="submit" onClick={fetchAssignments}>Search</button><br/><br/>
            {showHeaders && (
                <table className="Center">
                    <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {assignments.map((assignment) => (
                        <tr key={assignment.courseId}>
                            <td>{assignment.courseId}</td>
                            <td>{assignment.title}</td>
                            <td>{assignment.dueDate}</td>
                            <td>{assignment.score}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AssignmentsStudentView;