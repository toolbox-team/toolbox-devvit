import {
	compressBlob,
	decompressBlob,
	expandPermalink,
	LATEST_KNOWN_USERNOTES_SCHEMA,
	migrateUsernotesToLatestSchema,
	squashPermalink,
} from '../helpers/usernotes';
import {RawUsernotes, RawUsernotesConstants} from '../types/RawUsernotes';
import {Usernote} from '../types/Usernote';

// TODO: nothing here handles username case correctly; go back and check the
//       toolbox implementation of that for correctness later and write test
//       cases for it

/**
 * A class that interfaces with the raw contents of a subreddit's `usernotes`
 * wiki page, automatically upgrading old storage schemas to the current version
 * and providing methods to manipulate and reserialize the notes back for
 * writing back to the wiki.
 */
export class Usernotes {
	/** A mapping of usernames to notes on the given user. */
	private users = new Map<string, Usernote[]>();

	constructor (jsonString: string) {
		let data = migrateUsernotesToLatestSchema(JSON.parse(jsonString));
		const rawUsers = decompressBlob(data.blob);

		for (const [username, {ns}] of Object.entries(rawUsers)) {
			for (const rawNote of ns) {
				let userNotes = this.users.get(username);
				if (userNotes == null) {
					userNotes = [];
					this.users.set(username, userNotes);
				}

				userNotes.push({
					username,
					timestamp: new Date(rawNote.t * 1000),
					text: rawNote.n!,
					moderatorUsername: data.constants.users[rawNote.m!]!,
					contextPermalink: rawNote.l == null
						? undefined
						: expandPermalink(rawNote.l),
					noteType: rawNote.w == null
						? undefined
						: data.constants.warnings[rawNote.w] ?? undefined,
				});
			}
		}
	}

	/**
	 * Adds a new usernote to the collection.
	 * @param note Details about the usernote to create
	 */
	add (note: Usernote): void {
		let userNotes = this.users.get(note.username);
		if (userNotes == null) {
			userNotes = [];
			this.users.set(note.username, userNotes);
		}
		if (note.timestamp == null) {
			note.timestamp = new Date();
		}
		userNotes.unshift(note as Usernote);
	}

	/**
	 * Returns all usernotes for a given user.
	 * @param username The user to fetch the notes of
	 * @returns The list of usernotes
	 */
	get (username: string): Usernote[] {
		// If the username contains capital letters, we need to also check for
		// notes saved under the lowercased version of the name first. Some
		// poorly-behaved third-party apps always lowercase the username before
		// writing new notes, and we check for this and merge those notes into
		// the list stored under the canonical spelling on the fly. See also
		// toolbox-team/reddit-moderator-toolbox#577
		const usernameLowercase = username.toLowerCase();
		if (username === usernameLowercase) {
			// the lowercased name *is* the canonical name, so third-party
			// implementations can't have possibly fucked it up (knock on wood)
			return this.users.get(username) || [];
		}

		// get a reference to the notes array under the canonical username
		let notes = this.users.get(username);
		if (!notes) {
			notes = [];
			this.users.set(username, notes);
		}

		// Get the notes under the lowercased username, rewrite the username
		// property of each to the canonical username, and push them into the
		// canonical list of notes. Then, completely remove the entry under the
		// lowercased username so it will be removed if we save to wiki later.
		const otherNotes = this.users.get(usernameLowercase) || [];
		const updatedNotes = otherNotes.map(note => ({
			...note,
			username,
		}));
		notes.push(...updatedNotes);
		this.users.delete(usernameLowercase);

		// the two note lists might overlap in date range; sort in place
		notes.sort((a, b) => +b.timestamp - +a.timestamp);

		return notes;
	}

	/**
	 * Serializes the usernotes data for writing back to the wiki. **This method
	 * returns an object; you probably want {@linkcode toString} instead.**
	 * @returns Object which can be serialized to JSON and written as the
	 * contents of the `usernotes` wiki page
	 */
	toJSON (): RawUsernotes {
		const constants: RawUsernotesConstants = {
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
			usersObject[username] = {ns: []};

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
					l: note.contextPermalink == null
						? undefined
						: squashPermalink(note.contextPermalink),
				});
			}
		}

		// Compress the users object and combine with other stuff
		return {
			ver: LATEST_KNOWN_USERNOTES_SCHEMA,
			constants,
			blob: compressBlob(usersObject),
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
	toString (indent?: string | number) {
		return JSON.stringify(this, null, indent);
	}
}
