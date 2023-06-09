"use strict";
// this is old and broken but i will fix it up soon i promise
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_USERNOTE_TYPES = exports.EARLIEST_KNOWN_CONFIG_SCHEMA = exports.LATEST_KNOWN_CONFIG_SCHEMA = void 0;
exports.LATEST_KNOWN_CONFIG_SCHEMA = 1;
exports.EARLIEST_KNOWN_CONFIG_SCHEMA = 1;
/** Default usernote types to use if subreddit config doesn't specify any */
exports.DEFAULT_USERNOTE_TYPES = [
    { key: 'gooduser', color: 'green', text: 'Good Contributor' },
    { key: 'spamwatch', color: 'fuchsia', text: 'Spam Watch' },
    { key: 'spamwarn', color: 'purple', text: 'Spam Warning' },
    { key: 'abusewarn', color: 'orange', text: 'Abuse Warning' },
    { key: 'ban', color: 'red', text: 'Ban' },
    { key: 'permban', color: 'darkred', text: 'Permanent Ban' },
    { key: 'botban', color: 'black', text: 'Bot Ban' },
];
