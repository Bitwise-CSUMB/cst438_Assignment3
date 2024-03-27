import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom'
import Button from "@mui/material/Button";
import { SERVER_URL } from '../../Constants';
import { confirmAlert } from "react-confirm-alert";
import AssignmentAdd from "./AssignmentAdd";
import AssignmentGrade from "./AssignmentGrade";
import AssignmentUpdate from "./AssignmentUpdate";

// instructor views assignments for their section
// use location to get the section value
//
// GET assignments using the URL /sections/{secNo}/assignments
// returns a list of AssignmentDTOs
// display a table with columns
// assignment id, title, dueDate and buttons to grade, edit, delete each assignment

const AssignmentsView = (props) => {

    const location = useLocation();
    const {secNo} = location.state;

    const [assignments, setAssignments] = useState([  ]);
    const [message, setMessage] = useState('');
    const headers = ['assignmentId', 'title', 'dueDate', '', '', ''];

    const fetchAssignments = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/sections/${secNo}/assignments`);
        if (response.ok) {
          const assignments = await response.json();
          setAssignments(assignments);
        } else {
          const json = await response.json();
          setMessage("response error: "+json.message);
        }
      } catch (err) {
        setMessage("network error: "+err);
      }
    }

    useEffect( () => {
      fetchAssignments();
    },  []);

  const saveAssignment = async (assignment) => {
    try {
      const response = await fetch (`${SERVER_URL}/courses`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(assignment),
          });
      if (response.ok) {
        setMessage("course saved")
        fetchAssignments();
      } else {
        const json = await response.json();
        setMessage("response error: "+json.message);
      }
    } catch (err) {
      setMessage("network error: "+err);
    }
  }

  const addAssignment = async (assignment) => {
    try {
      const response = await fetch (`${SERVER_URL}/assignments`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(assignment),
          });
      if (response.ok) {
        setMessage("assignment added")
        fetchAssignments();
      } else {
        const rc = await response.json();
        setMessage(rc.message);
      }
    } catch (err) {
      setMessage("network error: "+err);
    }
  }

    const deleteAssignment = async (assignmentId) => {
      try {
        const response = await fetch (`${SERVER_URL}/assignments/${assignmentId}`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            });
        if (response.ok) {
          setMessage("Assignment deleted");
          fetchAssignments();
        } else {
          const rc = await response.json();
          if (rc.message.startsWith("could not execute statement [Referential"))
            setMessage("Delete failed: There are still Grades associated with this assignment.");
          else
            setMessage("Delete failed "+rc.message);
        }
      } catch (err) {
        setMessage("network error: "+err);
      }
    }
    const onDelete = (e) => {
      const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
      const assignmentId = assignments[row_idx].id;
      confirmAlert({
        title: 'Confirm to delete',
        message: 'Do you really want to delete?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => deleteAssignment(assignmentId)
          },
          {
            label: 'No',
          }
        ]
      });
    }

  return (
      <div>
        <h3>Assignments</h3>
        <h5 id="message" className="Error">{message}</h5>
        <table id="assignmentTable" className="Center">
          <thead>
          <tr>
            {headers.map((s, idx) => <th key={idx}>{s}</th>)}
          </tr>
          </thead>
          <tbody>
          {assignments.map((a, idx) => (
              <tr key={idx}>
                <td>{a.id}</td>
                <td>{a.title}</td>
                <td>{a.dueDate}</td>
                <td><AssignmentGrade assignment={a} save={saveAssignment} /></td>
                <td><AssignmentUpdate assignment={a} onClose={fetchAssignments} /></td>
                <td><Button onClick={onDelete}>Delete</Button> </td>
              </tr>
          ))}
          </tbody>
        </table>
        <AssignmentAdd save={addAssignment} />
      </div>
  );
}

export default AssignmentsView;
