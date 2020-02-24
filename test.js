const test = require('ava');

const {squashPermalink} = require('.');

test('squashPermalink', t => {
	for (const [arg, expected] of Object.entries({
		// Comment links
		'https://www.reddit.com/r/subreddit/comments/123abc/some_link_slug/456def': 'l,123abc,456def',
		'https://www.reddit.com/r/subreddit/comments/123abc/some_link_slug/456def/?trailing#garbage': 'l,123abc,456def',
		'https://www.reddit.com/comments/123abc/some_link_slug/456def': 'l,123abc,456def',
		'https://www.reddit.com/comments/123abc/some_link_slug/456def/?trailing#garbage': 'l,123abc,456def',
		'https://new.reddit.com/r/subreddit/comments/123abc/some_link_slug/456def': 'l,123abc,456def',
		'https://new.reddit.com/r/subreddit/comments/123abc/some_link_slug/456def/?trailing#garbage': 'l,123abc,456def',
		'https://new.reddit.com/comments/123abc/some_link_slug/456def': 'l,123abc,456def',
		'https://new.reddit.com/comments/123abc/some_link_slug/456def/?trailing#garbage': 'l,123abc,456def',
		'https://old.reddit.com/r/subreddit/comments/123abc/some_link_slug/456def': 'l,123abc,456def',
		'https://old.reddit.com/r/subreddit/comments/123abc/some_link_slug/456def/?trailing#garbage': 'l,123abc,456def',
		'https://old.reddit.com/comments/123abc/some_link_slug/456def': 'l,123abc,456def',
		'https://old.reddit.com/comments/123abc/some_link_slug/456def/?trailing#garbage': 'l,123abc,456def',
		// Submission links
		'https://www.reddit.com/r/subreddit/comments/123abc': 'l,123abc',
		'https://www.reddit.com/r/subreddit/comments/123abc/some_link_slug/?trailing#garbage': 'l,123abc',
		'https://www.reddit.com/comments/123abc': 'l,123abc',
		'https://www.reddit.com/comments/123abc/some_link_slug/?trailing#garbage': 'l,123abc',
		'https://new.reddit.com/r/subreddit/comments/123abc': 'l,123abc',
		'https://new.reddit.com/r/subreddit/comments/123abc/some_link_slug/?trailing#garbage': 'l,123abc',
		'https://new.reddit.com/comments/123abc': 'l,123abc',
		'https://new.reddit.com/comments/123abc/some_link_slug/?trailing#garbage': 'l,123abc',
		'https://old.reddit.com/r/subreddit/comments/123abc': 'l,123abc',
		'https://old.reddit.com/r/subreddit/comments/123abc/some_link_slug/?trailing#garbage': 'l,123abc',
		'https://old.reddit.com/comments/123abc': 'l,123abc',
		'https://old.reddit.com/comments/123abc/some_link_slug/?trailing#garbage': 'l,123abc',
		'https://redd.it/123abc': 'l,123abc',
		'https://redd.it/123abc/?trailing#garbage': 'l,123abc',
		// Old modmail links
		'https://www.reddit.com/r/subreddit/message/messages/123abc': 'm,123abc',
		'https://www.reddit.com/r/subreddit/message/messages/123abc/?trailing#garbage': 'm,123abc',
		'https://www.reddit.com/message/messages/123abc': 'm,123abc',
		'https://www.reddit.com/message/messages/123abc/?trailing#garbage': 'm,123abc',
		'https://new.reddit.com/r/subreddit/message/messages/123abc': 'm,123abc',
		'https://new.reddit.com/r/subreddit/message/messages/123abc/?trailing#garbage': 'm,123abc',
		'https://new.reddit.com/message/messages/123abc': 'm,123abc',
		'https://new.reddit.com/message/messages/123abc/?trailing#garbage': 'm,123abc',
		'https://old.reddit.com/r/subreddit/message/messages/123abc': 'm,123abc',
		'https://old.reddit.com/r/subreddit/message/messages/123abc/?trailing#garbage': 'm,123abc',
		'https://old.reddit.com/message/messages/123abc': 'm,123abc',
		'https://old.reddit.com/message/messages/123abc/?trailing#garbage': 'm,123abc',
	})) {
		t.is(squashPermalink(arg), expected);
	}
});
