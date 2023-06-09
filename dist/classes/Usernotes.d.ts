import { RawUsernotes } from '../types/RawUsernotes';
import { Usernote } from '../types/Usernote';
/**
 * A class that interfaces with the raw contents of a subreddit's `usernotes`
 * wiki page, automatically upgrading old storage schemas to the current version
 * and providing methods to manipulate and reserialize the notes back for
 * writing back to the wiki.
 */
export declare class Usernotes {
    /** A mapping of usernames to notes on the given user. */
    private users;
    constructor(jsonString: string);
    /**
     * Adds a new usernote to the collection.
     * @param note Details about the usernote to create
     */
    add(note: Usernote): void;
    /**
     * Returns all usernotes for a given user.
     * @param username The user to fetch the notes of
     * @returns The list of usernotes
     */
    get(username: string): Usernote[];
    /**
     * Serializes the usernotes data for writing back to the wiki. **This method
     * returns an object; you probably want {@linkcode toString} instead.**
     * @returns Object which can be serialized to JSON and written as the
     * contents of the `usernotes` wiki page
     */
    toJSON(): RawUsernotes;
    /**
     * Stringifies the usernotes data for writing back to the wiki.
     * @param indent Passed as the third argument of `JSON.stringify`. Useful
     * for debugging; however, because wiki space is limited, never provide this
     * parameter when actually saving notes to the wiki.
     * @returns JSON string which can be saved as the contents of the
     * `usernotes` wiki page
     */
    toString(indent?: string | number): string;
}
