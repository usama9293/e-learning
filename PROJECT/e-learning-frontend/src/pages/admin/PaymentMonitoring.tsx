import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';

const mockPayments = [
  { id: 1, user: 'Alice Johnson', amount: 120, date: '2024-05-01', status: 'Completed' },
  { id: 2, user: 'Bob Smith', amount: 80, date: '2024-05-03', status: 'Pending' },
  { id: 3, user: 'Carol Lee', amount: 200, date: '2024-05-05', status: 'Refunded' },
];

const PaymentMonitoring = () => (
  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    <Typography variant="h4" fontWeight={700} gutterBottom>Payment Monitoring</Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockPayments.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.user}</TableCell>
              <TableCell>${p.amount}</TableCell>
              <TableCell>{p.date}</TableCell>
              <TableCell>
                <Chip label={p.status} color={p.status === 'Completed' ? 'success' : p.status === 'Pending' ? 'warning' : 'error'} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Container>
);

export default PaymentMonitoring; 