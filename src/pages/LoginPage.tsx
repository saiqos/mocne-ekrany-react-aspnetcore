import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';
import { useAuthStore } from '../store/authStore';
import { useSnackbarStore } from '../store/snackbarStore';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { showSnackbar } = useSnackbarStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (username === 'admin' && password === 'admin') {
        const mockUser: User = {
          id: '1',
          username: 'admin',
          role: 'Admin',
        };
        const mockToken = 'mock-jwt-token-12345';

        setAuth(mockToken, mockUser);
        showSnackbar('Login successful!', 'success');
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
        showSnackbar('Invalid credentials', 'error');
      }
    } catch (err) {
      setError('Login failed');
      showSnackbar('Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 400, p: 4 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 3 }}>
          Screen Manager
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          disabled={isLoading}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          disabled={isLoading || !username || !password}
          sx={{ mt: 3 }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </Card>
    </Box>
  );
};
