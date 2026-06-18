export interface User {
    id: number;
    username: string;
    role: 'Operator' | 'Admin';
}

export interface UserDto {
    id: number;
    username: string;
    role: 'Admin' | 'Operator';
    createdAt: string;
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
    format: string;
    width: number;
    height: number;
    fileSize: number;
    thumbnailPath: string | null;
    createdAt: string;
}

export interface Collection {
    id: number;
    name: string;
    itemCount: number;
    createdAt: string;
}

export interface CollectionItem {
    id: number;
    imageId: number;
    imageName: string;
    thumbnailPath: string | null;
    order: number;
    displayDurationSeconds: number;
}

export interface CollectionDetails {
    id: number;
    name: string;
    itemCount: number;
    createdAt: string;
    items: CollectionItem[];
}

export interface Schedule {
    id: number;
    name: string;
    imageId: number | null;
    collectionId: number | null;
    screenId: number;
    startDate: string;
    endDate: string;
    isRecurring: boolean;
    recurrencePattern: string | null;
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