import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionService } from '../services/collections';
import { useSnackbarStore } from '../store/snackbarStore';

export const useCollections = () => {
    const { showSnackbar } = useSnackbarStore();
    const queryClient = useQueryClient();

    const collectionsQuery = useQuery({
        queryKey: ['collections'],
        queryFn: collectionService.getAll,
    });

    const createMutation = useMutation({
        mutationFn: collectionService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            showSnackbar('Collection created successfully', 'success');
        },
        onError: (error: any) => {
            showSnackbar(error.message || 'Failed to create collection', 'error');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            collectionService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            showSnackbar('Collection updated successfully', 'success');
        },
        onError: (error: any) => {
            showSnackbar(error.message || 'Failed to update collection', 'error');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: collectionService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            showSnackbar('Collection deleted', 'success');
        },
        onError: (error: any) => {
            showSnackbar(error.message || 'Failed to delete collection', 'error');
        },
    });

    return {
        collections: collectionsQuery.data || [],
        isLoading: collectionsQuery.isLoading,
        isError: collectionsQuery.isError,
        error: collectionsQuery.error,

        createCollection: createMutation.mutate,
        isCreating: createMutation.isPending,

        updateCollection: updateMutation.mutate,
        isUpdating: updateMutation.isPending,

        deleteCollection: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
};