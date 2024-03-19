import React from 'react';
import { Outlet, Link } from "react-router-dom";

export const StudentHome = () => {

  return (
      <div>
          <h1>Student Home</h1>
          <p><Link to="/schedule">View Class Schedule / Drop Course</Link></p>
          <p><Link to="/addCourse">Enroll in a Course</Link></p>
          <p><Link to="/studentAssignments">View Assignments and Grades</Link></p>
          <p><Link to="/transcript">View Transcript</Link></p>
      </div>
  );
};

export const StudentLayout = () => {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> &nbsp;|&nbsp;
        <Link to="/schedule">View Class Schedule</Link>&nbsp;|&nbsp;
        <Link to="/addCourse">Enroll in a Course</Link>&nbsp;|&nbsp;
        <Link to="/studentAssignments">View Assignments</Link>&nbsp;|&nbsp;
        <Link to="/transcript">View Transcript</Link>
      </nav>

      <Outlet />
    </>
  )
};