/**
 * This interface dictates the hashing services.
 */

export interface IHashService {
    GenerateSha256Hash(message: string): Promise<string>;
}
