
import React, {useState, useEffect} from "react";
import {SERVER_URL} from "../../Constants";

// students gets a list of all courses taken and grades
// use the URL /transcript?studentId=
// the REST api returns a list of EnrollmentDTO objects
// the table should have columns for
//  Year, Semester, CourseId, SectionId, Title, Credits, Grade

const Transcript = () => {

    const studentId = 3; // TODO: Temp hardcode
    const headers = ["Year", "Semester", "CourseId", "SectionId", "Title", "Credits", "Grade"];

    const [message, setMessage] = useState("");
    const [transcripts, setTranscripts] = useState([]);

    const fetchTranscripts = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/transcripts?studentId=${studentId}`);
            if (response.ok) {
                const transcripts = await response.json();
                setTranscripts(transcripts);
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

    useEffect(() => { fetchTranscripts(); }, []);

    return (
        <>
            <h3>Transcript</h3>
            <h5 className="Error">{message}</h5>
            <table className="Center Border">
                <thead>
                    <tr>
                        {headers.map((s, idx) => <th key={idx}>{s}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {transcripts.map((a, idx) => (
                        <tr key={idx}>
                            <td>{a.year}</td>
                            <td>{a.semester}</td>
                            <td>{a.courseId}</td>
                            <td>{a.sectionId}</td>
                            <td>{a.courseTitle}</td>
                            <td>{a.credits}</td>
                            <td>{a.grade}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default Transcript;
