import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import ScreenshotIcon from '@mui/icons-material/Screenshot';
import ImageIcon from '@mui/icons-material/Image';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CollectionsIcon from '@mui/icons-material/Collections';
import type { ReactNode } from 'react';
import { useScreens } from '../hooks/useScreens';
import { useImages } from '../hooks/useImages';
import { useSchedules } from '../hooks/useSchedules';
import { useCollections } from '../hooks/useCollections';
import { useLogs } from '../hooks/useLogs';
import type { AuditLog } from '../types';

type StatCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
};

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: color,
            color: 'white',
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography color="textSecondary" variant="body2">
            {title}
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

type StatusCardProps = {
  title: string;
  online: number;
  offline: number;
};

const StatusCard = ({ title, online, offline }: StatusCardProps) => {
  const total = online + offline;
  const onlinePercent = total === 0 ? 0 : (online / total) * 100;

  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary" variant="body2" sx={{ mb: 2 }}>
          {title}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={onlinePercent}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#4caf50',
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" color="textSecondary">
              Online
            </Typography>
            <Typography variant="h6" sx={{ color: '#4caf50' }}>
              {online}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="textSecondary">
              Offline
            </Typography>
            <Typography variant="h6" sx={{ color: '#f44336' }}>
              {offline}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="textSecondary">
              Total
            </Typography>
            <Typography variant="h6">{total}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const RecentActivityCard = ({ logs }: { logs: AuditLog[] }) => {
  const recentLogs = [...logs]
    .sort(
      (firstLog, secondLog) =>
        new Date(secondLog.timestamp).getTime() -
        new Date(firstLog.timestamp).getTime(),
    )
    .slice(0, 5);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Activity
        </Typography>

        <Stack spacing={1}>
          {recentLogs.length === 0 ? (
            <Typography variant="caption" color="textSecondary">
              No recent activity
            </Typography>
          ) : (
            recentLogs.map((log, index) => (
              <Box key={log.id}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: 0.5,
                        backgroundColor:
                          log.action === 'CREATE'
                            ? '#c8e6c9'
                            : log.action === 'UPDATE'
                              ? '#bbdefb'
                              : log.action === 'DELETE'
                                ? '#ffcdd2'
                                : '#f0f0f0',
                        fontWeight: 500,
                        mr: 1,
                      }}
                    >
                      {log.action}
                    </Typography>

                    <Typography variant="caption">
                      {log.entityType} ({log.entityId})
                    </Typography>
                  </Box>

                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ textAlign: 'right' }}
                  >
                    {new Date(log.timestamp).toLocaleString()}
                  </Typography>
                </Box>

                {index < recentLogs.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export const DashboardPage = () => {
  const {
    screens,
    isLoading: isScreensLoading,
    isError: isScreensError,
  } = useScreens();

  const {
    images,
    isLoading: isImagesLoading,
    isError: isImagesError,
  } = useImages();

  const {
    schedules,
    isLoading: isSchedulesLoading,
    isError: isSchedulesError,
  } = useSchedules();

  const {
    collections,
    isLoading: isCollectionsLoading,
    isError: isCollectionsError,
  } = useCollections();

  const { logs, isLoading: isLogsLoading, isError: isLogsError } = useLogs();

  const isLoading =
    isScreensLoading ||
    isImagesLoading ||
    isSchedulesLoading ||
    isCollectionsLoading ||
    isLogsLoading;

  const isError =
    isScreensError ||
    isImagesError ||
    isSchedulesError ||
    isCollectionsError ||
    isLogsError;

  const screensOnline = screens.filter(
    (screen) => screen.status === 'Online',
  ).length;
  const screensOffline = screens.filter(
    (screen) => screen.status === 'Offline',
  ).length;

  const activeSchedules = schedules.filter((schedule) => {
    const now = new Date();
    const start = new Date(schedule.startDate);
    const end = new Date(schedule.endDate);

    return start <= now && now <= end;
  }).length;

  const storageUsedInMb = (
    images.reduce((sum, image) => sum + image.fileSize, 0) /
    1024 /
    1024
  ).toFixed(2);

  const latestLog = [...logs].sort(
    (firstLog, secondLog) =>
      new Date(secondLog.timestamp).getTime() -
      new Date(firstLog.timestamp).getTime(),
  )[0];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">Failed to load dashboard data</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Screens"
            value={screens.length}
            icon={<ScreenshotIcon sx={{ fontSize: 28 }} />}
            color="#1976d2"
          />
        </Grid>

        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Images"
            value={images.length}
            icon={<ImageIcon sx={{ fontSize: 28 }} />}
            color="#f57c00"
          />
        </Grid>

        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Active Schedules"
            value={activeSchedules}
            icon={<ScheduleIcon sx={{ fontSize: 28 }} />}
            color="#388e3c"
          />
        </Grid>

        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Collections"
            value={collections.length}
            icon={<CollectionsIcon sx={{ fontSize: 28 }} />}
            color="#7b1fa2"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, md: 6 }}>
          <StatusCard
            title="Screen Status"
            online={screensOnline}
            offline={screensOffline}
          />
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <RecentActivityCard logs={logs} />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
                Total Schedules
              </Typography>

              <Typography variant="h5">{schedules.length}</Typography>

              <Typography variant="caption" color="textSecondary">
                {activeSchedules} active now
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
                Total Logs
              </Typography>

              <Typography variant="h5">{logs.length}</Typography>

              <Typography variant="caption" color="textSecondary">
                {latestLog ? `Last: ${latestLog.action}` : 'No activity'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
                Storage Used
              </Typography>

              <Typography variant="h5">{storageUsedInMb} MB</Typography>

              <Typography variant="caption" color="textSecondary">
                {images.length} files
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
