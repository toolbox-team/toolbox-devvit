"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolboxClient = void 0;
const UsernotesData_1 = require("./UsernotesData");
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
 * 		const subreddit = (await reddit.getCurrentSubreddit(metadata)).name;
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
class ToolboxClient {
    /**
     * Creates a Toolbox client. Do this once at the top of your app, right
     * after you create your Reddit API client.
     * @param redditClient Your {@linkcode RedditAPIClient} instance
     */
    constructor(redditClient) {
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
    addUsernote({ subreddit, user, note, link, reason, }, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield this.reddit.getWikiPage(subreddit, TB_USERNOTES_PAGE, metadata);
            const notes = new UsernotesData_1.UsernotesData(page.content);
            notes.addUsernote(user, note, link);
            yield this.reddit.updateWikiPage({
                subredditName: subreddit,
                page: TB_USERNOTES_PAGE,
                content: notes.toString(),
                reason: reason || `create new note on user ${user} via community app`,
            }, metadata);
        });
    }
}
exports.ToolboxClient = ToolboxClient;
