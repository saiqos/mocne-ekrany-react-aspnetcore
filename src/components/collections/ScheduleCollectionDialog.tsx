import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { Collection, Screen } from '../../types';
import type { CreateSchedulePayload } from '../../services/schedules';

interface ScheduleCollectionDialogProps {
  open: boolean;
  collection: Collection | null;
  screens: Screen[];
  isCreating: boolean;
  createSchedule: (payload: CreateSchedulePayload) => Promise<void>;
  onClose: () => void;
}

export const ScheduleCollectionDialog = ({
  open,
  collection,
  screens,
  isCreating,
  createSchedule,
  onClose,
}: ScheduleCollectionDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    screenIds: [] as number[],
    startDate: '',
    startTime: '00:00',
    endDate: '',
    endTime: '23:59',
    isRecurring: false,
    priority: 1,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!open || !collection) return;

    setFormData({
      name: `${collection.name} schedule`,
      screenIds: [],
      startDate: '',
      startTime: '00:00',
      endDate: '',
      endTime: '23:59',
      isRecurring: false,
      priority: 1,
    });

    setErrors({});
  }, [open, collection]);

  const handleValidate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Schedule name is required';
    }

    if (formData.screenIds.length === 0) {
      newErrors.screenIds = 'At least one screen is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    const startDateTime = new Date(
      `${formData.startDate}T${formData.startTime}`,
    );

    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    if (
      formData.startDate &&
      formData.endDate &&
      startDateTime >= endDateTime
    ) {
      newErrors.endDate = 'End date/time must be after start date/time';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!handleValidate() || !collection) return;

    const startDateTime = new Date(
      `${formData.startDate}T${formData.startTime}`,
    ).toISOString();

    const endDateTime = new Date(
      `${formData.endDate}T${formData.endTime}`,
    ).toISOString();

    await Promise.all(
      formData.screenIds.map((screenId) =>
        createSchedule({
          name:
            formData.screenIds.length > 1
              ? `${formData.name} - ${screens.find((screen) => screen.id === screenId)?.name ?? screenId}`
              : formData.name,
          screenId,
          imageId: null,
          collectionId: collection.id,
          startDate: startDateTime,
          endDate: endDateTime,
          isRecurring: formData.isRecurring,
          recurrencePattern: null,
          priority: formData.priority,
        }),
      ),
    );

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Schedule Collection: {collection?.name}</DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Schedule Name"
            value={formData.name}
            onChange={(event) =>
              setFormData({ ...formData, name: event.target.value })
            }
            error={!!errors.name}
            helperText={errors.name}
            disabled={isCreating}
          />

          <Autocomplete
            multiple
            options={screens}
            getOptionLabel={(option) => option.name}
            value={screens.filter((screen) =>
              formData.screenIds.includes(screen.id),
            )}
            onChange={(_, value) =>
              setFormData({
                ...formData,
                screenIds: value.map((screen) => screen.id),
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Screens"
                error={!!errors.screenIds}
                helperText={errors.screenIds}
                disabled={isCreating}
              />
            )}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography
                variant="caption"
                sx={{ display: 'block', mb: 1, fontWeight: 500 }}
              >
                Start Date
              </Typography>

              <TextField
                type="date"
                value={formData.startDate}
                onChange={(event) =>
                  setFormData({ ...formData, startDate: event.target.value })
                }
                error={!!errors.startDate}
                helperText={errors.startDate}
                disabled={isCreating}
                fullWidth
                size="small"
              />
            </Box>

            <Box>
              <Typography
                variant="caption"
                sx={{ display: 'block', mb: 1, fontWeight: 500 }}
              >
                Start Time
              </Typography>

              <TextField
                type="time"
                value={formData.startTime}
                onChange={(event) =>
                  setFormData({ ...formData, startTime: event.target.value })
                }
                disabled={isCreating}
                fullWidth
                size="small"
              />
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography
                variant="caption"
                sx={{ display: 'block', mb: 1, fontWeight: 500 }}
              >
                End Date
              </Typography>

              <TextField
                type="date"
                value={formData.endDate}
                onChange={(event) =>
                  setFormData({ ...formData, endDate: event.target.value })
                }
                error={!!errors.endDate}
                helperText={errors.endDate}
                disabled={isCreating}
                fullWidth
                size="small"
              />
            </Box>

            <Box>
              <Typography
                variant="caption"
                sx={{ display: 'block', mb: 1, fontWeight: 500 }}
              >
                End Time
              </Typography>

              <TextField
                type="time"
                value={formData.endTime}
                onChange={(event) =>
                  setFormData({ ...formData, endTime: event.target.value })
                }
                disabled={isCreating}
                fullWidth
                size="small"
              />
            </Box>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>

            <Select
              value={formData.priority}
              label="Priority"
              onChange={(event) =>
                setFormData({
                  ...formData,
                  priority: Number(event.target.value),
                })
              }
              disabled={isCreating}
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
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    isRecurring: event.target.checked,
                  })
                }
                disabled={isCreating}
              />
            }
            label="Recurring Schedule"
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isCreating}>
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isCreating}
        >
          {isCreating ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Creating...
            </>
          ) : (
            'Create Schedule'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
