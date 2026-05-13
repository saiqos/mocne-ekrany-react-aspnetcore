import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useSchedules } from '../../hooks/useSchedules';
import type { Schedule } from '../../types';

interface DeleteScheduleDialogProps {
  open: boolean;
  schedule: Schedule | null;
  onClose: () => void;
}

export const DeleteScheduleDialog = ({
  open,
  schedule,
  onClose,
}: DeleteScheduleDialogProps) => {
  const { deleteSchedule, isDeleting } = useSchedules();

  const handleDelete = () => {
    if (schedule) {
      deleteSchedule(schedule.id, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Schedule</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete schedule{' '}
          <strong>{schedule?.name}</strong>?
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
