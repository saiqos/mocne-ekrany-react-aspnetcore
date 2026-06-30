import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { CollectionList } from '../components/collections/CollectionList';
import { CreateCollectionDialog } from '../components/collections/CreateCollectionDialog';
import { EditCollectionDialog } from '../components/collections/EditCollectionDialog';
import { DeleteCollectionDialog } from '../components/collections/DeleteCollectionDialog';
import { CollectionItemsEditor } from '../components/collections/CollectionItemsEditor';
import { ScheduleCollectionDialog } from '../components/collections/ScheduleCollectionDialog';
import { useCollections } from '../hooks/useCollections';
import { useSchedules } from '../hooks/useSchedules';
import { useScreens } from '../hooks/useScreens';
import type { Collection } from '../types';

export const CollectionsPage = () => {
  const {
    collections,
    isLoading,
    isError,
    error,

    createCollection,
    isCreating: isCreatingCollection,

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

  const { screens } = useScreens();

  const { createSchedule, isCreating: isCreatingSchedule } = useSchedules();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [itemsDialogOpen, setItemsDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
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

  const handleScheduleClick = (collection: Collection) => {
    setSelectedCollection(collection);
    setScheduleDialogOpen(true);
  };

  const handleDeleteClick = (collection: Collection) => {
    setSelectedCollection(collection);
    setDeleteDialogOpen(true);
  };

  const handleCloseSelectedDialog = () => {
    setEditDialogOpen(false);
    setItemsDialogOpen(false);
    setScheduleDialogOpen(false);
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
        onScheduleClick={handleScheduleClick}
        onDeleteClick={handleDeleteClick}
      />

      <CreateCollectionDialog
        open={createDialogOpen}
        isCreating={isCreatingCollection}
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

      <ScheduleCollectionDialog
        open={scheduleDialogOpen}
        collection={selectedCollection}
        screens={screens}
        isCreating={isCreatingSchedule}
        createSchedule={createSchedule}
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
