export interface User {
    id: number;
    username: string;
    role: 'Operator' | 'Admin';
}

export interface Screen {
    id: number;
    name: string;
    uniqueIdentifier: string;
    groupId: number | null;
    location: string;
    status: 'Online' | 'Offline';
    lastSeen: string | null;
    createdAt: string;
}

export interface Image {
    id: number;
    name: string;
    filePath: string;
    thumbnailPath: string;
    format: string;
    width: number;
    height: number;
    fileSize: number;
    createdAt: string;
    uploadedBy: string;
}

export interface Collection {
    id: number;
    name: string;
    createdAt: string;
    uploadedBy: string;
    items: CollectionItem[];
}

export interface CollectionItem {
    id: number;
    collectionId: number;
    imageId: number;
    order: number;
    displayDuration: number;
}

export interface Schedule {
    id: number;
    name: string;
    imageId?: string;
    collectionId?: string;
    screenId: number;
    startDate: string;
    endDate: string;
    isRecurring: boolean;
    priority: number;
}

export interface AuditLog {
    id: number;
    userId: number;
    action: string;
    entityType: string;
    entityId: number;
    timestamp: string;
    description: string;
}