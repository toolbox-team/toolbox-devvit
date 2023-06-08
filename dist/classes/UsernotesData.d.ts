import { RawUsernotes, RawUsernotesConstants, RawUsernotesUsers } from '../types/rawUsernotes';
export interface PrettyUsernote {
    timestamp?: Date;
    text?: string;
    link?: string;
}
/**
 * A class that interfaces with the raw contents of a subreddit's `usernotes`
 * wiki page, automatically upgrading old storage schemas to the current
 * version, providing methods to retrieve, update, add, and delete notes, and
 * methods to repack notes back into the raw form for writing back to the wiki
 * after modification.
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
    /**
     * Packs the usernotes data for writing back to the wiki. **This method
     * returns an object; you probably want {@linkcode toString} instead.**
     * @returns Object which can be serialized to JSON and written as the
     * contents of the `usernotes` wiki page
     */
    toJSON(): RawUsernotes;
    /**
     * Packs the usernotes data for writing back to the wiki.
     * @param indent Passed as the third argument of `JSON.stringify`. Useful
     * for debugging; however, because wiki space is limited, never provide this
     * parameter when actually saving notes to the wiki.
     * @returns JSON string which can be saved as the contents of the
     * `usernotes` wiki page
     */
    toString(indent?: string | number): string;
}
