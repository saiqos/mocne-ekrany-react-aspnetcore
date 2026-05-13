import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { Image } from '../../types';

interface ImageCardProps {
  image: Image;
  onDeleteClick: (image: Image) => void;
  onPreviewClick: (image: Image) => void;
}

export const ImageCard = ({
  image,
  onDeleteClick,
  onPreviewClick,
}: ImageCardProps) => {
  const fileSizeInMB = (image.fileSize / 1024 / 1024).toFixed(2);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        sx={{
          height: 200,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
        }}
        onClick={() => onPreviewClick(image)}
      >
        {/* Mock изображение - потом будет реальное */}
        <Box
          sx={{
            textAlign: 'center',
            color: '#999',
          }}
        >
          <Typography variant="h6">📷</Typography>
          <Typography variant="caption">Click to preview</Typography>
        </Box>
      </CardMedia>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            mb: 1,
          }}
        >
          {image.name}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip label={image.format.toUpperCase()} size="small" />
          <Chip label={`${fileSizeInMB} MB`} size="small" />
        </Box>

        <Typography variant="caption" color="textSecondary">
          {image.width} x {image.height}px
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ display: 'block', mt: 1 }}
        >
          By: {image.uploadedBy}
        </Typography>
      </CardContent>

      <CardActions sx={{ pt: 0 }}>
        <IconButton
          size="small"
          onClick={() => onPreviewClick(image)}
          title="Preview"
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDeleteClick(image)}
          title="Delete"
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
