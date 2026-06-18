import { useCallback, useEffect, useState } from 'react';
import { collectionService } from '../services/collections';
import { useSnackbarStore } from '../store/snackbarStore';
import type { Collection, CollectionDetails } from '../types';
import type {
    CreateCollectionPayload,
    UpdateCollectionPayload,
    CreateCollectionItemPayload,
    UpdateCollectionItemPayload,
} from '../services/collections';

export const useCollections = () => {
    const { showSnackbar } = useSnackbarStore();

    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [isAddingItem, setIsAddingItem] = useState(false);
    const [isUpdatingItem, setIsUpdatingItem] = useState(false);
    const [isDeletingItem, setIsDeletingItem] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const fetchCollections = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await collectionService.getAll();
            setCollections(data);
        } catch {
            setError('Failed to load collections');
            showSnackbar('Failed to load collections', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showSnackbar]);

    useEffect(() => {
        fetchCollections();
    }, [fetchCollections]);

    const getCollectionById = async (
        id: number,
    ): Promise<CollectionDetails> => {
        return collectionService.getById(id);
    };

    const createCollection = async (payload: CreateCollectionPayload) => {
        setIsCreating(true);

        try {
            await collectionService.create(payload);
            showSnackbar('Collection created successfully', 'success');
            await fetchCollections();
        } catch (err) {
            showSnackbar('Failed to create collection', 'error');
            throw err;
        } finally {
            setIsCreating(false);
        }
    };

    const updateCollection = async (
        id: number,
        payload: UpdateCollectionPayload,
    ) => {
        setIsUpdating(true);

        try {
            await collectionService.update(id, payload);
            showSnackbar('Collection updated successfully', 'success');
            await fetchCollections();
        } catch (err) {
            showSnackbar('Failed to update collection', 'error');
            throw err;
        } finally {
            setIsUpdating(false);
        }
    };

    const deleteCollection = async (id: number) => {
        setIsDeleting(true);

        try {
            await collectionService.delete(id);
            showSnackbar('Collection deleted successfully', 'success');
            await fetchCollections();
        } catch (err) {
            showSnackbar('Failed to delete collection', 'error');
            throw err;
        } finally {
            setIsDeleting(false);
        }
    };

    const addCollectionItem = async (
        collectionId: number,
        payload: CreateCollectionItemPayload,
    ) => {
        setIsAddingItem(true);

        try {
            await collectionService.addItem(collectionId, payload);
            showSnackbar('Image added to collection', 'success');
            await fetchCollections();
        } catch (err) {
            showSnackbar('Failed to add image to collection', 'error');
            throw err;
        } finally {
            setIsAddingItem(false);
        }
    };

    const updateCollectionItem = async (
        collectionId: number,
        itemId: number,
        payload: UpdateCollectionItemPayload,
    ) => {
        setIsUpdatingItem(true);

        try {
            await collectionService.updateItem(collectionId, itemId, payload);
            showSnackbar('Collection item updated', 'success');
            await fetchCollections();
        } catch (err) {
            showSnackbar('Failed to update collection item', 'error');
            throw err;
        } finally {
            setIsUpdatingItem(false);
        }
    };

    const deleteCollectionItem = async (collectionId: number, itemId: number) => {
        setIsDeletingItem(true);

        try {
            await collectionService.deleteItem(collectionId, itemId);
            showSnackbar('Image removed from collection', 'success');
            await fetchCollections();
        } catch (err) {
            showSnackbar('Failed to remove image from collection', 'error');
            throw err;
        } finally {
            setIsDeletingItem(false);
        }
    };

    return {
        collections,
        isLoading,
        isError: Boolean(error),
        error,

        createCollection,
        isCreating,

        updateCollection,
        isUpdating,

        deleteCollection,
        isDeleting,

        getCollectionById,

        addCollectionItem,
        isAddingItem,

        updateCollectionItem,
        isUpdatingItem,

        deleteCollectionItem,
        isDeletingItem,

        refetchCollections: fetchCollections,
    };
};