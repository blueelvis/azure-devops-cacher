/**
 * This service represents the implementation of mounting using the `mount` command in Linux.
 * Right now, since we are going to use only Azure File Shares, it is required that we are running on a supported Operating System. To find the list of supported operating systems, visit this [link](https://docs.microsoft.com/en-us/azure/storage/files/storage-how-to-use-files-linux)
 *
 * An example script on how we can use a simple mount command with the CIFS package installed is -
 * ```
 * sudo mount -t cifs //teststorageaccount.file.core.windows.net/testing /mnt/testing -o vers=3.0,credentials=/etc/smbcredentials/teststorageaccount.cred,dir_mode=0777,file_mode=0777,serverino
 * ```
 *
 * The documentation of how CIFS mounts work can be found over [here](https://linux.die.net/man/8/mount.cifs)
 */

import { IMount } from "../interfaces/IMount";
import "execa";
import telnet_client, { ConnectOptions } from "telnet-client";


export class MountLinux implements IMount {
    private _remoteFileShareUncPath: string;
    private _remoteFileShareUsername: string;
    private _remoteFileSharePassword: string;
    private _hostPath: string;
    private _port: number = 445;

    private _isMounted: boolean;
    private _mountOptions: Array<string> = [];

    constructor(remoteFileShareUncPath: string, remoteFileShareUsername: string, remoteFileSharePassword: string, hostPath: string, port?: number) {
        this._remoteFileShareUncPath = remoteFileShareUncPath;
        this._remoteFileShareUsername = remoteFileShareUsername;
        this._remoteFileSharePassword = remoteFileSharePassword;
        this._hostPath = hostPath;
        this._isMounted = false;
        this._port = port;
    }

    /**
     * Mounts a remote file share as a read-only file share at the specified directory.
     */
    async mountReadOnly(): Promise<boolean> {
        if (!this.checkAccess()) {
            throw new Error(`Unable to connect the remote file at - [${this._remoteFileShareUncPath}] on port - [${this._port}]`);
        }

        this._mountOptions.push("ro","serverino","vers=3.0");

        throw new Error("Method not implemented.");
    }

    /**
     * Mounts a remote file share as Read/Write at the specified directory.
     */
    async mountReadWriteOnly(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    /**
     * Unmounts the specified share
     */
    async unmount(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    /**
     * Used to check whether the current host is able to *ping* the remote share or not.
     */
    async checkAccess(): Promise<boolean> {
        try {
            const connection:telnet_client = new telnet_client();
            const connectOptions: ConnectOptions = {
                port: this._port,
                host: this._hostPath,
                timeout: 1500
            };
            await connection.connect(connectOptions);
            await connection.destroy();
            return true;
        } catch (error) {
            return false;
        }
    }
}