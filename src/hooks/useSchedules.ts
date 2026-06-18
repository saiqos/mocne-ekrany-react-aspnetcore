import { useCallback, useEffect, useState } from 'react';
import { scheduleService } from '../services/schedules';
import { useSnackbarStore } from '../store/snackbarStore';
import type { Schedule } from '../types';
import type {
    CreateSchedulePayload,
    UpdateSchedulePayload,
} from '../services/schedules';

export const useSchedules = () => {
    const { showSnackbar } = useSnackbarStore();

    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSchedules = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await scheduleService.getAll();
            setSchedules(data);
        } catch (err) {
            setError('Failed to load schedules');
            showSnackbar('Failed to load schedules', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showSnackbar]);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    const createSchedule = async (payload: CreateSchedulePayload) => {
        setIsCreating(true);

        try {
            await scheduleService.create(payload);
            showSnackbar('Schedule created successfully', 'success');
            await fetchSchedules();
        } catch (err) {
            showSnackbar('Failed to create schedule', 'error');
            throw err;
        } finally {
            setIsCreating(false);
        }
    };

    const updateSchedule = async (id: number, payload: UpdateSchedulePayload) => {
        setIsUpdating(true);

        try {
            await scheduleService.update(id, payload);
            showSnackbar('Schedule updated successfully', 'success');
            await fetchSchedules();
        } catch (err) {
            showSnackbar('Failed to update schedule', 'error');
            throw err;
        } finally {
            setIsUpdating(false);
        }
    };

    const deleteSchedule = async (id: number) => {
        setIsDeleting(true);

        try {
            await scheduleService.delete(id);
            showSnackbar('Schedule deleted successfully', 'success');
            await fetchSchedules();
        } catch (err) {
            showSnackbar('Failed to delete schedule', 'error');
            throw err;
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        schedules,
        isLoading,
        isError: Boolean(error),
        error,

        createSchedule,
        isCreating,

        updateSchedule,
        isUpdating,

        deleteSchedule,
        isDeleting,

        refetchSchedules: fetchSchedules,
    };
};