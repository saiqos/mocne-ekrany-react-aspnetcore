import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import EventIcon from '@mui/icons-material/Event';
import type { Collection } from '../../types';

interface CollectionListProps {
  collections: Collection[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  onEditClick: (collection: Collection) => void;
  onItemsClick: (collection: Collection) => void;
  onScheduleClick: (collection: Collection) => void;
  onDeleteClick: (collection: Collection) => void;
}

export const CollectionList = ({
  collections,
  isLoading,
  isError,
  error,
  onEditClick,
  onItemsClick,
  onScheduleClick,
  onDeleteClick,
}: CollectionListProps) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">{error || 'Failed to load collections'}</Alert>
    );
  }

  if (collections.length === 0) {
    return (
      <Alert severity="info">
        No collections yet. Create your first collection!
      </Alert>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>Name</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {collections.map((collection) => (
            <TableRow key={collection.id}>
              <TableCell sx={{ fontWeight: 500 }}>{collection.name}</TableCell>

              <TableCell>
                <Chip
                  label={collection.itemCount}
                  size="small"
                  color={collection.itemCount > 0 ? 'primary' : 'default'}
                />
              </TableCell>

              <TableCell sx={{ fontSize: '0.875rem' }}>
                {new Date(collection.createdAt).toLocaleString()}
              </TableCell>

              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={() => onItemsClick(collection)}
                  title="Edit items"
                  color="primary"
                >
                  <ImageIcon />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => onScheduleClick(collection)}
                  title="Schedule collection"
                  color="success"
                >
                  <EventIcon />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => onEditClick(collection)}
                  title="Edit collection"
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => onDeleteClick(collection)}
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
