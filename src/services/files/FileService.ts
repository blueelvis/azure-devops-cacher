/**
 * The service which is used to interact with files.
 */

import { IFileService } from "../../interfaces/IFileService";
import fs = require("fs-extra");
import globby = require("globby");

export class FileService implements IFileService {

    private globbyOptions: globby.GlobbyOptions = {};

    constructor() {

        // Some Glob Options are taken from here - https://github.com/Microsoft/azure-pipelines-task-lib/blob/master/node/docs/findingfiles.md#matchoptions
        this.globbyOptions = {
            braceExpansion: true,
            globstar: true,
            dot: true,
            extglob: true,
            caseSensitiveMatch: process.platform == 'win32',
            baseNameMatch: false,
            absolute: true,
            onlyFiles: true
        };
    }


    /**
     * Returns the content of the file specified at the path.
     * @param path The path of the file to read.
     */
    async GetFileContent(path: string): Promise<string> {
        if (!(await fs.pathExists(path))) {
            throw `Unable to find path - [${path}]`;
        }
        return (await fs.readFile(path)).toString();
    }

    /**
     * Returns all the files which match the glob pattern as a sorted array.
     * @param globPatterns Accepts an array of strings where each line represents a glob pattern.
     */
    async GetFilesMatchingGlob(globPatterns: Array<string>): Promise<Array<string>> {
        const filePaths:string[] = await globby(globPatterns, this.globbyOptions);

        return filePaths.sort();
    }
}
