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
  Typography,
} from '@mui/material';
import { useState } from 'react';
import type { Collection, Image, Screen } from '../../types'; // changed: added Collection type
import type { CreateSchedulePayload } from '../../services/schedules';

type ContentType = 'image' | 'collection'; // added: schedule can be created for image or collection

interface CreateScheduleDialogProps {
  open: boolean;
  screens: Screen[];
  images: Image[];
  collections: Collection[]; // added: collections list for collection schedules
  isCreating: boolean;
  createSchedule: (payload: CreateSchedulePayload) => Promise<void>;
  onClose: () => void;
}

export const CreateScheduleDialog = ({
  open,
  screens,
  images,
  collections, // added: receive collections from parent
  isCreating,
  createSchedule,
  onClose,
}: CreateScheduleDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    screenId: null as number | null,
    contentType: 'image' as ContentType, // added: selected content type
    imageId: null as number | null,
    collectionId: null as number | null, // added: selected collection id
    startDate: '',
    startTime: '00:00',
    endDate: '',
    endTime: '23:59',
    isRecurring: false,
    priority: 1,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const resetForm = () => {
    setFormData({
      name: '',
      screenId: null,
      contentType: 'image', // added: reset content type
      imageId: null,
      collectionId: null, // added: reset selected collection
      startDate: '',
      startTime: '00:00',
      endDate: '',
      endTime: '23:59',
      isRecurring: false,
      priority: 1,
    });
    setErrors({});
  };

  const handleValidate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.screenId) newErrors.screenId = 'Screen is required';

    if (formData.contentType === 'image' && !formData.imageId) {
      newErrors.imageId = 'Image is required'; // changed: image required only for image schedule
    }

    if (formData.contentType === 'collection' && !formData.collectionId) {
      newErrors.collectionId = 'Collection is required'; // added: collection required only for collection schedule
    }

    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';

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
    if (!handleValidate() || !formData.screenId) return; // changed: imageId is no longer always required

    const startDateTime = new Date(
      `${formData.startDate}T${formData.startTime}`,
    ).toISOString();

    const endDateTime = new Date(
      `${formData.endDate}T${formData.endTime}`,
    ).toISOString();

    await createSchedule({
      name: formData.name,
      screenId: formData.screenId,
      imageId: formData.contentType === 'image' ? formData.imageId : null, // changed: set imageId only for image schedule
      collectionId:
        formData.contentType === 'collection' ? formData.collectionId : null, // added: set collectionId only for collection schedule
      startDate: startDateTime,
      endDate: endDateTime,
      isRecurring: formData.isRecurring,
      recurrencePattern: null,
      priority: formData.priority,
    });

    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Schedule</DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Schedule Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isCreating}
          />

          <Autocomplete
            options={screens}
            getOptionLabel={(option) => option.name}
            value={
              screens.find((screen) => screen.id === formData.screenId) || null
            }
            onChange={(_, value) =>
              setFormData({ ...formData, screenId: value?.id ?? null })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Screen"
                error={!!errors.screenId}
                helperText={errors.screenId}
                disabled={isCreating}
              />
            )}
          />

          <FormControl fullWidth>
            <InputLabel>Content Type</InputLabel>

            <Select
              value={formData.contentType}
              label="Content Type"
              disabled={isCreating}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contentType: e.target.value as ContentType, // added: switch between image and collection
                  imageId: null, // added: clear image when type changes
                  collectionId: null, // added: clear collection when type changes
                })
              }
            >
              <MenuItem value="image">Image</MenuItem>
              <MenuItem value="collection">Collection</MenuItem>
            </Select>
          </FormControl>

          {formData.contentType === 'image' && (
            <Autocomplete
              options={images}
              getOptionLabel={(option) => option.name}
              value={
                images.find((image) => image.id === formData.imageId) || null
              }
              onChange={(_, value) =>
                setFormData({ ...formData, imageId: value?.id ?? null })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Image"
                  error={!!errors.imageId}
                  helperText={errors.imageId}
                  disabled={isCreating}
                />
              )}
            />
          )}

          {formData.contentType === 'collection' && (
            <Autocomplete
              options={collections}
              getOptionLabel={(option) => option.name}
              value={
                collections.find(
                  (collection) => collection.id === formData.collectionId,
                ) || null
              }
              onChange={(_, value) =>
                setFormData({ ...formData, collectionId: value?.id ?? null })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Collection"
                  error={!!errors.collectionId}
                  helperText={errors.collectionId}
                  disabled={isCreating}
                />
              )}
            />
          )}

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
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
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
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
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
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
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
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
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
              onChange={(e) =>
                setFormData({ ...formData, priority: Number(e.target.value) })
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
                onChange={(e) =>
                  setFormData({ ...formData, isRecurring: e.target.checked })
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
            'Create'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
