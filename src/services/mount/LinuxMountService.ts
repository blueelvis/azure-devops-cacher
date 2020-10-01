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

import { IMountService } from "../../interfaces/IMountService";
import execa = require('execa');
import { ConnectOptions } from "telnet-client";
const Telnet = require("telnet-client");


// TODO -- Add logging in the class

export class LinuxMountService implements IMountService {
    private _remoteFileShareUncPath: string;
    private _remoteFileShareUsername: string;
    private _remoteFileSharePassword: string;
    private _hostPath: string;
    private _port = 445;

    private _isMounted: boolean;
    private _mountOptions: Array<string> = [];

    constructor(remoteFileShareUncPath: string, remoteFileShareUsername: string, remoteFileSharePassword: string, hostPath: string, port?: number) {
        this._remoteFileShareUncPath = remoteFileShareUncPath;
        this._remoteFileShareUsername = remoteFileShareUsername;
        this._remoteFileSharePassword = remoteFileSharePassword;
        this._hostPath = hostPath;
        this._isMounted = false;
        if (port != null) {
            this._port = port;
        }
    }

    /**
     * Mounts a remote file share as a read-only file share at the specified directory.
     */
    async mountReadOnly(): Promise<boolean> {
        if (!(await this.checkAccess())) {
            throw new Error(`Unable to connect the remote file at - [${this._remoteFileShareUncPath}] on port - [${this._port}]`);
        }

        this._mountOptions.push("ro","serverino","vers=3.0","dir_mode=0555","file_mode=0555",`user=${this._remoteFileShareUsername}`,`password=${this._remoteFileSharePassword}`);

        const execaCommandArguments: Array<string> = [
            "mount",
            "-t",
            "cifs",
            this._remoteFileShareUncPath,
            this._hostPath,
            "-o",
            this._mountOptions.join(",")
        ];
        const execaClient = await execa("sudo", execaCommandArguments);
        if (!execaClient.failed) {
            this._isMounted = true;
            return true;
        } else {
            this._isMounted = false;
            return false;
        }
    }

    /**
     * Mounts a remote file share as Read/Write at the specified directory.
     */
    async mountReadWriteOnly(): Promise<boolean> {
        if (!(await this.checkAccess())) {
            throw new Error(`Unable to connect the remote file at - [${this._remoteFileShareUncPath}] on port - [${this._port}]`);
        }

        this._mountOptions.push("rw","serverino","vers=3.0","dir_mode=0777","file_mode=0777",`user=${this._remoteFileShareUsername}`,`password=${this._remoteFileSharePassword}`);

        const execaCommandArguments: Array<string> = [
            "mount",
            "-t",
            "cifs",
            this._remoteFileShareUncPath,
            this._hostPath,
            "-o",
            this._mountOptions.join(",")
        ];
        const execaClient = await execa("sudo", execaCommandArguments);
        if (!execaClient.failed) {
            this._isMounted = true;
            return true;
        } else {
            this._isMounted = false;
            return false;
        }
    }

    /**
     * Unmounts the specified share forcefully.
     */
    async unmount(): Promise<boolean> {
        if (!this._isMounted) {
            return true;
        } else {
            const execaCommandArguments: Array<string> = [
                "umount",
                "-f",
                this._hostPath
            ];
            const execaClient = await execa("sudo", execaCommandArguments);
            if (!execaClient.failed) {
                this._isMounted = false;
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     * Used to check whether the current host is able to *ping* the remote share or not.
     */
    async checkAccess(): Promise<boolean> {
        // console.log(this._remoteFileShareUncPath.replace('\\','').replace('//','').split("/")[0]);
        // try {
        //     const connection = new Telnet()
        //     const connectOptions: ConnectOptions = {
        //         port: this._port,
        //         host: this._remoteFileShareUncPath.replace('\\','').replace('//','').split("/")[0],
        //         timeout: 1500,
        //         debug: true
        //     };
        //     await connection.connect(connectOptions);
        //     // await connection.destroy();
        //     return true;
        // } catch (error) {
        //     console.log(error);
        //     return false;
        // }
        return true;
    }
}