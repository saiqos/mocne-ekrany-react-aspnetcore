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
import { useState } from 'react';
import type { CreateScreenPayload } from '../../services/screens';

interface AddScreenDialogProps {
  open: boolean;
  isCreating: boolean;
  createScreen: (payload: CreateScreenPayload) => Promise<void>;
  onClose: () => void;
}

export const AddScreenDialog = ({
  open,
  isCreating,
  createScreen,
  onClose,
}: AddScreenDialogProps) => {
  const [name, setName] = useState('');
  const [uniqueIdentifier, setUniqueIdentifier] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleValidate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!uniqueIdentifier.trim()) {
      newErrors.uniqueIdentifier = 'Unique identifier is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!handleValidate()) return;

    await createScreen({
      name,
      uniqueIdentifier,
      groupId: null,
      location,
    });

    setName('');
    setUniqueIdentifier('');
    setLocation('');
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Screen</DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Screen Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isCreating}
          />

          <TextField
            fullWidth
            label="Unique Identifier"
            value={uniqueIdentifier}
            onChange={(e) => setUniqueIdentifier(e.target.value)}
            error={!!errors.uniqueIdentifier}
            helperText={errors.uniqueIdentifier}
            disabled={isCreating}
          />

          <TextField
            fullWidth
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={isCreating}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isCreating}>
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isCreating}
        >
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
