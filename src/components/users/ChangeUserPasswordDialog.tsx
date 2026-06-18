import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import type { UserDto } from '../../types';
import type { UpdateUserPasswordPayload } from '../../services/users';

interface ChangeUserPasswordDialogProps {
  open: boolean;
  user: UserDto | null;
  isUpdatingPassword: boolean;
  updateUserPassword: (
    id: number,
    payload: UpdateUserPasswordPayload,
  ) => Promise<void>;
  onClose: () => void;
}

export const ChangeUserPasswordDialog = ({
  open,
  user,
  isUpdatingPassword,
  updateUserPassword,
  onClose,
}: ChangeUserPasswordDialogProps) => {
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleValidate = () => {
    const newErrors: Record<string, string> = {};

    if (!password.trim()) {
      newErrors.password = 'New password is required';
    }

    if (password.trim().length > 0 && password.trim().length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!handleValidate() || !user) return;

    await updateUserPassword(user.id, {
      newPassword: password.trim(),
    });

    setPassword('');
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    if (isUpdatingPassword) return;

    setPassword('');
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Password: {user?.username}</DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            disabled={isUpdatingPassword}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isUpdatingPassword}>
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isUpdatingPassword}
        >
          {isUpdatingPassword ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Updating...
            </>
          ) : (
            'Update'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
