import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { ScheduleTable } from '../components/schedules/ScheduleTable';
import { CreateScheduleDialog } from '../components/schedules/CreateScheduleDialog';
import { EditScheduleDialog } from '../components/schedules/EditScheduleDialog';
import { DeleteScheduleDialog } from '../components/schedules/DeleteScheduleDialog';
import type { Schedule } from '../types';

export const SchedulesPage = () => {
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
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      <CreateScheduleDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />

      <EditScheduleDialog
        open={editDialogOpen}
        schedule={selectedSchedule}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedSchedule(null);
        }}
      />

      <DeleteScheduleDialog
        open={deleteDialogOpen}
        schedule={selectedSchedule}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedSchedule(null);
        }}
      />
    </Box>
  );
};
