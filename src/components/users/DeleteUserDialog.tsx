import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import type { UserDto } from '../../types';

interface DeleteUserDialogProps {
  open: boolean;
  user: UserDto | null;
  isDeleting: boolean;
  deleteUser: (id: number) => Promise<void>;
  onClose: () => void;
}

export const DeleteUserDialog = ({
  open,
  user,
  isDeleting,
  deleteUser,
  onClose,
}: DeleteUserDialogProps) => {
  const handleDelete = async () => {
    if (!user) return;

    await deleteUser(user.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete User</DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to delete user <strong>{user?.username}</strong>
          ?
        </Typography>

        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 1, color: '#666' }}
        >
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>

        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Deleting...
            </>
          ) : (
            'Delete'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
