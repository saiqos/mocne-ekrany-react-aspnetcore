import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScreenshotIcon from '@mui/icons-material/Screenshot';
import ImageIcon from '@mui/icons-material/Image';
import CollectionsIcon from '@mui/icons-material/Collections';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

type MenuItem = {
  text: string;
  icon: React.ReactNode;
  path: string;
  adminOnly?: boolean;
};

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Screens', icon: <ScreenshotIcon />, path: '/dashboard/screens' },
  { text: 'Images', icon: <ImageIcon />, path: '/dashboard/images' },
  {
    text: 'Collections',
    icon: <CollectionsIcon />,
    path: '/dashboard/collections',
  },
  { text: 'Schedules', icon: <ScheduleIcon />, path: '/dashboard/schedules' },
  { text: 'Logs', icon: <AssignmentIcon />, path: '/dashboard/logs' },
  {
    text: 'Users',
    icon: <PeopleIcon />,
    path: '/dashboard/users',
    adminOnly: true,
  },
];

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const isAdmin = user?.role === 'Admin';

  const visibleMenuItems = menuItems.filter((item) => {
    if (!item.adminOnly) return true;

    return isAdmin;
  });

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleOpenLogoutDialog = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleCloseLogoutDialog = () => {
    setIsLogoutDialogOpen(false);
  };

  const handleConfirmLogout = () => {
    clearAuth();
    localStorage.removeItem('auth-storage');
    navigate('/');
  };

  return (
    <>
      <Box
        sx={{
          height: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <List sx={{ py: 0 }}>
          {visibleMenuItems.map((item) => {
            const active = isActive(item.path);

            return (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                sx={{
                  minHeight: 72,
                  textDecoration: 'none',
                  color: 'inherit',
                  backgroundColor: active ? '#e3f2fd' : 'transparent',
                  borderLeft: active
                    ? '6px solid #1976d2'
                    : '6px solid transparent',
                  px: 3,
                  transition: 'all 0.25s ease',

                  '&:hover': {
                    backgroundColor: active ? '#e3f2fd' : '#f5f5f5',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 60,
                    color: active ? '#1976d2' : '#212121',
                    transition: 'color 0.25s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  sx={{
                    '& .MuiTypography-root': {
                      fontSize: 22,
                      fontWeight: active ? 500 : 400,
                      color: active ? '#1976d2' : '#111',
                      transition: 'all 0.25s ease',
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        {/* ADDED: logout button pinned to bottom */}
        <Box
          sx={{
            mt: 'auto',
            px: 2.5,
            pb: 3,
          }}
        >
          <Divider sx={{ mb: 2 }} />

          <ListItemButton
            onClick={handleOpenLogoutDialog}
            sx={{
              minHeight: 56,
              borderRadius: 2,
              color: '#d32f2f',
              marginTop: '-150px',
              transition: 'all 0.25s ease',

              '&:hover': {
                backgroundColor: '#ffebee',
              },

              '&:hover .MuiListItemIcon-root': {
                color: '#c62828',
              },

              '&:hover .MuiTypography-root': {
                color: '#c62828',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 48,
                color: '#d32f2f',
                transition: 'color 0.25s ease',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>

            <ListItemText
              primary="Logout"
              sx={{
                '& .MuiTypography-root': {
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#d32f2f',
                  transition: 'color 0.25s ease',
                },
              }}
            />
          </ListItemButton>
        </Box>
      </Box>

      {/* ADDED: logout confirmation dialog */}
      <Dialog open={isLogoutDialogOpen} onClose={handleCloseLogoutDialog}>
        <DialogTitle>Logout</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseLogoutDialog}>Cancel</Button>

          <Button
            onClick={handleConfirmLogout}
            color="error"
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
