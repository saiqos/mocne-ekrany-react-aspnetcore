import { useCallback, useEffect, useState } from 'react';
import { screenService } from '../services/screens';
import type { Screen } from '../types';
import { useSnackbarStore } from '../store/snackbarStore';
import type {
    CreateScreenPayload,
    UpdateScreenPayload,
} from '../services/screens';

export const useScreens = () => {
    const { showSnackbar } = useSnackbarStore();

    const [screens, setScreens] = useState<Screen[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isControllingPower, setIsControllingPower] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchScreens = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await screenService.getAll();
            setScreens(data);
        } catch (err) {
            setError('Failed to load screens');
            showSnackbar('Failed to load screens', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showSnackbar]);

    useEffect(() => {
        fetchScreens();
    }, [fetchScreens]);

    const createScreen = async (payload: CreateScreenPayload) => {
        setIsCreating(true);

        try {
            await screenService.create(payload);
            showSnackbar('Screen created successfully', 'success');
            await fetchScreens();
        } catch (err) {
            showSnackbar('Failed to create screen', 'error');
            throw err;
        } finally {
            setIsCreating(false);
        }
    };

    const updateScreen = async (id: number, payload: UpdateScreenPayload) => {
        setIsUpdating(true);

        try {
            await screenService.update(id, payload);
            showSnackbar('Screen updated successfully', 'success');
            await fetchScreens();
        } catch (err) {
            showSnackbar('Failed to update screen', 'error');
            throw err;
        } finally {
            setIsUpdating(false);
        }
    };

    const deleteScreen = async (id: number) => {
        setIsDeleting(true);

        try {
            await screenService.delete(id);
            showSnackbar('Screen deleted successfully', 'success');
            await fetchScreens();
        } catch (err) {
            showSnackbar('Failed to delete screen', 'error');
            throw err;
        } finally {
            setIsDeleting(false);
        }
    };

    const powerControl = async (id: number, action: 'on' | 'off') => {
        setIsControllingPower(true);

        try {
            await screenService.powerControl(id, action);
            showSnackbar('Power control executed', 'success');
            await fetchScreens();
        } catch (err) {
            showSnackbar('Failed to control power', 'error');
            throw err;
        } finally {
            setIsControllingPower(false);
        }
    };

    return {
        screens,
        isLoading,
        isError: Boolean(error),
        error,

        createScreen,
        isCreating,

        updateScreen,
        isUpdating,

        deleteScreen,
        isDeleting,

        powerControl,
        isControllingPower,

        refetchScreens: fetchScreens,
    };
};