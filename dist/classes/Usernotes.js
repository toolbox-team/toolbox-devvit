"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usernotes = void 0;
const usernotes_1 = require("../helpers/usernotes");
// TODO: nothing here handles username case correctly; go back and check the
//       toolbox implementation of that for correctness later and write test
//       cases for it
/**
 * A class that interfaces with the raw contents of a subreddit's `usernotes`
 * wiki page, automatically upgrading old storage schemas to the current version
 * and providing methods to manipulate and reserialize the notes back for
 * writing back to the wiki.
 */
class Usernotes {
    constructor(jsonString) {
        var _a;
        /** A mapping of usernames to notes on the given user. */
        this.users = new Map();
        let data = (0, usernotes_1.migrateUsernotesToLatestSchema)(JSON.parse(jsonString));
        const rawUsers = (0, usernotes_1.decompressBlob)(data.blob);
        for (const [username, { ns }] of Object.entries(rawUsers)) {
            for (const rawNote of ns) {
                let userNotes = this.users.get(username);
                if (userNotes == null) {
                    userNotes = [];
                    this.users.set(username, userNotes);
                }
                userNotes.push({
                    username,
                    timestamp: new Date(rawNote.t * 1000),
                    text: rawNote.n,
                    moderatorUsername: data.constants.users[rawNote.m],
                    contextPermalink: rawNote.l == null ? undefined : (0, usernotes_1.expandPermalink)(rawNote.l),
                    noteType: rawNote.w == null ? undefined : (_a = data.constants.warnings[rawNote.w]) !== null && _a !== void 0 ? _a : undefined,
                });
            }
        }
    }
    /**
     * Adds a new usernote to the collection.
     * @param note Details about the usernote to create
     */
    add(note) {
        let userNotes = this.users.get(note.username);
        if (userNotes == null) {
            userNotes = [];
            this.users.set(note.username, userNotes);
        }
        if (note.timestamp == null) {
            note.timestamp = new Date();
        }
        userNotes.unshift(note);
    }
    /**
     * Returns all usernotes for a given user.
     * @param username The user to fetch the notes of
     * @returns The list of usernotes
     */
    get(username) {
        const userNotes = this.users.get(username);
        if (userNotes == null) {
            return [];
        }
        return [...userNotes];
    }
    /**
     * Serializes the usernotes data for writing back to the wiki. **This method
     * returns an object; you probably want {@linkcode toString} instead.**
     * @returns Object which can be serialized to JSON and written as the
     * contents of the `usernotes` wiki page
     */
    toJSON() {
        const constants = {
            users: [],
            warnings: [],
        };
        // Reduce the array of notes into a raw users object, building the
        // constants arrays as we go
        const usersObject = {};
        for (const [username, notes] of this.users.entries()) {
            // If we have no notes for this user, skip them
            if (!notes.length) {
                continue;
            }
            // Add space for this user in the users object
            usersObject[username] = { ns: [] };
            for (const note of notes) {
                // Add moderator username to constants.users if they're not there
                // TODO: what's the correct handling of this for lowercase names again
                let modIndex = constants.users.indexOf(note.moderatorUsername);
                if (modIndex === -1) {
                    modIndex = constants.users.length;
                    constants.users.push(note.moderatorUsername);
                }
                // Add note type key to constants.warnings if it's not there
                let typeKeyIndex;
                if (note.noteType != null) {
                    typeKeyIndex = constants.warnings.indexOf(note.noteType);
                    if (typeKeyIndex === -1) {
                        typeKeyIndex = constants.warnings.length;
                        constants.warnings.push(note.noteType);
                    }
                }
                // Serialize this note and add it to the notes array
                usersObject[note.username].ns.push({
                    t: Math.round((+note.timestamp) / 1000),
                    n: note.text,
                    m: modIndex,
                    w: typeKeyIndex,
                    l: note.contextPermalink == null ? undefined : (0, usernotes_1.squashPermalink)(note.contextPermalink),
                });
            }
        }
        // Compress the users object and combine with other stuff
        return {
            ver: usernotes_1.LATEST_KNOWN_USERNOTES_SCHEMA,
            constants,
            blob: (0, usernotes_1.compressBlob)(usersObject),
        };
    }
    /**
     * Stringifies the usernotes data for writing back to the wiki.
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
exports.Usernotes = Usernotes;
