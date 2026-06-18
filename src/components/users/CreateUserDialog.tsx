import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import type { CreateUserPayload } from '../../services/users';

type UserRole = 'Admin' | 'Operator';

interface CreateUserDialogProps {
  open: boolean;
  isCreating: boolean;
  createUser: (payload: CreateUserPayload) => Promise<void>;
  onClose: () => void;
}

export const CreateUserDialog = ({
  open,
  isCreating,
  createUser,
  onClose,
}: CreateUserDialogProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Operator');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleValidate = () => {
    const newErrors: Record<string, string> = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (password.trim().length > 0 && password.trim().length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!handleValidate()) return;

    await createUser({
      username: username.trim(),
      password: password.trim(),
      role,
    });

    setUsername('');
    setPassword('');
    setRole('Operator');
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    if (isCreating) return;

    setUsername('');
    setPassword('');
    setRole('Operator');
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create User</DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            error={!!errors.username}
            helperText={errors.username}
            disabled={isCreating}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            disabled={isCreating}
          />

          <TextField
            fullWidth
            select
            label="Role"
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
            disabled={isCreating}
          >
            <MenuItem value="Operator">Operator</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isCreating}>
          Cancel
        </Button>

        <Button onClick={handleSubmit} variant="contained" disabled={isCreating}>
          {isCreating ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Creating...
            </>
          ) : (
            'Create'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};