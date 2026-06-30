import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ImageIcon from '@mui/icons-material/Image'; // added: icon for immediate image display
import type { Screen } from '../../types';

interface ScreenTableProps {
  screens: Screen[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isControllingPower: boolean;
  onEditClick: (screen: Screen) => void;
  onDeleteClick: (screen: Screen) => void;
  onPowerClick: (id: number, action: 'on' | 'off') => Promise<void>;
  onDisplayImageClick: (screen: Screen) => void; // added: opens DisplayImageDialog
}

export const ScreenTable = ({
  screens,
  isLoading,
  isError,
  error,
  isControllingPower,
  onEditClick,
  onDeleteClick,
  onPowerClick,
  onDisplayImageClick, // added: handler for immediate image display
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
            <TableCell>Unique Identifier</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last Seen</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {screens.map((screen) => {
            const isOnline = screen.status === 'Online';

            return (
              <TableRow key={screen.id}>
                <TableCell sx={{ fontWeight: 500 }}>{screen.name}</TableCell>

                <TableCell>{screen.uniqueIdentifier}</TableCell>

                <TableCell>{screen.location || '-'}</TableCell>

                <TableCell>
                  <Chip
                    label={screen.status}
                    size="small"
                    color={isOnline ? 'success' : 'default'}
                  />
                </TableCell>

                <TableCell sx={{ fontSize: '0.875rem' }}>
                  {screen.lastSeen
                    ? new Date(screen.lastSeen).toLocaleString()
                    : '-'}
                </TableCell>

                <TableCell sx={{ fontSize: '0.875rem' }}>
                  {new Date(screen.createdAt).toLocaleString()}
                </TableCell>

                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => onDisplayImageClick(screen)}
                    title="Display image now"
                    color="primary"
                  >
                    <ImageIcon />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() =>
                      onPowerClick(screen.id, isOnline ? 'off' : 'on')
                    }
                    title={isOnline ? 'Power off' : 'Power on'}
                    color={isOnline ? 'warning' : 'success'}
                    disabled={isControllingPower}
                  >
                    <PowerSettingsNewIcon />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => onEditClick(screen)}
                    title="Edit screen"
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => onDeleteClick(screen)}
                    title="Delete screen"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
