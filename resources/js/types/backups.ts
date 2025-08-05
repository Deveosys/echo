import { Destination } from './destinations';

export type Backup = {
    id: number;
    name: string;
    slug: string;
    source_path: string;
    frequency: string;
    destination: Destination;
    max_backup_instances: number;
    backup_instances: BackupInstance[];
};

export type CreateBackupFormData = {
    name: string;
    destination_id: number;
    source_path: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
};

export type SourceTreeItem = {
    name: string;
    dir: boolean;
    path: string;
    children: SourceTreeItem[];
    selected?: boolean;
};

export type SourceTree = SourceTreeItem[];

export type BackupInstance = {
    id: number;
    status: string;
    started_at: string;
    completed_at: string;
    failed_at: string;
    error: string;
    key_name: string;
};
