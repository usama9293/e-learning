import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Box,
} from '@mui/material';

const SessionTable = ({ sessions, handleEnrollSession }) => {
    console.log(sessions)
    return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Available Sessions
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tutor</TableCell>
            <TableCell>Days</TableCell>
            <TableCell>Time</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>{session.full_name}</TableCell>
              <TableCell>{session.days}</TableCell>
              <TableCell>
                {session.start_time} - {session.end_time}
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  onClick={() => handleEnrollSession(session.id)}
                >
                  Enroll
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default SessionTable;
