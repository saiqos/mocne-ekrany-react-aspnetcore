import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { ScreenTable } from '../components/screens/ScreenTable';
import { AddScreenDialog } from '../components/screens/AddScreenDialog';
import { EditScreenDialog } from '../components/screens/EditScreenDialog';
import { DeleteScreenDialog } from '../components/screens/DeleteScreenDialog';
import { DisplayImageDialog } from '../components/screens/DisplayImageDialog'; // added: dialog for displaying image immediately
import { useScreens } from '../hooks/useScreens';
import { useImages } from '../hooks/useImages'; // added: images are needed for DisplayImageDialog
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

    displayImage, // added: sends image display command through backend/MQTT
    isDisplayingImage, // added: loading state for display image command
  } = useScreens();

  const { images } = useImages(); // added: available images for immediate display

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [displayImageDialogOpen, setDisplayImageDialogOpen] = useState(false); // added: display image dialog state

  const [selectedScreen, setSelectedScreen] = useState<Screen | null>(null);

  const handleEditClick = (screen: Screen) => {
    setSelectedScreen(screen);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (screen: Screen) => {
    setSelectedScreen(screen);
    setDeleteDialogOpen(true);
  };

  const handleDisplayImageClick = (screen: Screen) => {
    setSelectedScreen(screen); // added: save screen for DisplayImageDialog
    setDisplayImageDialogOpen(true); // added: open image selector dialog
  };

  const handleCloseSelectedDialog = () => {
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setDisplayImageDialogOpen(false); // added: close display image dialog too
    setSelectedScreen(null);
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

        <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>
          Create Screen
        </Button>
      </Box>

      <ScreenTable
        screens={screens}
        isLoading={isLoading}
        isError={isError}
        error={error}
        isControllingPower={isControllingPower}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onPowerClick={powerControl}
        onDisplayImageClick={handleDisplayImageClick} // added: opens DisplayImageDialog
      />

      <AddScreenDialog
        open={createDialogOpen}
        isCreating={isCreating}
        createScreen={createScreen}
        onClose={() => setCreateDialogOpen(false)}
      />

      <EditScreenDialog
        open={editDialogOpen}
        screen={selectedScreen}
        isUpdating={isUpdating}
        updateScreen={updateScreen}
        onClose={handleCloseSelectedDialog}
      />

      <DisplayImageDialog
        open={displayImageDialogOpen}
        screen={selectedScreen}
        images={images}
        isDisplayingImage={isDisplayingImage}
        displayImage={displayImage}
        onClose={handleCloseSelectedDialog}
      />

      <DeleteScreenDialog
        open={deleteDialogOpen}
        screen={selectedScreen}
        isDeleting={isDeleting}
        deleteScreen={deleteScreen}
        onClose={handleCloseSelectedDialog}
      />
    </Box>
  );
};
