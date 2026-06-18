import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { Collection } from '../../types';
import type { UpdateCollectionPayload } from '../../services/collections';

interface EditCollectionDialogProps {
  open: boolean;
  collection: Collection | null;
  isUpdating: boolean;
  updateCollection: (
    id: number,
    payload: UpdateCollectionPayload,
  ) => Promise<void>;
  onClose: () => void;
}

export const EditCollectionDialog = ({
  open,
  collection,
  isUpdating,
  updateCollection,
  onClose,
}: EditCollectionDialogProps) => {
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (collection && open) {
      setName(collection.name);
      setErrors({});
    }
  }, [collection, open]);

  const handleValidate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Collection name is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!handleValidate() || !collection) return;

    await updateCollection(collection.id, { name });

    setName('');
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Collection</DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Collection Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isUpdating}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isUpdating}>
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isUpdating}
        >
          {isUpdating ? (
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
