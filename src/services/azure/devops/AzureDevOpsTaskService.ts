import taskLibrary = require('azure-pipelines-task-lib');
import { IAzureDevOpsService } from '../../../interfaces/IAzureDevOpsService';


export class AzureDevOpsTaskService implements IAzureDevOpsService {

    private azureDevopsTaskServiceInstance: typeof taskLibrary;

    constructor() {
        this.azureDevopsTaskServiceInstance = taskLibrary;
    }

    public async getAzureDevOpsTaskServiceInstance(): Promise<typeof taskLibrary> {
        if (this.azureDevopsTaskServiceInstance == null) {
            this.azureDevopsTaskServiceInstance = taskLibrary;
        }
        return this.azureDevopsTaskServiceInstance;
    }
}