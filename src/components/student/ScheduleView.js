
import React, {useState} from "react";
import Button from "@mui/material/Button";
import {SERVER_URL} from "../../Constants";
import TextField from "@mui/material/TextField";

// student can view schedule of sections
// use the URL /enrollment?studentId=3&year= &semester=
// The REST api returns a list of EnrollmentDTO objects
// studentId=3 will be removed in assignment 7

// to drop a course
// issue a DELETE with URL /enrollment/{enrollmentId}

const ScheduleView = () => {

    const studentId = 3; // TODO: Temp hardcode
    const headers = ["CourseId", "SectionId", "Title", "Credits", "Grade", ""];

    const [message, setMessage] = useState("");

    const [internalYear, setInternalYear] = useState("");
    const [internalSemester, setInternalSemester] = useState("");

    const [year, setYear] = useState("");
    const [semester, setSemester]  = useState("");

    const [enrollments, setEnrollments] = useState([]);

    const yearChange = (event) => { setInternalYear(event.target.value); };

    const semesterChange = (event) => { setInternalSemester(event.target.value); };

    const fetchEnrollments = async (year, semester) => {
        try {
            const response = await fetch(
                `${SERVER_URL}/enrollments?studentId=${studentId}&year=${year}&semester=${semester}`
            );

            if (response.ok) {
                const enrollments = await response.json();
                setEnrollments(enrollments);
            }
            else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        }
        catch (err) {
            setMessage("network error: " + err);
        }
    }

    const query = () => {

        if (internalYear.trim().length === 0 || isNaN(Number(internalYear))) {
            setMessage("Invalid year");
            setYear("");
            setSemester("");
            setEnrollments([]);
            return;
        }
        else {
            setMessage("");
        }

        setYear(internalYear)
        setSemester(internalSemester)
        fetchEnrollments(internalYear, internalSemester)
    };

    const dropCourse = async (event) => {

        const idx = event.target.parentElement.parentElement.rowIndex - 1;
        const enrollmentId = enrollments[idx].enrollmentId;

        try {
            const response = await fetch(
                `${SERVER_URL}/enrollments/${enrollmentId}`,
                { method: "DELETE" }
            );

            if (response.ok) {
                setEnrollments(enrollments.filter((e) => e.enrollmentId !== enrollmentId));
            }
            else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        }
        catch (err) {
            setMessage("network error: " + err);
        }
    }

    return (
        <div className="Center-Flex-Horizontally">
            <div>
                <h3>Schedule</h3>
                <h5 className="Error">{message}</h5>

                <div className="Center-Flex-Vertically">
                    <TextField autoFocus label="Year" name="year" onChange={yearChange}/>
                    <TextField style={{marginLeft: 5}} label="Semester" name="semester" onChange={semesterChange}/>
                    <Button style={{marginLeft: 5}} variant="contained" onClick={query}>Query</Button><br></br>
                </div>

                <div className="Text-Align-Left" style={{marginTop: 10}}>
                    <div><b>Year:</b> {year}</div>
                    <div><b>Semester:</b> {semester}</div>
                </div>

                <table className="Center Border Fill-Width" style={{marginTop: 10}}>
                    <thead>
                        <tr>
                            {headers.map((s, idx) => <th key={idx}>{s}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {enrollments.map((a, idx) => (
                            <tr key={idx}>
                                <td>{a.courseId}</td>
                                <td>{a.sectionId}</td>
                                <td>{a.courseTitle}</td>
                                <td>{a.credits}</td>
                                <td>{a.grade}</td>
                                <td><Button onClick={dropCourse}>Drop Course</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ScheduleView;
