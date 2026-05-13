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
import { useScreens } from '../../hooks/useScreens';
import type { Screen } from '../../types';

interface EditScreenDialogProps {
  open: boolean;
  screen: Screen | null;
  onClose: () => void;
}

export const EditScreenDialog = ({
  open,
  screen,
  onClose,
}: EditScreenDialogProps) => {
  const { updateScreen, isUpdating } = useScreens();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Заполняем форму данными экрана при открытии диалога
  useEffect(() => {
    if (screen && open) {
      setName(screen.name);
      setLocation(screen.location || '');
      setErrors({});
    }
  }, [screen, open]);

  const handleValidate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!handleValidate() || !screen) return;

    updateScreen(
      {
        id: screen.id,
        data: {
          name,
          location,
        },
      },
      {
        onSuccess: () => {
          setName('');
          setLocation('');
          setErrors({});
          onClose();
        },
      },
    );
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
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={isUpdating}
          />
          <TextField
            fullWidth
            label="Unique ID"
            value={screen?.uniqueIdentifier || ''}
            disabled
            variant="outlined"
            size="small"
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
