// type imports for doc links
import type {
	LATEST_KNOWN_CONFIG_SCHEMA,
	migrateConfigToLatestSchema,
} from '../helpers/config';

/**
 * Raw data stored as JSON on the `toolbox` wiki page.
 *
 * Note that while the library supports upgrading older schemas to the current
 * one (via {@linkcode migrateConfigToLatestSchema}), this type will only
 * describe the latest known schema version. If you are manually reading data
 * from the wiki without passing it through the migration function, and you read
 * a `ver` value different than {@linkcode LATEST_KNOWN_CONFIG_SCHEMA}, this
 * type will not describe that data.
 */
export interface RawSubredditConfig {
	/** The version number of the config schema this data conforms to */
	ver: 1;
	/** Settings for individual domain tags */
	domainTags: RawDomainTag[];
	/** Default settings for banning users via the mod button */
	banMacros: {
		/** The default mod-only ban note */
		banNote: string;
		/** The default message sent to banned users */
		banMessage: string;
	};
	/** Settings for removal reasons */
	removalReasons: {
		/** Header text for removal messages (may include tokens) */
		header: string;
		/** Footer text for removal messages (may include tokens) */
		footer: string;
		/** Subject for removal messages in PM/modmail (may include tokens) */
		pmsubject: string;
		/**
		 * Reason string for logging sub use (may include tokens)
		 * @deprecated please don't make me support logsubs
		 */
		logreason: string;
		/**
		 * Target subreddit for logging sub use, or an empty string for none
		 * @deprecated please don't make me support logsubs
		 */
		logsub: string;
		/**
		 * Title string for logging sub use (may include tokens)
		 * @deprecated please don't make me support logsubs
		 */
		logtitle: string;
		/**
		 * Unimplemented - Toolbox itself does nothing with this key
		 * @deprecated
		 */
		bantitle: unknown;
		/**
		 * Name of another subreddit to fetch removal reasons from, instead of
		 * using the reasons defined in this config, or an empty string for none
		 */
		getfrom: string;
		/**
		 * How subreddit settings for sending removal messages are enforced to
		 * moderators. This property impacts how the `type*` and `autoArchive`
		 * properties are interpreted.
		 * - `suggest` - Subreddit settings should be the default every time a
		 *   reason is being left, but can be changed by moderators in the UI on
		 *   a case-by-case basis
		 * - `leave` - Subreddit settings are ignored and whatever settings the
		 *   user has configured in Toolbox personal settings are always used
		 * - `force` - Subreddit settings are used for all reasons and
		 *   moderators cannot change them when leaving a removal reason
		 */
		removalOption: 'suggest' | 'leave' | 'force';
		/**
		 * How removal reason messages are sent by default.
		 * - `reply` - Message is sent as a comment reply to the actioned item
		 * - `pm` - Message is sent as a private message
		 * - `both` - Message is sent both as a reply and as a PM
		 * - `none` - No message is sent (only useful for logsub users)
		 */
		typeReply: 'reply' | 'pm' | 'both' | 'none';
		/** If true, messages sent as replies will be stickied where possible */
		typeStickied: boolean;
		/**
		 * If true, removal messages sent as replies will be made using the fake
		 * subreddit_ModTeam account
		 */
		typeCommentAsSubreddit: boolean;
		/**
		 * If true, using a removal reason on a submission will also lock the
		 * comments of that submission
		 */
		typeLockThread: boolean;
		/** If true, removal messages sent as replies will be locked */
		typeLockComment: boolean;
		/**
		 * If true, removal messages sent as PMs will be sent through modmail;
		 * if false, they will be sent through the acting mod's personal PMs
		 */
		typeAsSub: boolean;
		/**
		 * If true and `typeAsSub` is true, removal reason messages sent as
		 * modmail will be automatically archived
		 */
		autoArchive: boolean;
		/** The individual removal reasons */
		reasons: RawRemovalReason[];
	};
	/** Settings for individual mod macros */
	modMacros: RawModMacro[];
	/** Settings for individual usernote types */
	usernoteColors: RawUsernoteType[];
}

export interface RawDomainTag {
	/** The domain to tag, e.g. "example.com" */
	name: string;
	/** A CSS color value */
	color: string;
}

export interface RawRemovalReason {
	/** Title of the removal reason, only seen by mods */
	title: string;
	/**
	 * Text of the removal message to include in the removal message to the user
	 * (may include tokens)
	 */
	text: string;
	/**
	 * Text of a flair to assign to submissions removed with this reason, or an
	 * empty string for none
	 */
	flairText: string;
	/**
	 * CSS class of a flair to assign to submissions removed with this reason,
	 * or an empty string for none
	 */
	flairCSS: string;
	/** If true, this reason applies to submissions */
	removePosts: boolean;
	/** If true, this reason applies to comments */
	removeComments: boolean;
}

export interface RawModMacro {
	/** Title of the macro, only seen by mods */
	title: string;
	/** Text of the macro, left as a reply to the user (may include tokens) */
	text: string;
	/** If true, the reply comment will be distinguished */
	distinguish: boolean;
	/** If true, the user will be permanently banned */
	ban: boolean;
	/** If true, the user will be muted from modmail */
	mute: boolean;
	/** If true, the item will be removed */
	remove: boolean;
	/** If true, the item will be approved */
	appprove: boolean;
	/** If true, the submission will be locked */
	lockthread: boolean;
	/** If true, the reply comment will be stickied */
	sticky: boolean;
	/** If true, the modmail thread will be archived */
	archivemodmail: boolean;
	/** If true, the modmail thread will be highlighted */
	highlightmodmail: boolean;
}

/** A single usernote type */
export interface RawUsernoteType {
	/** Key that this type is identified by, should never change once created */
	key: string;
	/** Color for this note type, as any valid CSS color string */
	color: string;
	/** Displayed text of the note type */
	text: string;
}
