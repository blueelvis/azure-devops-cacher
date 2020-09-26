/*
This interface dictates the mounting of the file shares.
*/

export interface IMountService {
    mountReadOnly(): Promise<boolean>;
    mountReadWriteOnly(): Promise<boolean>;
    unmount(): Promise<boolean>;
    checkAccess(): Promise<boolean>;
};
