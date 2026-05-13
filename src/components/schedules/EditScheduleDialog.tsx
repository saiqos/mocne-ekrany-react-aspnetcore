import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useSchedules } from '../../hooks/useSchedules';
import { useScreens } from '../../hooks/useScreens';
import { useImages } from '../../hooks/useImages';
import type { Schedule } from '../../types';

interface EditScheduleDialogProps {
  open: boolean;
  schedule: Schedule | null;
  onClose: () => void;
}

export const EditScheduleDialog = ({
  open,
  schedule,
  onClose,
}: EditScheduleDialogProps) => {
  const { updateSchedule, isUpdating } = useSchedules();
  const { screens } = useScreens();
  const { images } = useImages();

  const [formData, setFormData] = useState({
    name: '',
    screenId: '',
    imageId: '',
    startDate: '',
    startTime: '00:00',
    endDate: '',
    endTime: '23:59',
    isRecurring: false,
    priority: 1,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Инициализируем форму при открытии
  useEffect(() => {
    if (schedule && open) {
      const startDate = new Date(schedule.startDate);
      const endDate = new Date(schedule.endDate);

      setFormData({
        name: schedule.name,
        screenId: schedule.screenId,
        imageId: schedule.imageId || '',
        startDate: startDate.toISOString().split('T')[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split('T')[0],
        endTime: endDate.toTimeString().slice(0, 5),
        isRecurring: schedule.isRecurring,
        priority: schedule.priority,
      });
      setErrors({});
    }
  }, [schedule, open]);

  const handleValidate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.screenId) newErrors.screenId = 'Screen is required';
    if (!formData.imageId) newErrors.imageId = 'Image is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';

    const startDateTime = new Date(
      `${formData.startDate}T${formData.startTime}`,
    );
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    if (startDateTime >= endDateTime) {
      newErrors.endDate = 'End date/time must be after start date/time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!handleValidate() || !schedule) return;

    const startDateTime = new Date(
      `${formData.startDate}T${formData.startTime}`,
    ).toISOString();
    const endDateTime = new Date(
      `${formData.endDate}T${formData.endTime}`,
    ).toISOString();

    updateSchedule(
      {
        id: schedule.id,
        data: {
          name: formData.name,
          screenId: formData.screenId,
          imageId: formData.imageId,
          startDate: startDateTime,
          endDate: endDateTime,
          isRecurring: formData.isRecurring,
          priority: formData.priority,
        },
      },
      {
        onSuccess: () => {
          setFormData({
            name: '',
            screenId: '',
            imageId: '',
            startDate: '',
            startTime: '00:00',
            endDate: '',
            endTime: '23:59',
            isRecurring: false,
            priority: 1,
          });
          setErrors({});
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Schedule</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Schedule Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isUpdating}
          />

          <Autocomplete
            options={screens}
            getOptionLabel={(option) => option.name}
            value={screens.find((s) => s.id === formData.screenId) || null}
            onChange={(_, value) =>
              setFormData({ ...formData, screenId: value?.id || '' })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Screen"
                error={!!errors.screenId}
                helperText={errors.screenId}
                disabled={isUpdating}
              />
            )}
          />

          <Autocomplete
            options={images}
            getOptionLabel={(option) => option.name}
            value={images.find((i) => i.id === formData.imageId) || null}
            onChange={(_, value) =>
              setFormData({ ...formData, imageId: value?.id || '' })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Image"
                error={!!errors.imageId}
                helperText={errors.imageId}
                disabled={isUpdating}
              />
            )}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              error={!!errors.startDate}
              helperText={errors.startDate}
              InputLabelProps={{ shrink: true }}
              disabled={isUpdating}
            />
            <TextField
              label="Start Time"
              type="time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              disabled={isUpdating}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              error={!!errors.endDate}
              helperText={errors.endDate}
              InputLabelProps={{ shrink: true }}
              disabled={isUpdating}
            />
            <TextField
              label="End Time"
              type="time"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              disabled={isUpdating}
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              label="Priority"
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value as number })
              }
              disabled={isUpdating}
            >
              <MenuItem value={1}>High (1)</MenuItem>
              <MenuItem value={2}>Medium (2)</MenuItem>
              <MenuItem value={3}>Low (3)</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isRecurring}
                onChange={(e) =>
                  setFormData({ ...formData, isRecurring: e.target.checked })
                }
                disabled={isUpdating}
              />
            }
            label="Recurring Schedule"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isUpdating}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Updating...
            </>
          ) : (
            'Update'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
