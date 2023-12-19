// type imports for doc references
import type {SubredditConfig} from '../classes/SubredditConfig';
import type {ToolboxClient} from '../classes/ToolboxClient';

/** Details about a newly created usernote */
export interface UsernoteInit {
	/** The name of the user this note is attached to */
	username: string;
	/** The text of the note */
	text: string;
	/** The date and time the note was left, defaulting to the current time */
	timestamp?: Date;
	/**
	 * The username of the moderator who left the note, defaulting to the
	 * app user
	 */
	moderatorUsername?: string;
	/**
	 * The key of the note type of this note. To get information about
	 * corresponding note type (its label text and color information), fetch the
	 * subreddit's configuration with {@linkcode ToolboxClient.getConfig} and
	 * then pass this value to {@linkcode SubredditConfig.getNoteType}.
	 *
	 * @example Get the color and text of a note type from the key:
	 * ```ts
	 * const toolbox = new ToolboxClient(reddit);
	 * const subreddit = 'mildlyinteresting';
	 *
	 * // Acquire a note somehow
	 * const usernotes = toolbox.getUsernotes(subreddit);
	 * const note = usernotes.get('eritbh')[0];
	 *
	 * // Look up information about the type of this note
	 * const subConfig = toolbox.getConfig(subreddit);
	 * const {color, text} = subConfig.getNoteType(note.noteType);
	 * ```
	 */
	noteType?: string;
	/** Permalink to the item the note was left in response to */
	contextPermalink?: string;
}

/** A single usernote on a user */
export interface Usernote extends UsernoteInit {
	/** The date and time the note was left */
	timestamp: Date;
	/** The username of the moderator who left the note */
	moderatorUsername: string;
}
