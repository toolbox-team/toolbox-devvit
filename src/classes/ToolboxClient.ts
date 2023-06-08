import {RedditAPIClient} from '@devvit/public-api';
import {Metadata} from '@devvit/protos';
import {UsernotesData} from './UsernotesData';

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
 * import {ToolboxClient} from '@eritbh/toolbox-api';
 *
 * const reddit = new RedditAPIClient();
 * const toolbox = new ToolboxClient(reddit);
 *
 * // A simple action that creates a usernote on a post's author
 * Devvit.addAction({
 * 	context: Context.POST,
 * 	name: 'Erin made a custom action',
 * 	description: 'Do something with this post',
 * 	handler: async (event, metadata) => {
 * 		const subreddit = await reddit.getCurrentSubreddit(metadata);
 * 		const user = event.post.author!;
 * 		const note = 'Hihi i am a note';
 *
 * 		await toolbox.createUsernote({subreddit, user, note}, metadata);
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
	 * Creates a usernote.
	 * @param options Information about the usernote to create
	 * @param options.subreddit Name of the subreddit to create the note in
	 * @param options.user Name of the user to add the note to
	 * @param options.note Text of the note
	 * @param options.link Context link included in the note
	 * @param options.reason Wiki revision reason to send
	 * @param metadata Context metadata passed to Reddit API client calls
	 * @returns Promise which resolves on success or rejects on error
	 */
	async addUsernote ({
		subreddit,
		user,
		note,
		link,
		reason,
	}: {
		subreddit: string;
		user: string;
		note: string;
		link?: string;
		reason?: string;
	}, metadata: Metadata | undefined): Promise<void> {
		const page = await this.reddit.getWikiPage(subreddit, TB_USERNOTES_PAGE, metadata);
		const notes = new UsernotesData(page.content);
		notes.addUsernote(user, note, link);
		await this.reddit.updateWikiPage({
			subredditName: subreddit,
			page: TB_USERNOTES_PAGE,
			content: notes.toString(),
			reason: reason || `create new note on user ${user} via @eritbh/toolbox-api`,
		}, metadata);
	}
}
