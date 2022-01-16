import pako from 'pako';

/**
 * The latest usernotes schema version that this library can handle. If a
 * usernotes page reports a schema version higher than this number, it can't be
 * processed with this version of the library.
 */
export const LATEST_KNOWN_USERNOTES_SCHEMA = 6;

/**
 * The earliest usernotes schema version that this library can handle. If a
 * usernotes page reports a schema version lower than this number, it can't be
 * processed with this version of the library.
 */
export const EARLIEST_KNOWN_USERNOTES_SCHEMA = 4;

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
export function squashPermalink (permalink: string): string {
	let match: RegExpMatchArray | null;
	if ((match = permalink.match(/(?:\/comments|^https?:\/\/redd\.it)\/([a-z0-9]+)(?:\/[^/]*(?:\/([a-z0-9]+)?)?)?/))) {
		// Submission pages
		let squashed = `l,${match[1]}`;
		if (match[2]) {
			// Add context for specific comments
			squashed += `,${match[2]}`;
		}
		return squashed;
	} else if ((match = permalink.match(/\/messages\/(\w+)/))) {
		// Old modmail pages
		return `m,${match[1]}`;
	} else if (permalink.startsWith('https://mod.reddit.com')) {
		// New modmail pages
		return permalink;
	}
	// If nothing else, return the original permalink
	return permalink;
}

/**
 * Expands a shortened link string from Toolbox usernotes into a full permalink.
 * This format is described here:
 * {@link https://github.com/toolbox-team/reddit-moderator-toolbox/wiki/Subreddit-Wikis%3A-usernotes#link-string-formats}
 * @param shortenedLink The shortened link string to expand
 * @returns The expanded, full permalink
 */
export function expandPermalink (shortenedLink: string): string {
	if (shortenedLink.startsWith('l,')) {
		// Expand to a submission or comment permalink
		return `https://www.reddit.com/comments/${shortenedLink.substr(2).split(',').join('/_/')}`;
	} else if (shortenedLink.startsWith('m,')) {
		// Expand to a message permalink
		return `https://www.reddit.com/message/messages/${shortenedLink.substr(2)}`;
	}
	return shortenedLink;
}

/**
 * Compresses a JSON value into a zlib-compressed, base64 blob string. This
 * format is described here:
 * {@link https://github.com/toolbox-team/reddit-moderator-toolbox/wiki/Subreddit-Wikis:-usernotes#working-with-the-blob}
 * @param value The object or value to compress
 * @returns The generated blob.
 */
export function compressBlob (value: any): string {
	return Buffer.from(pako.deflate(JSON.stringify(value))).toString('base64');
}

/**
 * Decompresses a blob string into the JSON value used to create it. This format
 * is described here:
 * {@link https://github.com/toolbox-team/reddit-moderator-toolbox/wiki/Subreddit-Wikis:-usernotes#working-with-the-blob}
 * @param blob The blob to decompress
 * @returns The original JSON value.
 */
export function decompressBlob (blob: string): any {
	return JSON.parse(pako.inflate(Buffer.from(blob, 'base64').toString('binary'), {to: 'string'}));
}

/**
 * Checks the schema version of raw usernotes data and attempts to update it to
 * the latest known schema version if it's out of date. Throws an error if the
 * data's current schema version is too old or new to handle.
 * @param data The usernotes data read
 * @returns Data object updated to latest schema version
 */
export function migrateUsernotesToLatestSchema (data: any): RawUsernotesData {
	if (data.ver < EARLIEST_KNOWN_USERNOTES_SCHEMA) {
		throw new TypeError(`Unknown schema version ${data.ver} (earliest known version is ${EARLIEST_KNOWN_USERNOTES_SCHEMA})`);
	}
	if (data.ver > LATEST_KNOWN_USERNOTES_SCHEMA) {
		throw new TypeError(`Unknown schema version ${data.ver} (latest known version is ${LATEST_KNOWN_USERNOTES_SCHEMA})`);
	}

	// eslint-disable-next-line default-case
	switch (data.ver) {
		case 4: // Migrate from 4 to 5
			// Timestamps need to be converted from milliseconds to seconds
			for (const user of Object.values(<RawUsernotesUsers>data.users)) {
				for (const note of user.ns) {
					if (note.t) note.t /= 1000;
				}
			}
			// fallthrough to immediately bump to next version
		case 5: // Migrate from 5 to 6
			// Users are now stored as a blob rather than a plain object
			data.blob = compressBlob(data.users);
			delete data.users;
	}

	return data as RawUsernotesData;
}

/**
 * A class for interfacing with a subreddit's usernotes. Includes methods that
 * handle blob compression, note permalink squashing, etc.
 */
export class UsernotesData {
	constants: RawUsernotesConstants;

	users: RawUsernotesUsers;

	constructor (jsonString: string) {
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
	addUsernote (username: string, text: string, link?: string): void {
		if (!this.users[username]) {
			this.users[username] = {ns: []};
		}
		const newNote: RawUsernote = {
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
	notesForUser (username: string): PrettyUsernote[] | null {
		return this.users[username]?.ns.map(note => ({
			text: note.n,
			timestamp: note.t == null ? undefined : new Date(note.t * 1000),
			link: note.l && expandPermalink(note.l),
		}));
	}

	toJSON () {
		return {
			ver: LATEST_KNOWN_USERNOTES_SCHEMA,
			constants: this.constants,
			blob: compressBlob(this.users),
		};
	}
}
