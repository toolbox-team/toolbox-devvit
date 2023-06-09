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
const Usernotes_1 = require("./Usernotes");
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
 * import {ToolboxClient} from 'toolbox-devvit';
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
     * Gets a handle to all usernotes in a given subreddit.
     * @param subreddit Name of the subreddit to get notes from
     * @param metadata Context metadata passed to Reddit API client calls
     * @returns Promise which resolves to a {@linkcode Usernotes} instance
     * containing the notes, or rejects on error
     */
    getUsernotes(subreddit, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield this.reddit.getWikiPage(subreddit, TB_USERNOTES_PAGE, metadata);
            return new Usernotes_1.Usernotes(page.content);
        });
    }
    /**
     * Gets the usernotes on a particular user.
     * @param subreddit Name of the subreddit to create the note in
     * @param username Username to fetch notes of
     * @param metadata Context metadata passed to Reddit API client calls
     * @returns Promise which resolves to an array of notes or rejects on error
     */
    getUsernotesOnUser(subreddit, username, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const notes = yield this.getUsernotes(subreddit, metadata);
            return notes.get(username);
        });
    }
    /**
     * Saves usernotes from a {@linkcode Usernotes} instance to a subreddit.
     * @param subreddit Name of the subreddit to save notes to
     * @param notes Object containing all the subreddit's notes
     * @param reason Wiki revision reason to send
     * @param metadata Context metadata passed to Reddit API client calls
     * @returns Promise which resolves on success or rejects on error
     */
    writeUsernotes(subreddit, notes, reason, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.reddit.updateWikiPage({
                subredditName: subreddit,
                page: TB_USERNOTES_PAGE,
                content: notes.toString(),
                reason: reason || `modify notes via community app`,
            }, metadata);
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
    addUsernote(subreddit, note, reason, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!note.timestamp) {
                note.timestamp = new Date();
            }
            if (!note.moderatorUsername) {
                note.moderatorUsername = (yield this.reddit.getAppUser(metadata)).username;
            }
            if (reason === undefined) {
                reason = `create new note on user ${note.username} via community app`;
            }
            const notes = yield this.getUsernotes(subreddit, metadata);
            notes.add(note);
            yield this.writeUsernotes(subreddit, notes, reason, metadata);
        });
    }
}
exports.ToolboxClient = ToolboxClient;
