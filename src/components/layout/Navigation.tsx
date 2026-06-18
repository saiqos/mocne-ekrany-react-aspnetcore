import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScreenshotIcon from '@mui/icons-material/Screenshot';
import ImageIcon from '@mui/icons-material/Image';
import CollectionsIcon from '@mui/icons-material/Collections';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
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
  const { user } = useAuthStore();

  const isAdmin = user?.role === 'Admin';

  const visibleMenuItems = menuItems.filter((item) => {
    if (!item.adminOnly) return true;

    return isAdmin;
  });

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <List>
      {visibleMenuItems.map((item) => {
        const active = isActive(item.path);

        return (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              backgroundColor: active ? '#e3f2fd' : 'transparent',
              borderLeft: active
                ? '4px solid #1976d2'
                : '4px solid transparent',
              paddingLeft: active ? 'calc(16px - 4px)' : '16px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: active ? '#1976d2' : 'inherit',
                transition: 'color 0.3s ease',
              }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.text}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: 400,
                  color: active ? '#1976d2' : 'inherit',
                  transition: 'all 0.3s ease',
                },
              }}
            />
          </ListItem>
        );
      })}
    </List>
  );
};
