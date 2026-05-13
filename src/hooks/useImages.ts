import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { imageService } from '../services/images';
import { useSnackbarStore } from '../store/snackbarStore';

export const useImages = () => {
    const { showSnackbar } = useSnackbarStore();
    const queryClient = useQueryClient();

    const imagesQuery = useQuery({
        queryKey: ['images'],
        queryFn: imageService.getAll,
    });

    const uploadMutation = useMutation({
        mutationFn: imageService.upload,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['images'] });
            showSnackbar('Image uploaded successfully', 'success');
        },
        onError: (error: any) => {
            showSnackbar(error.message || 'Upload failed', 'error');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: imageService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['images'] });
            showSnackbar('Image deleted', 'success');
        },
        onError: (error: any) => {
            showSnackbar(error.message || 'Delete failed', 'error');
        },
    });

    return {
        images: imagesQuery.data || [],
        isLoading: imagesQuery.isLoading,
        isError: imagesQuery.isError,
        error: imagesQuery.error,

        uploadImage: uploadMutation.mutate,
        isUploading: uploadMutation.isPending,

        deleteImage: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
};