import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { screenService } from '../services/screens';
import { useSnackbarStore } from '../store/snackbarStore';

export const useScreens = () => {
    const { showSnackbar } = useSnackbarStore();
    const queryClient = useQueryClient();

    // GET all screens
    const screensQuery = useQuery({
        queryKey: ['screens'],
        queryFn: screenService.getAll,
    });

    // POST create screen
    const createMutation = useMutation({
        mutationFn: screenService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['screens'] });
            showSnackbar('Screen created successfully', 'success');
        },
        onError: (error: any) => {
            showSnackbar(error.message || 'Failed to create screen', 'error');
        },
    });

    // PUT update screen
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            screenService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['screens'] });
            showSnackbar('Screen updated successfully', 'success');
        },
        onError: (error: any) => {
            showSnackbar(error.message || 'Failed to update screen', 'error');
        },
    });

    // DELETE screen
    const deleteMutation = useMutation({
        mutationFn: screenService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['screens'] });
            showSnackbar('Screen deleted successfully', 'success');
        },
        onError: (error: any) => {
            showSnackbar(error.message || 'Failed to delete screen', 'error');
        },
    });

    // POST power control
    const powerControlMutation = useMutation({
        mutationFn: ({ id, action }: { id: string; action: 'on' | 'off' }) =>
            screenService.powerControl(id, action),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['screens'] });
            showSnackbar('Power control executed', 'success');
        },
        onError: (error: any) => {
            showSnackbar(error.message || 'Failed to control power', 'error');
        },
    });

    return {
        // Query
        screens: screensQuery.data || [],
        isLoading: screensQuery.isLoading,
        isError: screensQuery.isError,
        error: screensQuery.error,

        // Mutations
        createScreen: createMutation.mutate,
        isCreating: createMutation.isPending,

        updateScreen: updateMutation.mutate,
        isUpdating: updateMutation.isPending,

        deleteScreen: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,

        powerControl: powerControlMutation.mutate,
        isControllingPower: powerControlMutation.isPending,
    };
};