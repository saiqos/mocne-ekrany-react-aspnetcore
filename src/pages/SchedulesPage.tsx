import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { ScheduleTable } from '../components/schedules/ScheduleTable';
import { CreateScheduleDialog } from '../components/schedules/CreateScheduleDialog';
import { EditScheduleDialog } from '../components/schedules/EditScheduleDialog';
import { DeleteScheduleDialog } from '../components/schedules/DeleteScheduleDialog';
import { useSchedules } from '../hooks/useSchedules';
import { useScreens } from '../hooks/useScreens';
import { useImages } from '../hooks/useImages';
import { useCollections } from '../hooks/useCollections'; // added: load collections for schedules
import type { Schedule } from '../types';

export const SchedulesPage = () => {
  const {
    schedules,
    isLoading,
    isError,
    error,

    createSchedule,
    isCreating,

    updateSchedule,
    isUpdating,

    deleteSchedule,
    isDeleting,
  } = useSchedules();

  const { screens } = useScreens();
  const { images } = useImages();
  const { collections } = useCollections(); // added: collections can now be scheduled too

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null,
  );

  const handleEditClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
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
        <Typography variant="h4">Schedules</Typography>

        <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>
          Create Schedule
        </Button>
      </Box>

      <ScheduleTable
        schedules={schedules}
        screens={screens}
        images={images}
        collections={collections} // added: table can show collection name
        isLoading={isLoading}
        isError={isError}
        error={error}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      <CreateScheduleDialog
        open={createDialogOpen}
        screens={screens}
        images={images}
        collections={collections} // added: dialog can create collection schedule
        isCreating={isCreating}
        createSchedule={createSchedule}
        onClose={() => setCreateDialogOpen(false)}
      />

      <EditScheduleDialog
        open={editDialogOpen}
        schedule={selectedSchedule}
        screens={screens}
        images={images}
        collections={collections} // added: dialog can edit collection schedule
        isUpdating={isUpdating}
        updateSchedule={updateSchedule}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedSchedule(null);
        }}
      />

      <DeleteScheduleDialog
        open={deleteDialogOpen}
        schedule={selectedSchedule}
        isDeleting={isDeleting}
        deleteSchedule={deleteSchedule}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedSchedule(null);
        }}
      />
    </Box>
  );
};
