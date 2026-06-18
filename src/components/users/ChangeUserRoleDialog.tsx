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
import { useEffect, useState } from 'react';
import type { UserDto } from '../../types';
import type { UpdateUserRolePayload } from '../../services/users';

type UserRole = 'Admin' | 'Operator';

interface ChangeUserRoleDialogProps {
  open: boolean;
  user: UserDto | null;
  isUpdatingRole: boolean;
  updateUserRole: (id: number, payload: UpdateUserRolePayload) => Promise<void>;
  onClose: () => void;
}

export const ChangeUserRoleDialog = ({
  open,
  user,
  isUpdatingRole,
  updateUserRole,
  onClose,
}: ChangeUserRoleDialogProps) => {
  const [role, setRole] = useState<UserRole>('Operator');

  useEffect(() => {
    if (open && user) {
      setRole(user.role);
    }
  }, [open, user]);

  const handleSubmit = async () => {
    if (!user) return;

    await updateUserRole(user.id, { role });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change User Role</DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            fullWidth
            select
            label="Role"
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
            disabled={isUpdatingRole}
          >
            <MenuItem value="Operator">Operator</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isUpdatingRole}>
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isUpdatingRole || !user || role === user.role}
        >
          {isUpdatingRole ? (
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
