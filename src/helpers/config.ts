import {RawSubredditConfig, RawUsernoteType} from '../types/RawSubredditConfig';

/**
 * The latest subreddit config schema version that this library can handle. If a
 * config page reports a schema version higher than this number, it can't be
 * processed with this version of the library.
 */
export const LATEST_KNOWN_CONFIG_SCHEMA = 1;

/**
 * The earliest subreddit config schema version that this library can handle. If
 * a config page reports a schema version lower than this number, it can't be
 * processed with this version of the library.
 */
export const EARLIEST_KNOWN_CONFIG_SCHEMA = 1;

/** Default usernote types used if subreddit config doesn't specify its own. */
export const DEFAULT_USERNOTE_TYPES: readonly RawUsernoteType[] = [
	{key: 'gooduser', color: 'green', text: 'Good Contributor'},
	{key: 'spamwatch', color: 'fuchsia', text: 'Spam Watch'},
	{key: 'spamwarn', color: 'purple', text: 'Spam Warning'},
	{key: 'abusewarn', color: 'orange', text: 'Abuse Warning'},
	{key: 'ban', color: 'red', text: 'Ban'},
	{key: 'permban', color: 'darkred', text: 'Permanent Ban'},
	{key: 'botban', color: 'black', text: 'Bot Ban'},
];

/**
 * Checks the schema version of raw subreddit config data and attempts to update
 * it to the latest known schema version if it's out of date. Throws an error if
 * the data's current schema version is too old or new to handle.
 * @param data The subreddit config data object read from the wiki, as an object
 * (i.e. you should parse the page contents as JSON to pass into this function)
 * @returns Data object updated to latest schema version
 */
export function migrateConfigToLatestSchema (data: any): RawSubredditConfig {
	if (data.ver < EARLIEST_KNOWN_CONFIG_SCHEMA) {
		throw new TypeError(
			`Unknown schema version ${data.ver} (earliest known version is ${EARLIEST_KNOWN_CONFIG_SCHEMA})`,
		);
	}
	if (data.ver > LATEST_KNOWN_CONFIG_SCHEMA) {
		throw new TypeError(
			`Unknown schema version ${data.ver} (latest known version is ${LATEST_KNOWN_CONFIG_SCHEMA})`,
		);
	}

	// In the future, if we ever do a schema bump to this page, migration steps
	// will go here. See also migrateUsernotesToLatestSchema()

	return data as RawSubredditConfig;
}
