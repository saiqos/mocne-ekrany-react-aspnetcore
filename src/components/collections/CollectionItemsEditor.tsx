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
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useImages } from '../../hooks/useImages';
import type {
  Collection,
  CollectionDetails,
  CollectionItem,
} from '../../types';
import type {
  CreateCollectionItemPayload,
  UpdateCollectionItemPayload,
} from '../../services/collections';

interface CollectionItemsEditorProps {
  open: boolean;
  collection: Collection | null;
  getCollectionById: (id: number) => Promise<CollectionDetails>;
  addCollectionItem: (
    collectionId: number,
    payload: CreateCollectionItemPayload,
  ) => Promise<void>;
  updateCollectionItem: (
    collectionId: number,
    itemId: number,
    payload: UpdateCollectionItemPayload,
  ) => Promise<void>;
  deleteCollectionItem: (collectionId: number, itemId: number) => Promise<void>;
  isAddingItem: boolean;
  isUpdatingItem: boolean;
  isDeletingItem: boolean;
  onClose: () => void;
}

export const CollectionItemsEditor = ({
  open,
  collection,
  getCollectionById,
  addCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
  isAddingItem,
  isUpdatingItem,
  isDeletingItem,
  onClose,
}: CollectionItemsEditorProps) => {
  const { images } = useImages();

  const [items, setItems] = useState<CollectionItem[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [displayDuration, setDisplayDuration] = useState('30');
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [movingItemId, setMovingItemId] = useState<number | null>(null);

  const loadCollectionDetails = async () => {
    if (!collection) return;

    setIsLoadingDetails(true);

    try {
      const data = await getCollectionById(collection.id);
      setItems([...data.items].sort((a, b) => a.order - b.order));
    } finally {
      setIsLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (open && collection) {
      loadCollectionDetails();
      setSelectedImageId(null);
      setDisplayDuration('30');
    }
  }, [open, collection]);

  const handleAddItem = async () => {
    if (!collection || !selectedImageId) return;

    const duration = Number(displayDuration);

    if (!duration || duration <= 0) return;

    await addCollectionItem(collection.id, {
      imageId: selectedImageId,
      order: items.length,
      displayDurationSeconds: duration,
    });

    setSelectedImageId(null);
    setDisplayDuration('30');
    await loadCollectionDetails();
  };

  const handleUpdateItemDuration = async (
    item: CollectionItem,
    value: string,
  ) => {
    if (!collection) return;

    const nextDuration = Number(value);

    if (!nextDuration || nextDuration <= 0) return;

    if (nextDuration === item.displayDurationSeconds) return;

    setUpdatingItemId(item.id);

    try {
      await updateCollectionItem(collection.id, item.id, {
        order: item.order,
        displayDurationSeconds: nextDuration,
      });

      await loadCollectionDetails();
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!collection) return;

    await deleteCollectionItem(collection.id, itemId);
    await loadCollectionDetails();
  };

  const handleMoveItem = async (
    item: CollectionItem,
    currentIndex: number,
    direction: 'up' | 'down',
  ) => {
    if (!collection) return;

    const targetIndex =
      direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetItem = items[targetIndex];

    if (!targetItem) return;

    setMovingItemId(item.id);

    try {
      await updateCollectionItem(collection.id, item.id, {
        order: targetItem.order,
        displayDurationSeconds: item.displayDurationSeconds,
      });

      await updateCollectionItem(collection.id, targetItem.id, {
        order: item.order,
        displayDurationSeconds: targetItem.displayDurationSeconds,
      });

      await loadCollectionDetails();
    } finally {
      setMovingItemId(null);
    }
  };

  const isBusy =
    isLoadingDetails ||
    isAddingItem ||
    isUpdatingItem ||
    isDeletingItem ||
    movingItemId !== null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Collection Items: {collection?.name}</DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f9f9f9' }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Add Images to Collection
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
              <Autocomplete
                options={images}
                getOptionLabel={(option) => option.name}
                value={
                  images.find((image) => image.id === selectedImageId) || null
                }
                onChange={(_, value) => setSelectedImageId(value?.id ?? null)}
                renderInput={(params) => (
                  <TextField {...params} label="Select Image" size="small" />
                )}
                disabled={isBusy}
              />

              <TextField
                label="Display Duration (seconds)"
                type="number"
                size="small"
                value={displayDuration}
                onChange={(event) => setDisplayDuration(event.target.value)}
                disabled={isBusy}
              />

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
                disabled={!selectedImageId || isBusy}
                size="small"
              >
                {isAddingItem ? 'Adding...' : 'Add Image'}
              </Button>
            </Box>
          </Paper>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Items ({items.length})
          </Typography>

          {isLoadingDetails ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : items.length === 0 ? (
            <Typography variant="caption" color="textSecondary">
              No images added yet
            </Typography>
          ) : (
            <List sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
              {items.map((item, index) => (
                <ListItem key={item.id} sx={{ py: 1 }}>
                  <ListItemText
                    sx={{
                      maxWidth: '150px',
                      marginRight: '50px',
                      minWidth: 0,
                    }}
                    primary={
                      <Typography
                        noWrap
                        variant="body1"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {index + 1}. {item.imageName}
                      </Typography>
                    }
                    secondary={`Order: ${item.order}`}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      mr: 2,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleMoveItem(item, index, 'up')}
                      disabled={index === 0 || isBusy}
                      title="Move up"
                    >
                      <KeyboardArrowUpIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => handleMoveItem(item, index, 'down')}
                      disabled={index === items.length - 1 || isBusy}
                      title="Move down"
                    >
                      <KeyboardArrowDownIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mr: 5,
                    }}
                  >
                    <TextField
                      label="Seconds"
                      type="number"
                      size="small"
                      defaultValue={item.displayDurationSeconds}
                      sx={{ width: 100 }}
                      disabled={updatingItemId === item.id || isDeletingItem}
                      onBlur={(event) =>
                        handleUpdateItemDuration(item, event.target.value)
                      }
                    />

                    {updatingItemId === item.id && (
                      <CircularProgress size={18} />
                    )}
                  </Box>

                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isBusy}
                      size="small"
                      color="error"
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
        <Button onClick={onClose} disabled={isBusy}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
