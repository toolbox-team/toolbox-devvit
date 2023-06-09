# toolbox-devvit [![npm version](https://img.shields.io/npm/v/toolbox-devvit.svg)](https://www.npmjs.com/package/toolbox-devvit)

Helpers for working with /r/toolbox data from Devvit community apps. [Read the documentation.](https://toolbox-team.github.io/toolbox-devvit/)

## Installation

```bash
npm install --production toolbox-devvit
```

## Usage Example

```ts
import {Devvit, RedditAPIClient, Context} from '@devvit/public-api';
import {ToolboxClient} from 'toolbox-devvit';

const reddit = new RedditAPIClient();
const toolbox = new ToolboxClient(reddit);

// A simple action that creates a usernote on a post's author
Devvit.addAction({
	context: Context.POST,
	name: 'Create Test Usernote',
	description: 'Creates a Toolbox usernote for testing',
	handler: async (event, metadata) => {
		const subredditName = (await reddit.getCurrentSubreddit(metadata)).name;
		const username = event.post.author!;
		const text = 'Hihi i am a note';
		const wikiRevisionReason = 'Create note via my custom app';

		await toolbox.addUsernote(subredditName, {
			username,
			text,
		}, wikiRevisionReason, metadata);

		return {success: true, message: 'Note added!'};
	}
});

export default Devvit;
```

## License

[MIT &copy; the toolbox team](/LICENSE)
