import React, { useState, useEffect } from 'react';
import {confirmAlert} from "react-confirm-alert";
import Button from "@mui/material/Button";
import {SERVER_URL} from "../../Constants";

// students displays a list of open sections for a 
// use the URL /sections/open
// the REST api returns a list of SectionDTO objects

// the student can select a section and enroll
// issue a POST with the URL /enrollments?secNo= &studentId=3
// studentId=3 will be removed in assignment 7.

const CourseEnroll = () => {

    const studentId = 3; // Placeholder until login is implemented
    const headers = ['Semester', 'Section No', 'Course Id', 'Section Id', 'Room', 'Times', 'Instructor', 'Instructor Email', ''];

    // States
    const [openCourses, setOpenCourses] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch open courses from the server
    const fetchOpenCourses = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections/open`);
            if (response.ok) {
                const data = await response.json();
                setOpenCourses(data);
            } else {
                const error = await response.json();
                setMessage('Response Error: ' + error.message);
            }
        } catch (err) {
            setMessage('Network error: ' + err.message);
        } finally {
        setLoading(false); // Set loading to false after fetching data
        }
    };

    useEffect(() => {
        fetchOpenCourses();
    }, []);

    // Function to display confirmation dialog for enrollment
    const enrollAlert = (event, rowIndex) => {
        const selectedCourse = openCourses[rowIndex];
        confirmAlert({
            title: 'Confirm Enrollment',
            message: `Are you sure you want to enroll in Section ${selectedCourse.secNo} ${selectedCourse.courseId.toUpperCase()}?`,
            buttons: [
                {
                    label: 'Enroll',
                    id: 'Confirm',
                    onClick: () => doEnroll(selectedCourse.secNo),
                },
                {
                    label: 'Cancel',
                },
            ],
        });
    };

    // Function to enroll in a course
    const doEnroll = async (selectedCourseSecNo) => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollments/sections/${selectedCourseSecNo}?studentId=${studentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setMessage(`You have enrolled in Section ${selectedCourseSecNo}!`);
                await fetchOpenCourses();
            } else {
                const errorResponse = await response.json();
                setMessage("Enrollment error: " + errorResponse.message);
            }
        } catch (err) {
            setMessage("Network error: " + err);
        }
    };

    // JSX for rendering the component
    return (
        <div>
            <h3>Open Courses</h3>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="Center Border" style={{marginTop: 10}}>
                    <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {openCourses.map((course, index) => (
                        <tr key={course.secNo}>
                            <td>{course.semester}</td>
                            <td>{course.secNo}</td>
                            <td>{course.courseId}</td>
                            <td>{course.secId}</td>
                            <td>{course.room}</td>
                            <td>{course.times}</td>
                            <td>{course.instructorName}</td>
                            <td>{course.instructorEmail}</td>
                            <td>
                                <Button id="Enroll" variant="contained" onClick={(event) => enrollAlert(event, index)}>Enroll</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            <h4>{message}</h4>
        </div>
    );
};

export default CourseEnroll;