import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import type { Collection } from '../../types';

interface DeleteCollectionDialogProps {
  open: boolean;
  collection: Collection | null;
  isDeleting: boolean;
  deleteCollection: (id: number) => Promise<void>;
  onClose: () => void;
}

export const DeleteCollectionDialog = ({
  open,
  collection,
  isDeleting,
  deleteCollection,
  onClose,
}: DeleteCollectionDialogProps) => {
  const handleDelete = async () => {
    if (!collection) return;

    await deleteCollection(collection.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Collection</DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to delete collection{' '}
          <strong>{collection?.name}</strong>?
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
