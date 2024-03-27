import React, { useState } from 'react';
import {SERVER_URL} from "../../Constants";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";

//  instructor updates assignment title, dueDate 
//  use an mui Dialog
//  issue PUT to URL  /assignments with updated assignment

const AssignmentUpdate = (props)  => {

  const [open, setOpen] = useState(false);
  const [editMessage, setEditMessage] = useState('');
  const [assignment, setAssignment] = useState(
      {id:'', title:'', dueDate:'', courseId:'', secId:'', secNo:''});

  /*
   *  dialog for edit assignment
   */
  const editOpen = () => {
    setEditMessage('');
    setAssignment({id:'', title:'', dueDate:'', courseId:'', secId:'', secNo:''});
    setOpen(true);
    setAssignment(props.assignment);
  };

  const editClose = () => {
    setOpen(false);
    props.onClose();
  };

  const editChange = (event) => {
    setAssignment({...assignment,  [event.target.name]:event.target.value})
  }

  const onSave = () => {
    saveAssignment(assignment);
  }

  const saveAssignment = async (assignment) => {
    try {
      const response = await fetch (`${SERVER_URL}/assignments`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(assignment),
          });
      if (response.ok) {
        setEditMessage("assignment saved");
      } else {
        const rc = await response.json();
        setEditMessage(rc.message);
      }
    } catch (err) {
      setEditMessage("network error: "+err);
    }
  }

  return (
      <div>
        <Button onClick={editOpen}>Edit</Button>
        <Dialog open={open} >
          <DialogTitle>Edit Assignment</DialogTitle>
          <DialogContent  style={{paddingTop: 20}} >
            <h4>{editMessage}</h4>
            <TextField style={{padding:10}} fullWidth label="id" name="id" value={assignment.id}  InputProps={{readOnly: true, }}  />
            <TextField style={{padding:10}} autoFocus fullWidth label="title" name="title" value={assignment.title} onChange={editChange} />
            <TextField style={{padding:10}} fullWidth label="dueDate" name="dueDate" value={assignment.dueDate} onChange={editChange}  />
            <TextField style={{padding:10}} fullWidth label="courseId" name="courseId" value={assignment.courseId}  InputProps={{readOnly: true, }}  />
            <TextField style={{padding:10}} fullWidth label="secId" name="secId" value={assignment.secId}  InputProps={{readOnly: true, }}  />
            <TextField style={{padding:10}} fullWidth label="secNo" name="secNo" value={assignment.secNo}  InputProps={{readOnly: true, }}  />
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={editClose}>Close</Button>
            <Button color="primary" onClick={onSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </div>
  )
}

export default AssignmentUpdate;
