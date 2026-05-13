import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useImages } from '../../hooks/useImages';
import { useSnackbarStore } from '../../store/snackbarStore';

export const ImageUploadZone = () => {
  const { uploadImage, isUploading } = useImages();
  const { showSnackbar } = useSnackbarStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        // Валидация размера (макс 10MB)
        if (file.size > 10 * 1024 * 1024) {
          showSnackbar(`File ${file.name} is too large (max 10MB)`, 'error');
          return;
        }

        // Валидация формата
        const allowedFormats = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedFormats.includes(file.type)) {
          showSnackbar(
            `File ${file.name} has unsupported format. Use JPEG, PNG or WebP.`,
            'error',
          );
          return;
        }

        // Загружаем
        uploadImage(file);
      });
    },
    [uploadImage, showSnackbar],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
  });

  return (
    <Paper
      {...getRootProps()}
      sx={{
        p: 4,
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: isDragActive ? '#f0f7ff' : '#fafafa',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: isDragActive ? 'primary.main' : 'divider',
        transition: 'all 0.3s',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: '#f0f7ff',
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
