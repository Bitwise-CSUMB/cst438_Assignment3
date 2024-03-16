import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import { SERVER_URL } from '../../Constants';
import {Link} from 'react-router-dom';

// instructor views a list of sections they are teaching 
// use the URL /sections?email=dwisneski@csumb.edu&year= &semester=
// the email= will be removed in assignment 7 login security
// The REST api returns a list of SectionDTO objects
// The table of sections contains columns
//   section no, course id, section id, building, room, times and links to assignments and enrollments
// hint:  
// <Link to="/enrollments" state={section}>View Enrollments</Link>
// <Link to="/assignments" state={section}>View Assignments</Link>

const InstructorSectionsView = (props) => {

    const headers = ['SecNo', 'CourseId', 'SecId',  'Year', 'Semester', 'Building', 'Room', 'Times', '', ''];

    const [sections, setSections] = useState([]);
    const [message, setMessage] = useState('');

    const location = useLocation();
    const term = location.state;

    const instructorEmail = 'dwisneski@csumb.edu';

    const fetchSections = async () => {
        if (term.year === '' || term.semester === '') {
            setMessage("Invalid search parameters");
        } else {
            term.semester = (term.semester[0].toUpperCase() + term.semester.slice(1)).trim();
            try {
                const response = await fetch(`${SERVER_URL}/sections?email=${instructorEmail}&year=${term.year}&semester=${term.semester}`);
                if (response.ok) {
                    const data = await response.json();
                    setSections(data);
                    if (data.length === 0) {
                        setMessage("No sections found with given term.");
                    }
                } else {
                    const rc = await response.json();
                    setMessage(rc.message);
                }
            } catch (err) {
                setMessage("Error found: " + err);
            }
        }
    }
     
    useEffect( () => {
        fetchSections();
      },  []);

    return(
        <> 
        <h5 class="Error">{message}</h5>
           <table className="Center" > 
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {sections.map((s) => (
                        <tr key={s.secNo}>
                        <td>{s.secNo}</td>
                        <td>{s.courseId}</td>
                        <td>{s.secId}</td>
                        <td>{s.year}</td>
                        <td>{s.semester}</td>
                        <td>{s.building}</td>
                        <td>{s.room}</td>
                        <td>{s.times}</td>
                        <td><Link to='/enrollments' state={s}>Enrollments</Link></td>
                        <td><Link to='/assignments' state={s}>Assignments</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default InstructorSectionsView;