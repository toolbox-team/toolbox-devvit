import {RedditAPIClient} from '@devvit/public-api';
import {Usernote, UsernoteInit} from '../types/Usernote';
import {SubredditConfig} from './SubredditConfig';
import {Usernotes} from './Usernotes';

/** The name of the wiki page where Toolbox stores usernotes. */
const TB_USERNOTES_PAGE = 'usernotes';

/** The name of the wiki page where Toolbox stores subreddit configuration. */
const TB_CONFIG_PAGE = 'toolbox';

/**
 * A client class for interfacing with Toolbox functionality and stored data
 * from within the Devvit platform. Wraps the Reddit API client provided in
 * Devvit events and provides methods to perform various actions.
 *
 * @example
 * ```ts
 * import {Devvit} from '@devvit/public-api';
 * import {ToolboxClient} from 'toolbox-devvit';
 *
 * Devvit.configure({
 * 	redditAPI: true,
 * 	// ...
 * });
 *
 * // A simple action that creates a usernote on a post's author
 * Devvit.addMenuItem({
 * 	location: 'post',
 * 	label: 'Create Test Usernote',
 * 	description: 'Creates a Toolbox usernote for testing',
 * 	onPress: async (event, {reddit, ui, postId}) => {
 * 		const subredditName = (await reddit.getCurrentSubreddit()).name;
 * 		const username = (await reddit.getPostById(postId!)).authorName;
 * 		const text = 'Hihi i am a note';
 * 		const wikiRevisionReason = 'Create note via my custom app';
 *
 * 		const toolbox = new ToolboxClient(reddit);
 * 		await toolbox.addUsernote(subredditName, {
 * 			username,
 * 			text,
 * 		}, wikiRevisionReason);
 *
 * 		ui.showToast({
 * 			appearance: 'success',
 * 			text: 'Note added!',
 * 		});
 * 	}
 * });
 *
 * export default Devvit;
 * ```
 */
export class ToolboxClient {
	reddit: RedditAPIClient;

	/**
	 * Creates a Toolbox client. Do this at the top of event handlers, where you
	 * passing `reddit` from the event context. Make sure you've called
	 * `Devvit.configure({redditAPI: true})` as well!
	 * @param redditClient Your {@linkcode RedditAPIClient} instance
	 */
	constructor (redditClient) {
		this.reddit = redditClient;
	}

	/**
	 * Gets a handle to all usernotes in a given subreddit.
	 * @param subreddit Name of the subreddit to get notes from
	 * @param metadata Context metadata passed to Reddit API client calls
	 * @returns Promise which resolves to a {@linkcode Usernotes} instance
	 * containing the notes, or rejects on error
	 */
	async getUsernotes (subreddit: string): Promise<Usernotes> {
		const page = await this.reddit.getWikiPage(subreddit, TB_USERNOTES_PAGE);
		return new Usernotes(page.content);
	}

	/**
	 * Gets the usernotes on a particular user.
	 * @param subreddit Name of the subreddit to create the note in
	 * @param username Username to fetch notes of
	 * @param metadata Context metadata passed to Reddit API client calls
	 * @returns Promise which resolves to an array of notes or rejects on error
	 */
	async getUsernotesOnUser (
		subreddit: string,
		username: string,
	): Promise<Usernote[]> {
		const notes = await this.getUsernotes(subreddit);
		return notes.get(username);
	}

	/**
	 * Saves usernotes from a {@linkcode Usernotes} instance to a subreddit.
	 * @param subreddit Name of the subreddit to save notes to
	 * @param notes Object containing all the subreddit's notes
	 * @param reason Wiki revision reason to send
	 * @param metadata Context metadata passed to Reddit API client calls
	 * @returns Promise which resolves on success or rejects on error
	 */
	async writeUsernotes (
		subreddit: string,
		notes: Usernotes,
		reason: string | undefined,
	): Promise<void> {
		await this.reddit.updateWikiPage({
			subredditName: subreddit,
			page: TB_USERNOTES_PAGE,
			content: notes.toString(),
			reason: reason || `modify notes via community app`,
		});
	}

	/**
	 * Creates a usernote.
	 * @param subreddit Name of the subreddit to create the note in
	 * @param note Details about the usernote to create
	 * @param reason Wiki revision reason to send
	 * @param metadata Context metadata passed to Reddit API client calls
	 * @returns Promise which resolves on success or rejects on error
	 */
	async addUsernote (
		subreddit: string,
		note: UsernoteInit,
		reason: string | undefined,
	): Promise<void> {
		if (!note.timestamp) {
			note.timestamp = new Date();
		}
		if (!note.moderatorUsername) {
			note.moderatorUsername = (await this.reddit.getAppUser()).username;
		}
		if (reason === undefined) {
			reason = `create new note on user ${note.username} via community app`;
		}

		const notes = await this.getUsernotes(subreddit);
		notes.add(note as Usernote);
		await this.writeUsernotes(subreddit, notes, reason);
	}

	/** */
	async getConfig (subreddit: string) {
		const page = await this.reddit.getWikiPage(subreddit, TB_CONFIG_PAGE);
		return new SubredditConfig(page.content);
	}
}
