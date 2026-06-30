import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Collection, Image, Schedule, Screen } from '../../types'; // changed: added Collection type

interface ScheduleTableProps {
  schedules: Schedule[];
  screens: Screen[];
  images: Image[];
  collections: Collection[]; // added: needed to show collection names
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  onEditClick: (schedule: Schedule) => void;
  onDeleteClick: (schedule: Schedule) => void;
}

export const ScheduleTable = ({
  schedules,
  screens,
  images,
  collections, // added: receive collections from parent
  isLoading,
  isError,
  error,
  onEditClick,
  onDeleteClick,
}: ScheduleTableProps) => {
  const getScreenName = (screenId: number) => {
    return (
      screens.find((screen) => screen.id === screenId)?.name || String(screenId)
    );
  };

  const getImageName = (imageId: number | null) => {
    if (!imageId) return null; // changed: null helps us detect if schedule is not image-based

    return (
      images.find((image) => image.id === imageId)?.name || String(imageId)
    );
  };

  const getCollectionName = (collectionId: number | null) => {
    if (!collectionId) return null; // added: null helps us detect if schedule is not collection-based

    return (
      collections.find((collection) => collection.id === collectionId)?.name ||
      String(collectionId)
    );
  };

  const getContentLabel = (schedule: Schedule) => {
    const imageName = getImageName(schedule.imageId); // added: try image content first
    const collectionName = getCollectionName(schedule.collectionId); // added: try collection content second

    if (imageName) return `Image: ${imageName}`; // added: image schedule label
    if (collectionName) return `Collection: ${collectionName}`; // added: collection schedule label

    return '-';
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">{error || 'Failed to load schedules'}</Alert>
    );
  }

  if (schedules.length === 0) {
    return (
      <Alert severity="info">
        No schedules yet. Create your first schedule!
      </Alert>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>Name</TableCell>
            <TableCell>Screen</TableCell>
            <TableCell>Content</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Recurring</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell
                sx={{
                  fontWeight: 500,
                }}
              >
                {schedule.name}
              </TableCell>

              <TableCell>{getScreenName(schedule.screenId)}</TableCell>

              <TableCell
                sx={{
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap', // added: better ellipsis
                }}
              >
                {getContentLabel(schedule)}
              </TableCell>

              <TableCell sx={{ fontSize: '0.875rem' }}>
                {new Date(schedule.startDate).toLocaleString()}
              </TableCell>

              <TableCell sx={{ fontSize: '0.875rem' }}>
                {new Date(schedule.endDate).toLocaleString()}
              </TableCell>

              <TableCell>
                <Chip
                  label={schedule.isRecurring ? 'Yes' : 'No'}
                  size="small"
                  color={schedule.isRecurring ? 'primary' : 'default'}
                />
              </TableCell>

              <TableCell>
                <Chip
                  label={`P${schedule.priority}`}
                  size="small"
                  variant="outlined"
                />
              </TableCell>

              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={() => onEditClick(schedule)}
                  title="Edit"
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => onDeleteClick(schedule)}
                  title="Delete"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
