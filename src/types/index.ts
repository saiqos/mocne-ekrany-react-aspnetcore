export interface User {
    id: string;
    username: string;
    role: 'Operator' | 'Admin';
}

export interface Screen {
    id: string;
    name: string;
    uniqueIdentifier: string;
    groupId?: string;
    location?: string;
    status: 'Online' | 'Offline';
    lastSeen: string;
    createdAt: string;
}

export interface Image {
    id: string;
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
    id: string;
    name: string;
    createdAt: string;
    uploadedBy: string;
    items: CollectionItem[];
}

export interface CollectionItem {
    id: string;
    collectionId: string;
    imageId: string;
    order: number;
    displayDuration: number;
}

export interface Schedule {
    id: string;
    name: string;
    imageId?: string;
    collectionId?: string;
    screenId: string;
    startDate: string;
    endDate: string;
    isRecurring: boolean;
    priority: number;
}

export interface AuditLog {
    id: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    timestamp: string;
    description: string;
}