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
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PasswordIcon from '@mui/icons-material/Password';
import DeleteIcon from '@mui/icons-material/Delete';
import type { UserDto } from '../../types';

interface UsersTableProps {
  users: UserDto[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  onRoleClick: (user: UserDto) => void;
  onPasswordClick: (user: UserDto) => void;
  onDeleteClick: (user: UserDto) => void;
}

export const UsersTable = ({
  users,
  isLoading,
  isError,
  error,
  onRoleClick,
  onPasswordClick,
  onDeleteClick,
}: UsersTableProps) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">{error || 'Failed to load users'}</Alert>;
  }

  if (users.length === 0) {
    return <Alert severity="info">No users found</Alert>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell sx={{ fontWeight: 500 }}>{user.username}</TableCell>

              <TableCell>
                <Chip
                  label={user.role}
                  size="small"
                  color={user.role === 'Admin' ? 'primary' : 'default'}
                />
              </TableCell>

              <TableCell sx={{ fontSize: '0.875rem' }}>
                {new Date(user.createdAt).toLocaleString()}
              </TableCell>

              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={() => onRoleClick(user)}
                  title="Change role"
                  color="primary"
                >
                  <AdminPanelSettingsIcon />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => onPasswordClick(user)}
                  title="Change password"
                >
                  <PasswordIcon />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => onDeleteClick(user)}
                  title="Delete user"
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
