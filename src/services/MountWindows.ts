/*
This service represents the mounting of remote file shares in Windows.
*/

import { IMount } from "../interfaces/IMount" ;

export class MountLinux implements IMount {
    constructor() {

    }
    mountReadOnly(): boolean {
        throw new Error("Method not implemented.");
    }
    mountReadWriteOnly(): boolean {
        throw new Error("Method not implemented.");
    }
    unmount(): boolean {
        throw new Error("Method not implemented.");
    }
    checkAccess(): boolean {
        throw new Error("Method not implemented.");
    }
}