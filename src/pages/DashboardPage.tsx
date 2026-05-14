import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Stack,
  Divider,
} from '@mui/material';
import ScreenshotIcon from '@mui/icons-material/Screenshot';
import ImageIcon from '@mui/icons-material/Image';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CollectionsIcon from '@mui/icons-material/Collections';
import { useScreens } from '../hooks/useScreens';
import { useImages } from '../hooks/useImages';
import { useSchedules } from '../hooks/useSchedules';
import { useCollections } from '../hooks/useCollections';
import { useLogs } from '../hooks/useLogs';

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) => (
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

const StatusCard = ({
  title,
  online,
  offline,
}: {
  title: string;
  online: number;
  offline: number;
}) => {
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

const RecentActivityCard = ({ logs }: { logs: any[] }) => {
  const recentLogs = logs.slice(0, 5);

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
              <Box key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
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
  const { screens } = useScreens();
  const { images } = useImages();
  const { schedules } = useSchedules();
  const { collections } = useCollections();
  const { logs } = useLogs();

  // Подсчитываем статистику
  const screensOnline = screens.filter((s) => s.status === 'Online').length;
  const screensOffline = screens.filter((s) => s.status === 'Offline').length;
  const activeSchedules = schedules.filter((s) => {
    const now = new Date();
    const start = new Date(s.startDate);
    const end = new Date(s.endDate);
    return start <= now && now <= end;
  }).length;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      {/* Основные статистики */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Screens"
            value={screens.length}
            icon={<ScreenshotIcon sx={{ fontSize: 28 }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Images"
            value={images.length}
            icon={<ImageIcon sx={{ fontSize: 28 }} />}
            color="#f57c00"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Schedules"
            value={activeSchedules}
            icon={<ScheduleIcon sx={{ fontSize: 28 }} />}
            color="#388e3c"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Collections"
            value={collections.length}
            icon={<CollectionsIcon sx={{ fontSize: 28 }} />}
            color="#7b1fa2"
          />
        </Grid>
      </Grid>

      {/* Статус экранов и активность */}
      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, sm: 6 }}>
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

      {/* Дополнительная информация */}
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
                {logs.slice(0, 1).length > 0
                  ? `Last: ${logs[0]?.action || 'N/A'}`
                  : 'No activity'}
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
              <Typography variant="h5">
                {(
                  images.reduce((sum, img) => sum + img.fileSize, 0) /
                  1024 /
                  1024
                ).toFixed(2)}{' '}
                MB
              </Typography>
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
