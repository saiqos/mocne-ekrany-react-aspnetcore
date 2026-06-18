import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useState } from 'react';
import { useLogs } from '../hooks/useLogs';

export const LogsPage = () => {
  const { logs, isLoading, isError, error } = useLogs();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterAction, setFilterAction] = useState('');
  const [filterEntityType, setFilterEntityType] = useState('');

  const filteredLogs = logs.filter((log) => {
    const matchAction =
      filterAction === '' ||
      log.action.toLowerCase().includes(filterAction.toLowerCase());

    const matchEntityType =
      filterEntityType === '' ||
      log.entityType.toLowerCase().includes(filterEntityType.toLowerCase());

    return matchAction && matchEntityType;
  });

  const paginatedLogs = filteredLogs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'User ID',
      'Action',
      'Entity Type',
      'Entity ID',
      'Timestamp',
      'Description',
    ];

    const csvContent = [
      headers.join(','),
      ...filteredLogs.map((log) =>
        [
          log.id,
          log.userId,
          log.action,
          log.entityType,
          log.entityId,
          new Date(log.timestamp).toLocaleString(),
          `"${log.description.replaceAll('"', '""')}"`,
        ].join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `logs-${new Date().toISOString()}.csv`;
    link.click();

    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">{error || 'Failed to load logs'}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Audit Logs
      </Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            label="Filter by Action"
            value={filterAction}
            onChange={(event) => {
              setFilterAction(event.target.value);
              setPage(0);
            }}
            placeholder="e.g. CREATE, UPDATE, DELETE"
            size="small"
          />

          <TextField
            label="Filter by Entity Type"
            value={filterEntityType}
            onChange={(event) => {
              setFilterEntityType(event.target.value);
              setPage(0);
            }}
            placeholder="e.g. Screen, Image"
            size="small"
          />

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExportCSV}
            disabled={filteredLogs.length === 0}
          >
            Export CSV
          </Button>
        </Box>

        <Box>
          Showing {filteredLogs.length} of {logs.length} logs
        </Box>
      </Stack>

      {paginatedLogs.length === 0 ? (
        <Alert severity="info">No logs found</Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Action</TableCell>
                  <TableCell>Entity Type</TableCell>
                  <TableCell>Entity ID</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor:
                            log.action === 'CREATE'
                              ? '#c8e6c9'
                              : log.action === 'UPDATE'
                                ? '#bbdefb'
                                : log.action === 'DELETE'
                                  ? '#ffcdd2'
                                  : '#f0f0f0',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        }}
                      >
                        {log.action}
                      </Box>
                    </TableCell>

                    <TableCell>{log.entityType}</TableCell>

                    <TableCell sx={{ fontSize: '0.875rem', color: '#666' }}>
                      {log.entityId}
                    </TableCell>

                    <TableCell sx={{ fontSize: '0.875rem' }}>
                      {log.userId}
                    </TableCell>

                    <TableCell sx={{ fontSize: '0.875rem' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>

                    <TableCell sx={{ fontSize: '0.875rem' }}>
                      {log.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredLogs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Box>
  );
};
