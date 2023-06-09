import {
	RawUsernotes,
	RawUsernotesConstants,
	RawUsernotesNote,
	RawUsernotesUsers,
} from '../types/RawUsernotes';
import {
	LATEST_KNOWN_USERNOTES_SCHEMA,
	compressBlob,
	decompressBlob,
	expandPermalink,
	squashPermalink,
	migrateUsernotesToLatestSchema,
} from '../helpers/usernotes';

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
		const newNote: RawUsernotesNote = {
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

	/**
	 * Packs the usernotes data for writing back to the wiki. **This method
	 * returns an object; you probably want {@linkcode toString} instead.**
	 * @returns Object which can be serialized to JSON and written as the
	 * contents of the `usernotes` wiki page
	 */
	toJSON (): RawUsernotes {
		return {
			ver: LATEST_KNOWN_USERNOTES_SCHEMA,
			constants: this.constants,
			blob: compressBlob(this.users),
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
	toString (indent?: string | number) {
		return JSON.stringify(this, null, indent);
	}
}
