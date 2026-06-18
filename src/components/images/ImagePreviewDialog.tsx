import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import type { Image } from '../../types';

interface ImagePreviewDialogProps {
  open: boolean;
  image: Image | null;
  onClose: () => void;
}

const getImageUrl = (image: Image) => {
  if (image.thumbnailPath) {
    if (image.thumbnailPath.startsWith('http')) {
      return image.thumbnailPath;
    }

    return `${import.meta.env.VITE_API_URL}${image.thumbnailPath}`;
  }

  return `${import.meta.env.VITE_API_URL}/api/images/${image.id}/file`;
};

export const ImagePreviewDialog = ({
  open,
  image,
  onClose,
}: ImagePreviewDialogProps) => {
  if (!image) return null;

  const fileSizeInMB = (image.fileSize / 1024 / 1024).toFixed(2);
  const imageUrl = getImageUrl(image);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{image.name}</DialogTitle>

      <DialogContent>
        <Box
          sx={{
            width: '100%',
            height: 400,
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
            mb: 2,
            mt: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={imageUrl}
            alt={image.name}
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>

        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Format
            </Typography>
            <Chip label={image.format.toUpperCase()} />
          </Box>

          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Dimensions
            </Typography>
            <Typography>
              {image.width} x {image.height}px
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              File Size
            </Typography>
            <Typography>{fileSizeInMB} MB</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Created At
            </Typography>
            <Typography>
              {new Date(image.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
