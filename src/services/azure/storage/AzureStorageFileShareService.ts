import { StorageSharedKeyCredential, ShareServiceClient, ShareDirectoryClient, ShareClient, DirectoryCreateIfNotExistsResponse } from "@azure/storage-file-share";
export class AzureStorageFileShareService {

    private storageShareClient: ShareClient;

    constructor(storageAccountName: string, storageAccountKey: string, fileShareName: string) {
        const credentials = new StorageSharedKeyCredential(storageAccountName, storageAccountKey);

        this.storageShareClient = (new ShareServiceClient(`https://${storageAccountName}.file.core.windows.net`, credentials)).getShareClient(fileShareName);
    }

    public async EnsureDirectoryExists(directoryName: string): Promise<boolean> {
        const directoryClient = this.storageShareClient.getDirectoryClient(directoryName);
        try {
            await directoryClient.createIfNotExists();
            return true;
        } catch (error) {
            return false;
        }
    }

    public async CheckIfDirectoryExists(directoryName: string): Promise<boolean> {
        const directoryClient = this.storageShareClient.getDirectoryClient(directoryName);
        return directoryClient.exists();
    }

    /**
     * CheckIfFileExists
     */
    public async CheckIfFileExists(directoryName: string, fileName: string): Promise<boolean> {
        const directoryClient = this.storageShareClient.getDirectoryClient(directoryName);
        const fileClient = directoryClient.getFileClient(fileName);
        
        return fileClient.exists();
    }
}