import { useCallback, useEffect, useState } from 'react';
import { imageService } from '../services/images';
import { useSnackbarStore } from '../store/snackbarStore';
import type { Image } from '../types';

export const useImages = () => {
    const { showSnackbar } = useSnackbarStore();

    const [images, setImages] = useState<Image[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchImages = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await imageService.getAll();
            setImages(data);
        } catch (err) {
            setError('Failed to load images');
            showSnackbar('Failed to load images', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showSnackbar]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    const uploadImage = async (file: File) => {
        setIsUploading(true);

        try {
            await imageService.upload(file);
            showSnackbar('Image uploaded successfully', 'success');

            // ВАЖНО: обновляем общий state страницы
            await fetchImages();
        } catch (err) {
            showSnackbar('Upload failed', 'error');
            throw err;
        } finally {
            setIsUploading(false);
        }
    };

    const deleteImage = async (id: number) => {
        setIsDeleting(true);

        try {
            await imageService.delete(id);
            showSnackbar('Image deleted successfully', 'success');

            // ВАЖНО: обновляем общий state страницы
            await fetchImages();
        } catch (err) {
            showSnackbar('Delete failed', 'error');
            throw err;
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        images,
        isLoading,
        isError: Boolean(error),
        error,

        uploadImage,
        isUploading,

        deleteImage,
        isDeleting,

        refetchImages: fetchImages,
    };
};