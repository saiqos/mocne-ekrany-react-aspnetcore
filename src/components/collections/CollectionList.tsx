import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCollections } from '../../hooks/useCollections';
import type { Collection } from '../../types';

interface CollectionListProps {
  onEditClick: (collection: Collection) => void;
  onDeleteClick: (collection: Collection) => void;
}

export const CollectionList = ({
  onEditClick,
  onDeleteClick,
}: CollectionListProps) => {
  const { collections, isLoading, isError, error } = useCollections();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        {(error as any)?.message || 'Failed to load collections'}
      </Alert>
    );
  }

  if (collections.length === 0) {
    return (
      <Alert severity="info">
        No collections yet. Create your first collection!
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      {collections.map((collection) => (
        <Grid item xs={12} sm={6} md={4} key={collection.id}>
          <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {collection.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Items: <strong>{collection.items.length}</strong>
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Created by: {collection.uploadedBy}
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ display: 'block', mt: 1 }}
              >
                {new Date(collection.createdAt).toLocaleString()}
              </Typography>
            </CardContent>
            <CardActions sx={{ pt: 0 }}>
              <Button
                size="small"
                onClick={() => onEditClick(collection)}
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
              <IconButton
                size="small"
                onClick={() => onDeleteClick(collection)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
