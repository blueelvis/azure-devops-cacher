
export interface IAzureStorageFileShareService {
    EnsureDirectoryExists(directoryName: string): Promise<boolean>;
}