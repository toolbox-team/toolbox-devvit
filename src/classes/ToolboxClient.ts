import {RedditAPIClient} from '@devvit/public-api';
import {Metadata} from '@devvit/protos';
import {Usernotes} from './Usernotes';
import {Usernote, UsernoteInit} from '../types/Usernote';

/** The name of the wiki page where Toolbox stores usernotes. */
const TB_USERNOTES_PAGE = 'usernotes';

/**
 * A client class for interfacing with Toolbox functionality and stored data
 * from within the Devvit platform. Wraps the Reddit API client provided with
 * Devvit and provides methods to perform various actions.
 *
 * @example
 * ```ts
 * import {Devvit, RedditAPIClient, Context} from '@devvit/public-api';
 * import {ToolboxClient} from '@eritbh/toolbox-devvit';
 * const reddit = new RedditAPIClient();
 * const toolbox = new ToolboxClient(reddit);
 *
 * // A simple action that creates a usernote on a post's author
 * Devvit.addAction({
 * 	context: Context.POST,
 * 	name: 'Create Test Usernote',
 * 	description: 'Creates a Toolbox usernote for testing',
 * 	handler: async (event, metadata) => {
 * 		const subredditName = (await reddit.getCurrentSubreddit(metadata)).name;
 * 		const username = event.post.author!;
 * 		const text = 'Hihi i am a note';
 * 		const wikiRevisionReason = 'Create note via my custom app';
 *
 * 		await toolbox.addUsernote(subredditName, {
 * 			username,
 * 			text,
 * 		}, wikiRevisionReason, metadata);
 *
 * 		return {success: true, message: 'Note added!'};
 * 	}
 * });
 *
 * export default Devvit;
 * ```
 */
export class ToolboxClient {
	reddit: RedditAPIClient;

	/**
	 * Creates a Toolbox client. Do this once at the top of your app, right
	 * after you create your Reddit API client.
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
	async getUsernotes (subreddit: string, metadata: Metadata | undefined): Promise<Usernotes> {
		const page = await this.reddit.getWikiPage(subreddit, TB_USERNOTES_PAGE, metadata);
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
		metadata: Metadata | undefined,
	): Promise<Usernote[]> {
		const notes = await this.getUsernotes(subreddit, metadata);
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
		metadata: Metadata | undefined,
	): Promise<void> {
		await this.reddit.updateWikiPage({
			subredditName: subreddit,
			page: TB_USERNOTES_PAGE,
			content: notes.toString(),
			reason: reason || `modify notes via community app`,
		}, metadata);
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
		metadata: Metadata | undefined
	): Promise<void> {
		if (!note.timestamp) {
			note.timestamp = new Date();
		}
		if (!note.moderatorUsername) {
			note.moderatorUsername = (await this.reddit.getAppUser(metadata)).username;
		}
		if (reason === undefined) {
			reason = `create new note on user ${note.username} via community app`;
		}

		const notes = await this.getUsernotes(subreddit, metadata);
		notes.add(note as Usernote);
		await this.writeUsernotes(subreddit, notes, reason, metadata);
	}
}
