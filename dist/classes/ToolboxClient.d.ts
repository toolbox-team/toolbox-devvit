import { RedditAPIClient } from '@devvit/public-api';
import { Usernotes } from './Usernotes';
import { Usernote, UsernoteInit } from '../types/Usernote';
/**
 * A client class for interfacing with Toolbox functionality and stored data
 * from within the Devvit platform. Wraps the Reddit API client provided in
 * Devvit events and provides methods to perform various actions.
 *
 * @example
 * ```ts
 * import {Devvit} from '@devvit/public-api';
 * import {ToolboxClient} from './src/index';
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
export declare class ToolboxClient {
    reddit: RedditAPIClient;
    /**
     * Creates a Toolbox client. Do this at the top of event handlers, where you
     * passing `reddit` from the event context. Make sure you've called
     * `Devvit.configure({redditAPI: true})` as well!
     * @param redditClient Your {@linkcode RedditAPIClient} instance
     */
    constructor(redditClient: any);
    /**
     * Gets a handle to all usernotes in a given subreddit.
     * @param subreddit Name of the subreddit to get notes from
     * @param metadata Context metadata passed to Reddit API client calls
     * @returns Promise which resolves to a {@linkcode Usernotes} instance
     * containing the notes, or rejects on error
     */
    getUsernotes(subreddit: string): Promise<Usernotes>;
    /**
     * Gets the usernotes on a particular user.
     * @param subreddit Name of the subreddit to create the note in
     * @param username Username to fetch notes of
     * @param metadata Context metadata passed to Reddit API client calls
     * @returns Promise which resolves to an array of notes or rejects on error
     */
    getUsernotesOnUser(subreddit: string, username: string): Promise<Usernote[]>;
    /**
     * Saves usernotes from a {@linkcode Usernotes} instance to a subreddit.
     * @param subreddit Name of the subreddit to save notes to
     * @param notes Object containing all the subreddit's notes
     * @param reason Wiki revision reason to send
     * @param metadata Context metadata passed to Reddit API client calls
     * @returns Promise which resolves on success or rejects on error
     */
    writeUsernotes(subreddit: string, notes: Usernotes, reason: string | undefined): Promise<void>;
    /**
     * Creates a usernote.
     * @param subreddit Name of the subreddit to create the note in
     * @param note Details about the usernote to create
     * @param reason Wiki revision reason to send
     * @param metadata Context metadata passed to Reddit API client calls
     * @returns Promise which resolves on success or rejects on error
     */
    addUsernote(subreddit: string, note: UsernoteInit, reason: string | undefined): Promise<void>;
}
