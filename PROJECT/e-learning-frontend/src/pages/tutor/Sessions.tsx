import { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box,
  Table, TableHead, TableRow, TableCell, TableBody, Pagination, CircularProgress
} from '@mui/material';
import api from '../../services/api';
import { useSnackbar } from 'notistack';
const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const fetchSessions_ = async (page) => {
    setLoading(true);
    try {
      setLoading(true);
      const response = await api.get('/tutor/sessions', {
        params: {
          page: page ,
          per_page: perPage,
          search,
          
        },
      });
      console.log(response.data.items.students)
      setSessions(response.data.items);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.log(error)
      enqueueSnackbar('Failed to fetch sessions', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchSessions_(page);
  }, [page]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          My Sessions
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course</TableCell>
                  <TableCell>Days</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.course.name}</TableCell>
                    <TableCell>{session.days}</TableCell>
                    <TableCell>{session.start_time}</TableCell>
                    <TableCell>{session.end_time}</TableCell>
                    <TableCell>{session.status || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Sessions;
