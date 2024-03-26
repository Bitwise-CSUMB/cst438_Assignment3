import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SERVER_URL } from '../../Constants';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';

// instructor view list of students enrolled in a section 
// use location to get section no passed from InstructorSectionsView
// fetch the enrollments using URL /sections/{secNo}/enrollments
// display table with columns
//   'enrollment id', 'student id', 'name', 'email', 'grade'
//  grade column is an input field
//  hint:  <input type="text" name="grade" value={e.grade} onChange={onGradeChange} />

const EnrollmentsView = () => {

    const headers = ['Enrollment Id', 'Student Id', 'Name', 'Email', 'Grade'];

    const location = useLocation();
    const { secNo, courseId } = location.state;

    const [enrollments, setEnrollments] = useState([]);
    const [message, setMessage] = useState('');

    const fetchEnrollments = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections/${secNo}/enrollments`);
            if (response.ok) {
                const data = await response.json();
                setEnrollments(data);
                if (!data.length)
                    setMessage("No enrollments found with this section.");
            }
            else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("Error found: " + err);
        }
    }

    const editChange = (event) => {
        const idx = event.target.parentElement.parentElement.parentElement.parentElement.rowIndex - 1;

        const updatedEnrollments = [...enrollments];
        updatedEnrollments[idx] = { ...updatedEnrollments[idx], [event.target.name]: event.target.value.trim().toUpperCase() };

        setEnrollments(updatedEnrollments);
    }

    const saveChanges = async () => {
        for (let i = 0; i < enrollments.length; i++) {
            let g = enrollments[i].grade.toUpperCase().trim();
            if (!g.match(/^[A-DF]([-+]?|\b)$/)) {
                setMessage("Enrollment " + enrollments[i].enrollmentId + " has an invalid grade.");
                return;
            }
        }

        try {
            const response = await fetch(`${SERVER_URL}/enrollments`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(enrollments),
                });
            if (response.ok) {
                setMessage("Enrollments saved");
                fetchEnrollments();
            } else {
                const json = await response.json();
                setMessage("Response error: " + json.message);
            }
        } catch (err) {
            setMessage("Error: " + err);
        }
    }

    useEffect(() => {
        fetchEnrollments();
    }, []);

    return (
        <>
            <h3>{courseId} Enrollments</h3>
            <h5 className="Error">{message}</h5>
            <table className="Center" >
                <thead>
                    <tr>
                        {headers.map((h, idx) => (<th key={idx}>{h}</th>))}
                    </tr>
                </thead>
                <tbody>
                    {enrollments.map((e, idx) => (
                        <tr key={idx}>
                            <td>{e.enrollmentId}</td>
                            <td>{e.studentId}</td>
                            <td>{e.name}</td>
                            <td>{e.email}</td>
                            <td><TextField style={{ padding: 10 }} fullWidth label="grade" name="grade" defaultValue={e.grade} onChange={editChange} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Button id="saveBtn" onClick={saveChanges}>Save Changes</Button>
        </>
    );
}

export default EnrollmentsView;