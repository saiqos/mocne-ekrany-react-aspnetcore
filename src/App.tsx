import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { theme } from './theme/theme';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ScreensPage } from './pages/ScreensPage';
import { ImagesPage } from './pages/ImagesPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { SchedulesPage } from './pages/SchedulesPage';
import { LogsPage } from './pages/LogsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorSnackbar } from './components/common/ErrorSnackbar';
import { UsersPage } from './pages/UsersPage';
import { AdminRoute } from './components/auth/AdminRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="screens" element={<ScreensPage />} />
            <Route path="images" element={<ImagesPage />} />
            <Route path="collections" element={<CollectionsPage />} />
            <Route path="schedules" element={<SchedulesPage />} />
            <Route path="logs" element={<LogsPage />} />
            <Route
              path="users"
              element={
                <AdminRoute>
                  <UsersPage />
                </AdminRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <ErrorSnackbar />
    </ThemeProvider>
  );
}

export default App;
