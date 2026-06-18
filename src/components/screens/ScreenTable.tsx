import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import type { Screen } from '../../types';

interface ScreenTableProps {
  screens: Screen[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isControllingPower: boolean;
  powerControl: (id: number, action: 'on' | 'off') => Promise<void>;
  onEditClick: (screen: Screen) => void;
  onDeleteClick: (screen: Screen) => void;
}

export const ScreenTable = ({
  screens,
  isLoading,
  isError,
  error,
  isControllingPower,
  powerControl,
  onEditClick,
  onDeleteClick,
}: ScreenTableProps) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">{error || 'Failed to load screens'}</Alert>;
  }

  if (screens.length === 0) {
    return (
      <Alert severity="info">No screens yet. Create your first screen!</Alert>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>Name</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last Seen</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {screens.map((screen) => (
            <TableRow key={screen.id}>
              <TableCell sx={{ fontWeight: 500 }}>{screen.name}</TableCell>

              <TableCell sx={{ fontSize: '0.875rem', color: '#666' }}>
                {screen.uniqueIdentifier}
              </TableCell>

              <TableCell>{screen.location || '-'}</TableCell>

              <TableCell>
                <Chip
                  label={screen.status}
                  color={screen.status === 'Online' ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>

              <TableCell sx={{ fontSize: '0.875rem' }}>
                {screen.lastSeen
                  ? new Date(screen.lastSeen).toLocaleString()
                  : 'Never'}
              </TableCell>

              <TableCell align="right" sx={{ display: 'flex', gap: '5px' }}>
                <IconButton
                  size="small"
                  onClick={() =>
                    powerControl(
                      screen.id,
                      screen.status === 'Online' ? 'off' : 'on',
                    )
                  }
                  disabled={isControllingPower}
                  color="primary"
                  title={screen.status === 'Online' ? 'Turn off' : 'Turn on'}
                >
                  <PowerSettingsNewIcon />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => onEditClick(screen)}
                  title="Edit"
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => onDeleteClick(screen)}
                  title="Delete"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
