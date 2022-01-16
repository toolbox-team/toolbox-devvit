export declare const LATEST_KNOWN_CONFIG_SCHEMA = 1;
export declare const EARLIEST_KNOWN_CONFIG_SCHEMA = 1;
export interface RawSubredditConfig {
    /** The schema version of the data */
    ver: number;
    /** Settings for domain tags */
    domainTags: DomainTag[];
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
        reasons: RemovalReason[];
    };
    modMacros: ModMacro[];
    usernoteColors: UsernoteType[];
}
export interface DomainTag {
    /** The domain to tag, e.g. "example.com" */
    name: string;
    /** A CSS color value */
    color: string;
}
export interface RemovalReason {
    title: string;
    text: string;
    flairText: string;
    cssClass: string;
}
export interface ModMacro {
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
export interface UsernoteType {
    /** Key that this type is identified by, should never change once created */
    key: string;
    /** Color for this note type, as any valid CSS color string */
    color: string;
    /** Displayed text of the note type */
    text: string;
}
/** Default usernote types to use if subreddit config doesn't specify any */
export declare const DEFAULT_USERNOTE_TYPES: UsernoteType[];
