import taskLibrary = require('azure-pipelines-task-lib');

export interface IAzureDevOpsService {
    getAzureDevOpsTaskServiceInstance(): Promise<typeof taskLibrary>
}