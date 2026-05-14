import { Box, Typography } from '@mui/material';
import { TableWithLogs } from '../components/logs/TableWithLogs';

export const LogsPage = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Audit Logs
      </Typography>
      <TableWithLogs />
    </Box>
  );
};
