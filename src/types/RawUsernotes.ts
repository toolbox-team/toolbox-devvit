// type imports for doc links
import type {
	LATEST_KNOWN_USERNOTES_SCHEMA,
	migrateUsernotesToLatestSchema,
} from '../helpers/usernotes';

/** Raw data for a single usernote */
export interface RawUsernotesNote {
	/** Timestamp (seconds since epoch) */
	t: number;
	/** Note text */
	n: string;
	/** Index in constants.users of moderator who left this note */
	m: number;
	/** Index in constants.warnings of this note's type's key */
	w?: number;
	/** Permalink of note context, in shortened format */
	l?: string;
}

/**
 * A zlib-compressed, base64-encoded representation of an object. Retrieve the
 * data by using {@linkcode decompressBlob}.
 */
export type RawUsernotesBlob<T> = string & {_contents?: T};

/** Raw data for the object of all usernotes */
export interface RawUsernotesUsers {
	/** The username of a user */
	[name: string]: {
		/** A list of allnotes left on that user */
		ns: RawUsernotesNote[];
	};
}

/** Constant data referenced by usernotes */
export interface RawUsernotesConstants {
	/** A list of all mods who have added notes */
	users: (string | null)[];
	/** A list of all the keys of note types that have been used */
	warnings: (string | null)[];
}

/**
 * Raw data stored as JSON on the `usernotes` wiki page.
 *
 * Note that while the library supports upgrading older schemas to the current
 * one (via {@linkcode migrateUsernotesToLatestSchema}), this type will only
 * describe the latest known schema version. If you are manually reading data
 * from the wiki without passing it through the migration function, and you read
 * a `ver` value different than {@linkcode LATEST_KNOWN_USERNOTES_SCHEMA}, this
 * type will not describe that data.
 */
export interface RawUsernotes {
	/** The version number of the usernotes schema this data conforms to */
	ver: 6;
	/** Constant data referenced by usernotes */
	constants: RawUsernotesConstants;
	/** A blob that, when decompressed, yields a {@linkcode RawUsernotesUsers} object */
	blob: RawUsernotesBlob<RawUsernotesUsers>;
}
