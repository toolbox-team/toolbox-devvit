import {
	DEFAULT_USERNOTE_TYPES,
	migrateConfigToLatestSchema,
} from '../helpers/config';
import {RawSubredditConfig} from '../types/SubredditConfig';

/** */
export class SubredditConfig {
	private data: RawSubredditConfig;
	constructor (jsonString: string) {
		this.data = migrateConfigToLatestSchema(JSON.parse(jsonString));
	}

	/** Returns all usernote types. */
	getAllNoteTypes () {
		let configuredTypes = this.data?.usernoteColors;
		if (!configuredTypes || !configuredTypes.length) {
			return DEFAULT_USERNOTE_TYPES;
		}

		return configuredTypes;
	}

	/**
	 * Returns the usernote type matching the given key. Useful for looking up
	 * display information for a usernote.
	 */
	getNoteType (key: string) {
		const noteTypes = this.getAllNoteTypes();
		return noteTypes.find(noteType => noteType.key === key);
	}

	/**
	 * Serializes the subreddit config data for writing back to the wiki. **This
	 * method returns an object; you probably want {@linkcode toString}
	 * instead.**
	 * @returns Object which can be serialized to JSON and written as the
	 * contents of the `toolbox` wiki page
	 */
	toJSON () {
		return this.data;
	}

	/**
	 * Stringifies the subreddit config data for writing back to the wiki.
	 * @param indent Passed as the third argument of `JSON.stringify`. Useful
	 * for debugging; however, because wiki space is limited, never provide this
	 * parameter when actually saving notes to the wiki.
	 * @returns JSON string which can be saved as the contents of the `toolbox`
	 * wiki page
	 */
	toString (indent?: string | number) {
		return JSON.stringify(this.data, null, indent);
	}
}
