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
/** Raw data for a single usernote */
export interface RawUsernote {
    /** Timestamp (seconds since epoch) */
    t?: number;
    /** Note text */
    n?: string;
    /** Index in constants.users of moderator who left this note */
    m?: number;
    /** Index in constants.warnings of this note's type's key */
    w?: number;
    /** Permalink of note context, in shortened format */
    l?: string;
}
/** Raw data for the object of all usernotes */
export interface RawUsernotesUsers {
    /** The username of a user */
    [name: string]: {
        /** A list of allnotes left on that user */
        ns: RawUsernote[];
    };
}
/** Constant data referenced by usernotes */
export interface RawUsernotesConstants {
    /** A list of all mods who have added notes */
    users: (string | null)[];
    /** A list of all the keys of note types that have been used */
    warnings: (string | null)[];
}
/** Raw data stored as JSON on the `usernotes` wiki page */
export interface RawUsernotesData {
    /** The schema version this page is compatible with */
    ver: number;
    /** Constant data referenced by usernotes */
    constants: RawUsernotesConstants;
    /** A blob that, when inflated, yields a {@link RawUsers} object */
    blob: string;
}
export interface PrettyUsernote {
    timestamp?: Date;
    text?: string;
    link?: string;
}
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
 * Compresses a JSON value into a zlib-compressed, base64 blob string. This
 * format is described here:
 * {@link https://github.com/toolbox-team/reddit-moderator-toolbox/wiki/Subreddit-Wikis:-usernotes#working-with-the-blob}
 * @param value The object or value to compress
 * @returns The generated blob.
 */
export declare function compressBlob(value: any): string;
/**
 * Decompresses a blob string into the JSON value used to create it. This format
 * is described here:
 * {@link https://github.com/toolbox-team/reddit-moderator-toolbox/wiki/Subreddit-Wikis:-usernotes#working-with-the-blob}
 * @param blob The blob to decompress
 * @returns The original JSON value.
 */
export declare function decompressBlob(blob: string): any;
/**
 * Checks the schema version of raw usernotes data and attempts to update it to
 * the latest known schema version if it's out of date. Throws an error if the
 * data's current schema version is too old or new to handle.
 * @param data The usernotes data read
 * @returns Data object updated to latest schema version
 */
export declare function migrateUsernotesToLatestSchema(data: any): RawUsernotesData;
/**
 * A class for interfacing with a subreddit's usernotes. Includes methods that
 * handle blob compression, note permalink squashing, etc.
 */
export declare class UsernotesData {
    constants: RawUsernotesConstants;
    users: RawUsernotesUsers;
    constructor(jsonString: string);
    /**
     * Adds a new usernote to a user.
     * @param username The user to add the note to
     * @param text The note's text
     * @param link The permalink for the note, if any
     */
    addUsernote(username: string, text: string, link?: string): void;
    /**
     * Returns all usernotes for a given user.
     * @param username The user to fetch the notes of
     * @returns The list of usernotes
     */
    notesForUser(username: string): PrettyUsernote[] | null;
    toJSON(): {
        ver: number;
        constants: RawUsernotesConstants;
        blob: string;
    };
}
