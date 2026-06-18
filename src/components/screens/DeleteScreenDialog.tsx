import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import type { Screen } from '../../types';

interface DeleteScreenDialogProps {
  open: boolean;
  screen: Screen | null;
  isDeleting: boolean;
  deleteScreen: (id: number) => Promise<void>;
  onClose: () => void;
}

export const DeleteScreenDialog = ({
  open,
  screen,
  isDeleting,
  deleteScreen,
  onClose,
}: DeleteScreenDialogProps) => {
  const handleDelete = async () => {
    if (!screen) return;

    await deleteScreen(screen.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Screen</DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to delete screen <strong>{screen?.name}</strong>
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
