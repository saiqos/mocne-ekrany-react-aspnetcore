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

export const ImagePreviewDialog = ({
  open,
  image,
  onClose,
}: ImagePreviewDialogProps) => {
  if (!image) return null;

  const fileSizeInMB = (image.fileSize / 1024 / 1024).toFixed(2);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{image.name}</DialogTitle>
      <DialogContent>
        {/* Mock preview - потом будет реальное изображение */}
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
          }}
        >
          <Box sx={{ textAlign: 'center', color: '#999' }}>
            <Typography variant="h4">📷</Typography>
            <Typography variant="body2">Image Preview</Typography>
          </Box>
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
              Uploaded By
            </Typography>
            <Typography>{image.uploadedBy}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Created At
            </Typography>
            <Typography>
              {new Date(image.createdAt).toLocaleString()}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              File Path
            </Typography>
            <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
              {image.filePath}
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
