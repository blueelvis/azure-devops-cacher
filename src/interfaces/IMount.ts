/*
This interface dictates the mounting of the file shares.
*/

export interface IMount {
    mountReadOnly(): Promise<boolean>;
    mountReadWriteOnly(): Promise<boolean>;
    unmount(): Promise<boolean>;
    checkAccess(): Promise<boolean>;
};
