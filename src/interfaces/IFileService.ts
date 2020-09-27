/**
 * The interface which is used for processing files.
 */
export interface IFileService {
    GetFileContent(path: string): Promise<string>;
    GetFilesMatchingGlob(globPattern: Array<string>): Promise<Array<string>>;
}
