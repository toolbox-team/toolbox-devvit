"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsernotesData = void 0;
const usernotes_1 = require("../helpers/usernotes");
/**
 * A class that interfaces with the raw contents of a subreddit's `usernotes`
 * wiki page, automatically upgrading old storage schemas to the current
 * version, providing methods to retrieve, update, add, and delete notes, and
 * methods to repack notes back into the raw form for writing back to the wiki
 * after modification.
 */
class UsernotesData {
    constructor(jsonString) {
        let data = JSON.parse(jsonString);
        data = (0, usernotes_1.migrateUsernotesToLatestSchema)(data);
        this.users = (0, usernotes_1.decompressBlob)(data.blob);
        this.constants = data.constants;
    }
    /**
     * Adds a new usernote to a user.
     * @param username The user to add the note to
     * @param text The note's text
     * @param link The permalink for the note, if any
     */
    addUsernote(username, text, link) {
        if (!this.users[username]) {
            this.users[username] = { ns: [] };
        }
        const newNote = {
            n: text,
            t: Math.round(Date.now() / 1000),
        };
        if (link) {
            newNote.l = (0, usernotes_1.squashPermalink)(link);
        }
        this.users[username].ns.unshift(newNote);
    }
    /**
     * Returns all usernotes for a given user.
     * @param username The user to fetch the notes of
     * @returns The list of usernotes
     */
    notesForUser(username) {
        var _a;
        return (_a = this.users[username]) === null || _a === void 0 ? void 0 : _a.ns.map(note => ({
            text: note.n,
            timestamp: note.t == null ? undefined : new Date(note.t * 1000),
            link: note.l && (0, usernotes_1.expandPermalink)(note.l),
        }));
    }
    /**
     * Packs the usernotes data for writing back to the wiki. **This method
     * returns an object; you probably want {@linkcode toString} instead.**
     * @returns Object which can be serialized to JSON and written as the
     * contents of the `usernotes` wiki page
     */
    toJSON() {
        return {
            ver: usernotes_1.LATEST_KNOWN_USERNOTES_SCHEMA,
            constants: this.constants,
            blob: (0, usernotes_1.compressBlob)(this.users),
        };
    }
    /**
     * Packs the usernotes data for writing back to the wiki.
     * @param indent Passed as the third argument of `JSON.stringify`. Useful
     * for debugging; however, because wiki space is limited, never provide this
     * parameter when actually saving notes to the wiki.
     * @returns JSON string which can be saved as the contents of the
     * `usernotes` wiki page
     */
    toString(indent) {
        return JSON.stringify(this, null, indent);
    }
}
exports.UsernotesData = UsernotesData;
