import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TableComponent = ({ data, onEdit, onDelete }) => {
    console.log(data);
  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course</TableCell>
            <TableCell>Tutor</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Days</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((session) => (
            <TableRow key={session.id}>
              <TableCell>{session.course.name || session.course_id}</TableCell>
              <TableCell>{session.full_name || session.tutor_info_id}</TableCell>
              <TableCell>{session.date}</TableCell>
              <TableCell>{Array.isArray(session.days) ? session.days.join(', ') : session.days}</TableCell>
              <TableCell>{session.start_time}</TableCell>
              <TableCell>{session.end_time}</TableCell>
              <TableCell>{session.status}</TableCell>
              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton onClick={() => onEdit(session)}>
                    <EditIcon color="primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => onDelete(session.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center">No sessions available.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
