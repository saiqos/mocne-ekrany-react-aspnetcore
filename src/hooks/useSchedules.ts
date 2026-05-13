import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '../services/schedules';
import { useSnackbarStore } from '../store/snackbarStore';

export const useSchedules = () => {
    const { showSnackbar } = useSnackbarStore();
    const queryClient = useQueryClient();

    const schedulesQuery = useQuery({
        queryKey: ['schedules'],
        queryFn: scheduleService.getAll,
    });

    const createMutation = useMutation({
        mutationFn: scheduleService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
            showSnackbar('Schedule created successfully', 'success');
        },
        onError: (error: any) => {
            showSnackbar(error.message || 'Failed to create schedule', 'error');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            scheduleService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
            showSnackbar('Schedule updated successfully', 'success');
        },
        onError: (error: any) => {
            showSnackbar(error.message || 'Failed to update schedule', 'error');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: scheduleService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
            showSnackbar('Schedule deleted', 'success');
        },
        onError: (error: any) => {
            showSnackbar(error.message || 'Failed to delete schedule', 'error');
        },
    });

    return {
        schedules: schedulesQuery.data || [],
        isLoading: schedulesQuery.isLoading,
        isError: schedulesQuery.isError,
        error: schedulesQuery.error,

        createSchedule: createMutation.mutate,
        isCreating: createMutation.isPending,

        updateSchedule: updateMutation.mutate,
        isUpdating: updateMutation.isPending,

        deleteSchedule: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
};