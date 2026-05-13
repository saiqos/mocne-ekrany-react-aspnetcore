import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <Box textAlign="center" py={8}>
      <Typography variant="h3" mb={2}>
        404 - Not Found
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Go Home
      </Button>
    </Box>
  );
};
