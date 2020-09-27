/**
 * This service represents the hashing service which would be used to generate a hash of the mentioned files using glob patterns. More information about the glob patterns can be found over [here](https://en.wikipedia.org/wiki/Glob_(programming))
 */

import { IHashService } from "../../interfaces/IHashService";
import { SHA256 } from "crypto-js";

// TODO -- Implement Glob Patterns based hashing

export class HashService implements IHashService {
    constructor() {}


    /**
     * The function returns a SHA256 encoded string of the message which was passed.
     * @param message The message which needs to be encoded.
     */
    async GenerateSha256Hash(message: string): Promise<string> {
        return SHA256(message).toString();
    }
}