"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pako_1 = __importDefault(require("pako"));
/**
 * The latest usernotes schema version that this library can handle. If a
 * usernotes page reports a schema version higher than this number, it can't be
 * processed with this version of the library.
 */
exports.LATEST_KNOWN_USERNOTES_SCHEMA = 6;
/**
 * The earliest usernotes schema version that this library can handle. If a
 * usernotes page reports a schema version lower than this number, it can't be
 * processed with this version of the library.
 */
exports.EARLIEST_KNOWN_USERNOTES_SCHEMA = 4;
/**
 * Attempts to shorten a link into the Toolbox permalink format for usernotes.
 * This format is described here:
 * {@link https://github.com/toolbox-team/reddit-moderator-toolbox/wiki/Subreddit-Wikis%3A-usernotes#link-string-formats}
 * @param permalink The link to shorten
 * @returns A shortened link string, or the original URL if the link
 * doesn't match any shortening format known to Toolbox.
 */
function squashPermalink(permalink) {
    let match;
    if ((match = permalink.match(/(?:\/comments|^https?:\/\/redd\.it)\/([a-z0-9]+)(?:\/[^/]*(?:\/([a-z0-9]+)?)?)?/))) {
        // Submission pages
        let squashed = `l,${match[1]}`;
        if (match[2]) {
            // Add context for specific comments
            squashed += `,${match[2]}`;
        }
        return squashed;
    }
    else if ((match = permalink.match(/\/messages\/(\w+)/))) {
        // Old modmail pages
        return `m,${match[1]}`;
    }
    else if (permalink.startsWith('https://mod.reddit.com')) {
        // New modmail pages
        return permalink;
    }
    // If nothing else, return the original permalink
    return permalink;
}
exports.squashPermalink = squashPermalink;
/**
 * Expands a shortened link string from Toolbox usernotes into a full permalink.
 * This format is described here:
 * {@link https://github.com/toolbox-team/reddit-moderator-toolbox/wiki/Subreddit-Wikis%3A-usernotes#link-string-formats}
 * @param shortenedLink The shortened link string to expand
 * @returns The expanded, full permalink
 */
function expandPermalink(shortenedLink) {
    if (shortenedLink.startsWith('l,')) {
        // Expand to a submission or comment permalink
        return `https://www.reddit.com/comments/${shortenedLink.substr(2).split(',').join('/_/')}`;
    }
    else if (shortenedLink.startsWith('m,')) {
        // Expand to a message permalink
        return `https://www.reddit.com/message/messages/${shortenedLink.substr(2)}`;
    }
    return shortenedLink;
}
exports.expandPermalink = expandPermalink;
/**
 * Compresses a JSON value into a zlib-compressed, base64 blob string. This
 * format is described here:
 * {@link https://github.com/toolbox-team/reddit-moderator-toolbox/wiki/Subreddit-Wikis:-usernotes#working-with-the-blob}
 * @param value The object or value to compress
 * @returns The generated blob.
 */
function compressBlob(value) {
    return Buffer.from(pako_1.default.deflate(JSON.stringify(value))).toString('base64');
}
exports.compressBlob = compressBlob;
/**
 * Decompresses a blob string into the JSON value used to create it. This format
 * is described here:
 * {@link https://github.com/toolbox-team/reddit-moderator-toolbox/wiki/Subreddit-Wikis:-usernotes#working-with-the-blob}
 * @param blob The blob to decompress
 * @returns The original JSON value.
 */
function decompressBlob(blob) {
    return JSON.parse(pako_1.default.inflate(Buffer.from(blob, 'base64').toString('binary'), { to: 'string' }));
}
exports.decompressBlob = decompressBlob;
/**
 * Checks the schema version of raw usernotes data and attempts to update it to
 * the latest known schema version if it's out of date. Throws an error if the
 * data's current schema version is too old or new to handle.
 * @param data The usernotes data read
 * @returns Data object updated to latest schema version
 */
function migrateUsernotesToLatestSchema(data) {
    if (data.ver < exports.EARLIEST_KNOWN_USERNOTES_SCHEMA) {
        throw new TypeError(`Unknown schema version ${data.ver} (earliest known version is ${exports.EARLIEST_KNOWN_USERNOTES_SCHEMA})`);
    }
    if (data.ver > exports.LATEST_KNOWN_USERNOTES_SCHEMA) {
        throw new TypeError(`Unknown schema version ${data.ver} (latest known version is ${exports.LATEST_KNOWN_USERNOTES_SCHEMA})`);
    }
    // eslint-disable-next-line default-case
    switch (data.ver) {
        case 4: // Migrate from 4 to 5
            // Timestamps need to be converted from milliseconds to seconds
            for (const user of Object.values(data.users)) {
                for (const note of user.ns) {
                    if (note.t)
                        note.t /= 1000;
                }
            }
        // fallthrough to immediately bump to next version
        case 5: // Migrate from 5 to 6
            // Users are now stored as a blob rather than a plain object
            data.blob = compressBlob(data.users);
            delete data.users;
    }
    return data;
}
exports.migrateUsernotesToLatestSchema = migrateUsernotesToLatestSchema;
/**
 * A class for interfacing with a subreddit's usernotes. Includes methods that
 * handle blob compression, note permalink squashing, etc.
 */
class UsernotesData {
    constructor(jsonString) {
        let data = JSON.parse(jsonString);
        data = migrateUsernotesToLatestSchema(data);
        this.users = decompressBlob(data.blob);
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
            newNote.l = squashPermalink(link);
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
            link: note.l && expandPermalink(note.l),
        }));
    }
    toJSON() {
        return {
            ver: exports.LATEST_KNOWN_USERNOTES_SCHEMA,
            constants: this.constants,
            blob: compressBlob(this.users),
        };
    }
}
exports.UsernotesData = UsernotesData;
