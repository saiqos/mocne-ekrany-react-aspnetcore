import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { CollectionList } from '../components/collections/CollectionList';
import { CreateCollectionDialog } from '../components/collections/CreateCollectionDialog';
import { CollectionItemsEditor } from '../components/collections/CollectionItemsEditor';
import { DeleteCollectionDialog } from '../components/collections/DeleteCollectionDialog';
import type { Collection } from '../types';

export const CollectionsPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editorDialogOpen, setEditorDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  const handleEditClick = (collection: Collection) => {
    setSelectedCollection(collection);
    setEditorDialogOpen(true);
  };

  const handleDeleteClick = (collection: Collection) => {
    setSelectedCollection(collection);
    setDeleteDialogOpen(true);
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
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      <CreateCollectionDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />

      <CollectionItemsEditor
        open={editorDialogOpen}
        collection={selectedCollection}
        onClose={() => {
          setEditorDialogOpen(false);
          setSelectedCollection(null);
        }}
      />

      <DeleteCollectionDialog
        open={deleteDialogOpen}
        collection={selectedCollection}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedCollection(null);
        }}
      />
    </Box>
  );
};
