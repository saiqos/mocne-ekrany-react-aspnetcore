import { Box, Typography } from '@mui/material';
import { LogTable } from '../components/logs/LogTable';

export const LogsPage = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Audit Logs
      </Typography>
      <LogTable />
    </Box>
  );
};
