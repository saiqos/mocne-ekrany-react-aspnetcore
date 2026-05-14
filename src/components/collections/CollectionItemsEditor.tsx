import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Autocomplete,
  TextField,
  Paper,
  CircularProgress,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useCollections } from '../../hooks/useCollections';
import { useImages } from '../../hooks/useImages';
import type { Collection, CollectionItem } from '../../types';

interface CollectionItemsEditorProps {
  open: boolean;
  collection: Collection | null;
  onClose: () => void;
}

export const CollectionItemsEditor = ({
  open,
  collection,
  onClose,
}: CollectionItemsEditorProps) => {
  const { updateCollection, isUpdating } = useCollections();
  const { images } = useImages();
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [displayDuration, setDisplayDuration] = useState('30');

  // Инициализируем items при открытии
  React.useEffect(() => {
    if (collection && open) {
      setItems(collection.items || []);
      setSelectedImageId(null);
      setDisplayDuration('30');
    }
  }, [collection, open]);

  const handleAddItem = () => {
    if (!selectedImageId) return;

    const newItem: CollectionItem = {
      id: String(Date.now()),
      collectionId: collection?.id || '',
      imageId: selectedImageId,
      order: items.length,
      displayDuration: parseInt(displayDuration),
    };

    setItems([...items, newItem]);
    setSelectedImageId(null);
    setDisplayDuration('30');
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    if (!collection) return;

    updateCollection(
      {
        id: collection.id,
        data: {
          items,
        },
      },
      {
        onSuccess: () => {
          setItems([]);
          onClose();
        },
      },
    );
  };

  const getImageName = (imageId: string) => {
    return images.find((i) => i.id === imageId)?.name || imageId;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Collection: {collection?.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Добавление новых items */}
          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f9f9f9' }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Add Images to Collection
            </Typography>

            <Box
              sx={{ display: 'flex', gap: 1, mb: 2, flexDirection: 'column' }}
            >
              <Autocomplete
                sx={{ mt: 1 }}
                options={images}
                getOptionLabel={(option) => option.name}
                value={images.find((i) => i.id === selectedImageId) || null}
                onChange={(_, value) => setSelectedImageId(value?.id || null)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Image"
                    size="small"
                    disabled={isUpdating}
                  />
                )}
              />

              <TextField
                sx={{ mt: 2 }}
                label="Display Duration (seconds)"
                type="number"
                size="small"
                value={displayDuration}
                onChange={(e) => setDisplayDuration(e.target.value)}
                disabled={isUpdating}
                inputProps={{ min: 1, max: 300 }}
              />

              <Button
                sx={{ mt: 1 }}
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
                disabled={!selectedImageId || isUpdating}
                size="small"
              >
                Add Image
              </Button>
            </Box>
          </Paper>

          {/* Список items */}
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Items ({items.length})
          </Typography>

          {items.length === 0 ? (
            <Typography variant="caption" color="textSecondary">
              No images added yet
            </Typography>
          ) : (
            <List sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
              {items.map((item, index) => (
                <ListItem key={item.id} sx={{ py: 1 }}>
                  <ListItemText
                    primary={`${index + 1}. ${getImageName(item.imageId)}`}
                    secondary={`Duration: ${item.displayDuration}s`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isUpdating}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isUpdating}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isUpdating || items.length === 0}
        >
          {isUpdating ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
