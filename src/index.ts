import { AzureDevOpsTaskService } from "./services/azure/devops/AzureDevOpsTaskService";
import { TaskResult } from "azure-pipelines-task-lib";
import { Constants } from "./constants/constants";
import { FileService } from "./services/files/FileService";
import { HashService } from "./services/hashing/HashService";
import fs = require("fs-extra");
import { AzureStorageFileShareService } from "./services/azure/storage/AzureStorageFileShareService";
import { LinuxMountService } from "./services/mount/LinuxMountService";

async function main() {
    const taskLibraryClient = await (new AzureDevOpsTaskService).getAzureDevOpsTaskServiceInstance();
    try {

        const storageAccountName: string = taskLibraryClient.getInput(Constants.STORAGE_ACCOUNT_NAME_VARIABLE);
        const storageAccountKey: string = taskLibraryClient.getInput(Constants.STORAGE_ACCOUNT_KEY_VARIABLE);
        const storageAccountFileShareName: string = taskLibraryClient.getInput(Constants.STORAGE_ACCOUNT_FILE_SHARE_NAME_VARIABLE);
        const cacheMountPath: string = taskLibraryClient.getInput(Constants.CACHE_MOUNT_PATH_VARIABLE);
        const cacheKeyGlobPattern: string = taskLibraryClient.getInput(Constants.CACHE_KEY_GLOB_PATTERN_VARIABLE);

        // Create Required Services
        const hashService = new HashService();
        const azureStorageFileShareService = new AzureStorageFileShareService(storageAccountName, storageAccountKey, storageAccountFileShareName);
        const fileService: FileService = new FileService();



        // const filesMatchingCacheKeyGlobPattern = fileService.GetFilesMatchingGlob(cacheKeyGlobPattern.split(","));

        // Match all the files which match the Glob Pattern in the System Default Working Directory. Ensure that the items are sorted.
        const allFiles: string[] = taskLibraryClient.find(taskLibraryClient.getVariable(Constants.SYSTEM_DEFAULT_WORKING_DIRECTORY_VARIABLE));
        const filesMatchingCacheKeyGlobPatterns: string[] = (taskLibraryClient.match(allFiles, cacheKeyGlobPattern)).sort();

        // Generate hashes of each file.
        const hashes: string[] = [];
        for (let index = 0; index < filesMatchingCacheKeyGlobPatterns.length; index++) {
            const fileContent: Buffer = await fs.readFile(filesMatchingCacheKeyGlobPatterns[index]);
            const fileHash: string = await hashService.GenerateSha256Hash(fileContent.toString());

            hashes.push(fileHash);
        }

        // Generate hash of hashes.
        const cacheHashKey: string = await hashService.GenerateSha256Hash(hashes.join());

        // Check if Cache Directory exists or not. Depending on that, file share would be mounted read-only/read-write.
        const mountReadOnly: boolean = await azureStorageFileShareService.CheckIfDirectoryExists(cacheHashKey);

        // If mountReadOnly is false, that means a directory with the name of cache key doesn't exist. Create the directory.
        await azureStorageFileShareService.EnsureDirectoryExists(cacheHashKey);

        // Now, mount the file share at the path specified
        const linuxMountService: LinuxMountService = new LinuxMountService(
            `//${storageAccountName}.file.core.windows.net/${storageAccountFileShareName}/${cacheHashKey}`,
            storageAccountName,
            storageAccountKey,
            taskLibraryClient.getVariable(Constants.CACHE_MOUNT_PATH_VARIABLE)
        );
        if (mountReadOnly) {
            linuxMountService.mountReadOnly();
        } else {
            linuxMountService.mountReadWriteOnly();
        }

    } catch (error) {
        taskLibraryClient.setResult(TaskResult.Failed, error.message)
    }
}


main();