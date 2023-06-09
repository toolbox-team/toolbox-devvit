# toolbox-devvit [![npm version](https://img.shields.io/npm/v/@eritbh/toolbox-devvit.svg)](https://www.npmjs.com/package/@eritbh/toolbox-devvit)

Helpers for working with /r/toolbox data from Devvit community apps.

## Installation

```bash
npm install --production @eritbh/toolbox-devvit
```

## Usage Example

```ts
import {Devvit, RedditAPIClient, Context} from '@devvit/public-api';
import {ToolboxClient} from '@eritbh/toolbox-devvit';

const reddit = new RedditAPIClient();
const toolbox = new ToolboxClient(reddit);

// A simple action that creates a usernote on a post's author
Devvit.addAction({
	context: Context.POST,
	name: 'Erin made a custom action',
	description: 'Do something with this post',
	handler: async (event, metadata) => {
		const subredditName = (await reddit.getCurrentSubreddit(metadata)).name;
		const username = event.post.author!;
		const timestamp = new Date();
		const text = 'Hihi i am a note';
		const wikiRevisionReason = 'Create note via my custom app';

		await toolbox.addUsernote(subredditName, {
			username,
			timestamp,
			text,
		}, wikiRevisionReason, metadata);

		return {success: true, message: 'Note added!'};
	}
});

export default Devvit;
```

## License

[MIT &copy; eritbh](/LICENSE)
