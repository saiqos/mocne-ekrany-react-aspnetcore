import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { UsersTable } from '../components/users/UsersTable';
import { CreateUserDialog } from '../components/users/CreateUserDialog';
import { ChangeUserRoleDialog } from '../components/users/ChangeUserRoleDialog';
import { ChangeUserPasswordDialog } from '../components/users/ChangeUserPasswordDialog';
import { DeleteUserDialog } from '../components/users/DeleteUserDialog';
import type { UserDto } from '../types';

export const UsersPage = () => {
  const {
    users,
    isLoading,
    isError,
    error,

    createUser,
    isCreating,

    updateUserRole,
    isUpdatingRole,

    updateUserPassword,
    isUpdatingPassword,

    deleteUser,
    isDeleting,
  } = useUsers();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  const handleRoleClick = (user: UserDto) => {
    setSelectedUser(user);
    setRoleDialogOpen(true);
  };

  const handlePasswordClick = (user: UserDto) => {
    setSelectedUser(user);
    setPasswordDialogOpen(true);
  };

  const handleDeleteClick = (user: UserDto) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseSelectedDialog = () => {
    setRoleDialogOpen(false);
    setPasswordDialogOpen(false);
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">Users</Typography>

        <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>
          Create User
        </Button>
      </Box>

      <UsersTable
        users={users}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRoleClick={handleRoleClick}
        onPasswordClick={handlePasswordClick}
        onDeleteClick={handleDeleteClick}
      />

      <CreateUserDialog
        open={createDialogOpen}
        isCreating={isCreating}
        createUser={createUser}
        onClose={() => setCreateDialogOpen(false)}
      />

      <ChangeUserRoleDialog
        open={roleDialogOpen}
        user={selectedUser}
        isUpdatingRole={isUpdatingRole}
        updateUserRole={updateUserRole}
        onClose={handleCloseSelectedDialog}
      />

      <ChangeUserPasswordDialog
        open={passwordDialogOpen}
        user={selectedUser}
        isUpdatingPassword={isUpdatingPassword}
        updateUserPassword={updateUserPassword}
        onClose={handleCloseSelectedDialog}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        user={selectedUser}
        isDeleting={isDeleting}
        deleteUser={deleteUser}
        onClose={handleCloseSelectedDialog}
      />
    </Box>
  );
};
