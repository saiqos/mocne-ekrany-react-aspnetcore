import { useCallback, useEffect, useState } from 'react';
import { userService } from '../services/users';
import { useSnackbarStore } from '../store/snackbarStore';
import type { UserDto } from '../types';
import type {
    CreateUserPayload,
    UpdateUserPasswordPayload,
    UpdateUserRolePayload,
} from '../services/users';

export const useUsers = () => {
    const { showSnackbar } = useSnackbarStore();

    const [users, setUsers] = useState<UserDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isCreating, setIsCreating] = useState(false);
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch {
            setError('Failed to load users');
            showSnackbar('Failed to load users', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showSnackbar]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const createUser = async (payload: CreateUserPayload) => {
        setIsCreating(true);

        try {
            await userService.create(payload);
            showSnackbar('User created successfully', 'success');
            await fetchUsers();
        } catch (err) {
            showSnackbar('Failed to create user', 'error');
            throw err;
        } finally {
            setIsCreating(false);
        }
    };

    const updateUserRole = async (
        id: number,
        payload: UpdateUserRolePayload,
    ) => {
        setIsUpdatingRole(true);

        try {
            await userService.updateRole(id, payload);
            showSnackbar('User role updated successfully', 'success');
            await fetchUsers();
        } catch (err) {
            showSnackbar('Failed to update user role', 'error');
            throw err;
        } finally {
            setIsUpdatingRole(false);
        }
    };

    const updateUserPassword = async (
        id: number,
        payload: UpdateUserPasswordPayload,
    ) => {
        setIsUpdatingPassword(true);

        try {
            await userService.updatePassword(id, payload);
            showSnackbar('User password updated successfully', 'success');
            await fetchUsers();
        } catch (err) {
            showSnackbar('Failed to update user password', 'error');
            throw err;
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const deleteUser = async (id: number) => {
        setIsDeleting(true);

        try {
            await userService.delete(id);
            showSnackbar('User deleted successfully', 'success');
            await fetchUsers();
        } catch (err) {
            showSnackbar('Failed to delete user', 'error');
            throw err;
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        users,
        isLoading,
        isError: Boolean(error),
        error,

        createUser,
        isCreating,

        updateUserRole,
        isUpdatingRole,

        updateUserPassword,
        isUpdatingPassword,

        deleteUser,
        isDeleting,

        refetchUsers: fetchUsers,
    };
};