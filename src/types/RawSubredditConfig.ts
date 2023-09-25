export interface RawSubredditConfig {
	/** The schema version of the data */
	ver: number;
	/** Settings for domain tags */
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
		header: string;
		footer: string;
		pmsubject: string;
		logreason: unknown;
		logsub: unknown;
		logtitle: unknown;
		bantitle: unknown;
		getfrom: unknown;
		reasons: RawRemovalReason[];
	};
	modMacros: RawModMacro[];
	usernoteColors: RawUsernoteType[];
}

export interface RawDomainTag {
	/** The domain to tag, e.g. "example.com" */
	name: string;
	/** A CSS color value */
	color: string;
}

export interface RawRemovalReason {
	title: string;
	text: string;
	flairText: string;
	cssClass: string;
}

export interface RawModMacro {
	title: string;
	text: string;
	distinguish: boolean;
	ban: boolean;
	mute: boolean;
	remove: boolean;
	appprove: boolean;
	lockthread: boolean;
	sticky: boolean;
	archivemodmail: boolean;
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
