/**
 * This service is used to deal with the actual Cache files i.e. the TAR files.
 */

import { ICacheService } from "../../interfaces/ICacheService";
import execa = require('execa');
import * as dayjs from 'dayjs'

// TODO - Replace Console logging with the Azure Devops Task Library.

export class CacheService implements ICacheService {

    constructor() {
    }

    public async TarCacheFolder(cacheFolderToArchive: string, cacheHashKey: string): Promise<boolean> {

        // TODO - Add logging to display the exact time which was taken to TAR the folder.
        console.log(`Starting archiving in TAR at - [${dayjs().format()}]`);
        // Tar Archive Command - "tar -czvf name-of-archive.tar.gz /path/to/directory-or-file"

        const archiveCreationCommand = await execa(
            "tar",
            ["-cf", `${cacheHashKey}.tar`, cacheFolderToArchive]
        );
        if (!archiveCreationCommand.failed) {
            console.log(`Finished archiving in TAR at - [${dayjs().format()}]`);
            return true;
        } else {
            console.log(archiveCreationCommand.stderr);
            return false;
        }
    }

    // Untar command - "tar -xvzf name-of-archive.tar.gz"
    public async UnTarCacheFolder(tarToExtractPath: string): Promise<boolean> {
        // TODO - Add logging to display the exact time which was taken to TAR the folder.
        console.log(`Starting untar - [${dayjs().format()}]`);
        // Tar Archive Command - "tar -czvf name-of-archive.tar.gz /path/to/directory-or-file"

        const archiveExtractionCommand = await execa(
            "tar",
            ["-zf", tarToExtractPath]
        );
        if (!archiveExtractionCommand.failed) {
            console.log(`Finished untarring TAR at - [${dayjs().format()}]`);
            return true;
        } else {
            console.log(archiveExtractionCommand.stderr);
            return false;
        }
    }
}