import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSnackbarStore } from '../../store/snackbarStore';

interface ImageUploadZoneProps {
  uploadImage: (file: File) => Promise<void>;
  isUploading: boolean;
}

export const ImageUploadZone = ({
  uploadImage,
  isUploading,
}: ImageUploadZoneProps) => {
  const { showSnackbar } = useSnackbarStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        if (file.size > 10 * 1024 * 1024) {
          showSnackbar(`File ${file.name} is too large (max 10MB)`, 'error');
          continue;
        }

        const allowedFormats = ['image/jpeg', 'image/png', 'image/webp'];

        if (!allowedFormats.includes(file.type)) {
          showSnackbar(
            `File ${file.name} has unsupported format. Use JPEG, PNG or WebP.`,
            'error',
          );
          continue;
        }

        await uploadImage(file);
      }
    },
    [uploadImage, showSnackbar],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    disabled: isUploading,
  });

  return (
    <Paper
      {...getRootProps()}
      sx={{
        p: 4,
        textAlign: 'center',
        cursor: isUploading ? 'default' : 'pointer',
        backgroundColor: isDragActive ? '#f0f7ff' : '#fafafa',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: isDragActive ? 'primary.main' : 'divider',
        transition: 'all 0.3s',
        opacity: isUploading ? 0.7 : 1,
        '&:hover': {
          borderColor: isUploading ? 'divider' : 'primary.main',
          backgroundColor: isUploading ? '#fafafa' : '#f0f7ff',
        },
      }}
    >
      <input {...getInputProps()} />

      <CloudUploadIcon
        sx={{
          fontSize: 48,
          color: 'primary.main',
          mb: 1,
        }}
      />

      <Typography variant="h6" sx={{ mb: 1 }}>
        {isDragActive
          ? 'Drop images here...'
          : 'Drag & drop images here, or click to select'}
      </Typography>

      <Typography variant="caption" color="textSecondary">
        Supported: JPEG, PNG, WebP (max 10MB each)
      </Typography>

      {isUploading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
            Uploading...
          </Typography>
          <LinearProgress />
        </Box>
      )}
    </Paper>
  );
};
