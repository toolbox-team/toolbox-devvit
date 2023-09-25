import { RawSubredditConfig, RawUsernoteType } from '../types/RawSubredditConfig';
/**
 * The latest subreddit config schema version that this library can handle. If a
 * config page reports a schema version higher than this number, it can't be
 * processed with this version of the library.
 */
export declare const LATEST_KNOWN_CONFIG_SCHEMA = 1;
/**
 * The earliest subreddit config schema version that this library can handle. If
 * a config page reports a schema version lower than this number, it can't be
 * processed with this version of the library.
 */
export declare const EARLIEST_KNOWN_CONFIG_SCHEMA = 1;
/** Default usernote types used if subreddit config doesn't specify its own. */
export declare const DEFAULT_USERNOTE_TYPES: readonly RawUsernoteType[];
/**
 * Checks the schema version of raw subreddit config data and attempts to update
 * it to the latest known schema version if it's out of date. Throws an error if
 * the data's current schema version is too old or new to handle.
 * @param data The subreddit config data object read from the wiki, as an object
 * (i.e. you should parse the page contents as JSON to pass into this function)
 * @returns Data object updated to latest schema version
 */
export declare function migrateConfigToLatestSchema(data: any): RawSubredditConfig;
