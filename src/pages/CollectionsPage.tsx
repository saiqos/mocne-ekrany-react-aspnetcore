import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { CollectionList } from '../components/collections/CollectionList';
import { CreateCollectionDialog } from '../components/collections/CreateCollectionDialog';
import { EditCollectionDialog } from '../components/collections/EditCollectionDialog';
import { DeleteCollectionDialog } from '../components/collections/DeleteCollectionDialog';
import { CollectionItemsEditor } from '../components/collections/CollectionItemsEditor';
import { useCollections } from '../hooks/useCollections';
import type { Collection } from '../types';

export const CollectionsPage = () => {
  const {
    collections,
    isLoading,
    isError,
    error,

    createCollection,
    isCreating,

    updateCollection,
    isUpdating,

    deleteCollection,
    isDeleting,

    getCollectionById,

    addCollectionItem,
    isAddingItem,

    updateCollectionItem,
    isUpdatingItem,

    deleteCollectionItem,
    isDeletingItem,
  } = useCollections();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [itemsDialogOpen, setItemsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  const handleEditClick = (collection: Collection) => {
    setSelectedCollection(collection);
    setEditDialogOpen(true);
  };

  const handleItemsClick = (collection: Collection) => {
    setSelectedCollection(collection);
    setItemsDialogOpen(true);
  };

  const handleDeleteClick = (collection: Collection) => {
    setSelectedCollection(collection);
    setDeleteDialogOpen(true);
  };

  const handleCloseSelectedDialog = () => {
    setEditDialogOpen(false);
    setItemsDialogOpen(false);
    setDeleteDialogOpen(false);
    setSelectedCollection(null);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">Collections</Typography>

        <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>
          Create Collection
        </Button>
      </Box>

      <CollectionList
        collections={collections}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onEditClick={handleEditClick}
        onItemsClick={handleItemsClick}
        onDeleteClick={handleDeleteClick}
      />

      <CreateCollectionDialog
        open={createDialogOpen}
        isCreating={isCreating}
        createCollection={createCollection}
        onClose={() => setCreateDialogOpen(false)}
      />

      <EditCollectionDialog
        open={editDialogOpen}
        collection={selectedCollection}
        isUpdating={isUpdating}
        updateCollection={updateCollection}
        onClose={handleCloseSelectedDialog}
      />

      <CollectionItemsEditor
        open={itemsDialogOpen}
        collection={selectedCollection}
        getCollectionById={getCollectionById}
        addCollectionItem={addCollectionItem}
        updateCollectionItem={updateCollectionItem}
        deleteCollectionItem={deleteCollectionItem}
        isAddingItem={isAddingItem}
        isUpdatingItem={isUpdatingItem}
        isDeletingItem={isDeletingItem}
        onClose={handleCloseSelectedDialog}
      />

      <DeleteCollectionDialog
        open={deleteDialogOpen}
        collection={selectedCollection}
        isDeleting={isDeleting}
        deleteCollection={deleteCollection}
        onClose={handleCloseSelectedDialog}
      />
    </Box>
  );
};
