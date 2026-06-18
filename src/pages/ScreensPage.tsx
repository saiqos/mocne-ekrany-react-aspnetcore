import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { ScreenTable } from '../components/screens/ScreenTable';
import { AddScreenDialog } from '../components/screens/AddScreenDialog';
import { EditScreenDialog } from '../components/screens/EditScreenDialog';
import { DeleteScreenDialog } from '../components/screens/DeleteScreenDialog';
import { useScreens } from '../hooks/useScreens';
import type { Screen } from '../types';

export const ScreensPage = () => {
  const {
    screens,
    isLoading,
    isError,
    error,

    createScreen,
    isCreating,

    updateScreen,
    isUpdating,

    deleteScreen,
    isDeleting,

    powerControl,
    isControllingPower,
  } = useScreens();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<Screen | null>(null);

  const handleEditClick = (screen: Screen) => {
    setSelectedScreen(screen);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (screen: Screen) => {
    setSelectedScreen(screen);
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
        <Typography variant="h4">Screens</Typography>

        <Button variant="contained" onClick={() => setAddDialogOpen(true)}>
          Add Screen
        </Button>
      </Box>

      <ScreenTable
        screens={screens}
        isLoading={isLoading}
        isError={isError}
        error={error}
        powerControl={powerControl}
        isControllingPower={isControllingPower}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      <AddScreenDialog
        open={addDialogOpen}
        createScreen={createScreen}
        isCreating={isCreating}
        onClose={() => setAddDialogOpen(false)}
      />

      <EditScreenDialog
        open={editDialogOpen}
        screen={selectedScreen}
        updateScreen={updateScreen}
        isUpdating={isUpdating}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedScreen(null);
        }}
      />

      <DeleteScreenDialog
        open={deleteDialogOpen}
        screen={selectedScreen}
        deleteScreen={deleteScreen}
        isDeleting={isDeleting}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedScreen(null);
        }}
      />
    </Box>
  );
};
