/*
This service represents the mounting of remote file shares in Windows.
*/

import { IMountService } from "../../interfaces/IMountService";

export class WindowsMountService implements IMountService {

    private _remoteFileShareUncPath: string;
    private _remoteFileShareUsername: string;
    private _remoteFileSharePassword: string;
    private _hostPath: string;
    private _port: number = 445;

    private _isMounted: boolean;
    private _mountOptions: Array<string> = [];

    constructor() {

    }
    async mountReadOnly(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async mountReadWriteOnly(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async unmount(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async checkAccess(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}