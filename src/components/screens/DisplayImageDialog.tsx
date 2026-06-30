import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { Image, Screen } from '../../types';

interface DisplayImageDialogProps {
  open: boolean;
  screen: Screen | null;
  images: Image[];
  isDisplayingImage: boolean;
  displayImage: (screenId: number, imageId: number) => Promise<void>;
  onClose: () => void;
}

export const DisplayImageDialog = ({
  open,
  screen,
  images,
  isDisplayingImage,
  displayImage,
  onClose,
}: DisplayImageDialogProps) => {
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null); // added: selected image for immediate display
  const [error, setError] = useState(''); // added: validation error

  useEffect(() => {
    if (!open) return;

    setSelectedImageId(null); // added: reset selected image when dialog opens
    setError(''); // added: reset validation error when dialog opens
  }, [open]);

  const handleSubmit = async () => {
    if (!screen) return; // added: cannot send command without selected screen

    if (!selectedImageId) {
      setError('Image is required'); // added: image validation
      return;
    }

    await displayImage(screen.id, selectedImageId); // added: send display-image command to backend

    onClose(); // added: close dialog after successful command
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Display Image Now</DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Select an image to display immediately on{' '}
            <strong>{screen?.name}</strong>.
          </Typography>

          <Autocomplete
            options={images}
            getOptionLabel={(option) => option.name}
            value={images.find((image) => image.id === selectedImageId) || null}
            onChange={(_, value) => {
              setSelectedImageId(value?.id ?? null); // added: save selected image id
              setError(''); // added: clear error after selecting image
            }}
            disabled={isDisplayingImage}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Image"
                error={!!error}
                helperText={error}
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isDisplayingImage}>
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isDisplayingImage}
        >
          {isDisplayingImage ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Sending...
            </>
          ) : (
            'Display Now'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
