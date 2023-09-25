import { RawUsernotes, RawUsernotesBlob } from '../types/RawUsernotes';
/**
 * The latest usernotes schema version that this library can handle. If a
 * usernotes page reports a schema version higher than this number, it can't be
 * processed with this version of the library.
 */
export declare const LATEST_KNOWN_USERNOTES_SCHEMA = 6;
/**
 * The earliest usernotes schema version that this library can handle. If a
 * usernotes page reports a schema version lower than this number, it can't be
 * processed with this version of the library.
 */
export declare const EARLIEST_KNOWN_USERNOTES_SCHEMA = 4;
/**
 * Attempts to shorten a link into the Toolbox permalink format for usernotes.
 * This format is described here:
 * {@link https://github.com/toolbox-team/reddit-moderator-toolbox/wiki/Subreddit-Wikis%3A-usernotes#link-string-formats}
 * @param permalink The link to shorten
 * @returns A shortened link string, or the original URL if the link
 * doesn't match any shortening format known to Toolbox.
 */
export declare function squashPermalink(permalink: string): string;
/**
 * Expands a shortened link string from Toolbox usernotes into a full permalink.
 * This format is described here:
 * {@link https://github.com/toolbox-team/reddit-moderator-toolbox/wiki/Subreddit-Wikis%3A-usernotes#link-string-formats}
 * @param shortenedLink The shortened link string to expand
 * @returns The expanded, full permalink
 */
export declare function expandPermalink(shortenedLink: string): string;
/**
 * Compresses a JSON value into a zlib-compressed, base64-encoded blob string.
 * This format is described here:
 * {@link https://github.com/toolbox-team/reddit-moderator-toolbox/wiki/Subreddit-Wikis:-usernotes#working-with-the-blob}
 * @param value The object or value to compress
 * @returns The generated blob.
 */
export declare function compressBlob<T>(value: T): RawUsernotesBlob<T>;
/**
 * Decompresses a {@linkcode RawUsernotesBlob} string into the JSON value it
 * encodes. This format is described here:
 * {@link https://github.com/toolbox-team/reddit-moderator-toolbox/wiki/Subreddit-Wikis:-usernotes#working-with-the-blob}
 * @param blob The blob to decompress
 * @returns The original JSON value.
 */
export declare function decompressBlob<T>(blob: RawUsernotesBlob<T>): T;
/**
 * Checks the schema version of raw usernotes data and attempts to update it to
 * the latest known schema version if it's out of date. Throws an error if the
 * data's current schema version is too old or new to handle.
 * @param data The usernotes data object read from the wiki, as an object (i.e.
 * you should parse the page contents as JSON to pass into this function)
 * @returns Data object updated to latest schema version
 */
export declare function migrateUsernotesToLatestSchema(data: any): RawUsernotes;
