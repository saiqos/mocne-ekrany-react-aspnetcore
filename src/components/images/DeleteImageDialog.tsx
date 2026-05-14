import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useImages } from '../../hooks/useImages';
import type { Image } from '../../types';

interface DeleteImageDialogProps {
  open: boolean;
  image: Image | null;
  onClose: () => void;
}

export const DeleteImageDialog = ({
  open,
  image,
  onClose,
}: DeleteImageDialogProps) => {
  const { deleteImage, isDeleting } = useImages();

  const handleDelete = () => {
    if (image) {
      deleteImage(image.id, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Image</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{image?.name}</strong>?
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: 'block', marginTop: 1, color: '#666' }}
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
