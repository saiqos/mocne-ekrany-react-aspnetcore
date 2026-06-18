import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { useState } from 'react';
import { ImageUploadZone } from '../components/images/ImageUploadZone';
import { ImageCard } from '../components/images/ImageCard';
import { ImagePreviewDialog } from '../components/images/ImagePreviewDialog';
import { DeleteImageDialog } from '../components/images/DeleteImageDialog';
import { useImages } from '../hooks/useImages';
import type { Image } from '../types';

export const ImagesPage = () => {
  const {
    images,
    isLoading,
    isError,
    error,
    uploadImage,
    isUploading,
    deleteImage,
    isDeleting,
  } = useImages();

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const handlePreviewClick = (image: Image) => {
    setSelectedImage(image);
    setPreviewDialogOpen(true);
  };

  const handleDeleteClick = (image: Image) => {
    setSelectedImage(image);
    setDeleteDialogOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Images
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Upload New Images
        </Typography>

        <ImageUploadZone uploadImage={uploadImage} isUploading={isUploading} />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Image Gallery ({images.length})
        </Typography>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Alert severity="error">{error || 'Failed to load images'}</Alert>
        )}

        {!isLoading && !isError && images.length === 0 && (
          <Typography color="textSecondary">
            No images yet. Upload your first image!
          </Typography>
        )}

        {!isLoading && !isError && images.length > 0 && (
          <Grid container spacing={2}>
            {images.map((image) => (
              <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={image.id}>
                <ImageCard
                  image={image}
                  onDeleteClick={handleDeleteClick}
                  onPreviewClick={handlePreviewClick}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <ImagePreviewDialog
        open={previewDialogOpen}
        image={selectedImage}
        onClose={() => {
          setPreviewDialogOpen(false);
          setSelectedImage(null);
        }}
      />

      <DeleteImageDialog
        open={deleteDialogOpen}
        image={selectedImage}
        isDeleting={isDeleting}
        deleteImage={deleteImage}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedImage(null);
        }}
      />
    </Box>
  );
};
