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
import { useState, useEffect } from 'react';
import type { Screen } from '../../types';
import type { UpdateScreenPayload } from '../../services/screens';

interface EditScreenDialogProps {
  open: boolean;
  screen: Screen | null;
  isUpdating: boolean;
  updateScreen: (id: number, payload: UpdateScreenPayload) => Promise<void>;
  onClose: () => void;
}

export const EditScreenDialog = ({
  open,
  screen,
  isUpdating,
  updateScreen,
  onClose,
}: EditScreenDialogProps) => {
  const [name, setName] = useState('');
  const [uniqueIdentifier, setUniqueIdentifier] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (screen && open) {
      setName(screen.name);
      setUniqueIdentifier(screen.uniqueIdentifier);
      setLocation(screen.location || '');
      setErrors({});
    }
  }, [screen, open]);

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
    if (!handleValidate() || !screen) return;

    await updateScreen(screen.id, {
      name,
      uniqueIdentifier,
      groupId: screen.groupId,
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
      <DialogTitle>Edit Screen</DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Screen Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isUpdating}
          />

          <TextField
            fullWidth
            label="Unique Identifier"
            value={uniqueIdentifier}
            onChange={(e) => setUniqueIdentifier(e.target.value)}
            error={!!errors.uniqueIdentifier}
            helperText={errors.uniqueIdentifier}
            disabled={isUpdating}
          />

          <TextField
            fullWidth
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
