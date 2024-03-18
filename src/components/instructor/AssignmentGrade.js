import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import { SERVER_URL } from '../../Constants';

// instructor enters students' grades for an assignment
// fetch the grades using the URL /assignment/{id}/grades
// REST api returns a list of GradeDTO objects
// display the list as a table with columns 'gradeId', 'student name', 'student email', 'score' 
// score column is an input field 
//  <input type="text" name="score" value={g.score} onChange={onChange} />
 

const AssignmentGrade = (props) => {
 
    const a = props.assignment;

    const headers = ['Grade Id', 'Student Name', 'Student Email',  'Score'];
    const [open, setOpen] = useState(false);
    const [grades, setGrades] = useState([]);
    const [scores, setScores] = useState([]);
    const [message, setMessage] = useState('');

    const fetchGrades = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/assignments/${a.id}/grades`);
        if (response.ok) {
          const data = await response.json();
          setGrades(data);
          setScores(data.map(obj => obj.score));
          if (data.length === 0) {
            setMessage("No grades found for this assignment.");
          }
        }
        else {
          const rc = await response.json();
          setMessage(rc.message);
        }
      } catch (err) {
        setMessage("Error found: " + err);
      }
    }

    useEffect( () => {
      fetchGrades();
    },  []);
 
    const editOpen = () => {
        setOpen(true);
      };
    
    const editClose = () => {
      fetchGrades();
      setOpen(false);
    };

    const editChange = (event) => {
      const idx = event.target.parentElement.parentElement.parentElement.parentElement.rowIndex - 1;

      if (event.target.value > 100 || !(/^\d+$/.test(event.target.value.trim()))) {
        const updatedGrades = [...grades];
        updatedGrades[idx] = {...updatedGrades[idx], [event.target.name]:scores[idx]};

        setGrades(updatedGrades);
        return;
      }

      const updatedGrades = [...grades];
      updatedGrades[idx] = {...updatedGrades[idx], [event.target.name]:event.target.value};

      setGrades(updatedGrades);
    }
    
    const onSave = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/grades`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(grades),
        });
        if (!response.ok) {
          const rc = await response.json();
          setMessage(rc.message);
        }
      } catch (err) {
        setMessage("Error found: " + err);
      }

      editClose();
    };
    
    return (
      <div>
        <Button onClick={editOpen}>Grade</Button>
        <Dialog open={open}>
          <DialogTitle>Grade Assignment</DialogTitle>
          <DialogContent style={{ paddingTop: 20 }}>
            <h5>{message}</h5>
            <table className="Center" > 
            <thead>
            <tr>
              {headers.map((h, idx) => (<th key={idx}>{h}</th>))}
            </tr>
            </thead>
            <tbody>
            {grades.map((g) => (
                    <tr key={g.gradeId}>
                    <td>{g.gradeId}</td>
                    <td>{g.studentName}</td>
                    <td>{g.studentEmail}</td>
                    <td><TextField style={{padding:10}} fullWidth label="score" name="score" defaultValue={g.score} onChange={editChange}/></td>
                    </tr>
                ))}
            </tbody>
        </table>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={editClose}>Close</Button>
            <Button color="primary" onClick={onSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}

export default AssignmentGrade;