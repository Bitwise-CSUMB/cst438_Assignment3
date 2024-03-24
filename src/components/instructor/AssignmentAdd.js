import React, { useState } from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import {useLocation} from "react-router-dom";

// complete the code.  
// instructor adds an assignment to a section
// use mui Dialog with assignment fields Title and DueDate
// issue a POST using URL /assignments to add the assignment

const AssignmentAdd = (props)  => {

  const location = useLocation();
  const {secNo, courseId, secId} = location.state;
  const [open, setOpen] = useState(false);
  const [editMessage, setEditMessage] = useState('');
  const [assignment, setAssignment] = useState({
    title: '',
    dueDate: '',
    courseId: courseId,
    secId: secId,
    secNo: secNo
  });

  const editOpen = () => {
    setOpen(true);
    setEditMessage('');
  };

  const editClose = () => {
    setOpen(false);
    setAssignment( {
      title: '',
      dueDate: '',
      courseId: courseId,
      secId: secId,
      secNo: secNo
    });
    setEditMessage('');
  };

  const editChange = (event) => {
    setAssignment({ ...assignment, [event.target.name]: event.target.value });
  };

  const onSave = async () => {
    if (assignment.title === '' || assignment.dueDate === '') {
      setEditMessage("Must enter data for title and dueDate");
    } else {
      props.save(assignment);
      editClose();
    }
  };

  return (
      <div>
        <Button id="addAssignment" onClick={editOpen}>Add Assignment</Button>
        <Dialog open={open}>
          <DialogTitle>Add Assignment</DialogTitle>
          <DialogContent style={{ paddingTop: 20 }}>
            <h4 id="addMessage">{editMessage}</h4>
            <TextField id="etitle" style={{ padding: 10 }} autoFocus fullWidth label="Title" name="title" value={assignment.title} onChange={editChange} />
            <TextField id="eduedate" style={{ padding: 10 }} fullWidth label="Due Date (YYYY-MM-DD)" name="dueDate" value={assignment.dueDate} onChange={editChange} />
          </DialogContent>
          <DialogActions>
            <Button id="close" color="secondary" onClick={editClose}>Close</Button>
            <Button id="save" color="primary" onClick={onSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </div>
  );
};

export default AssignmentAdd;