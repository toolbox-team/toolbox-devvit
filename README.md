# toolbox-devvit [![npm version](https://img.shields.io/npm/v/toolbox-devvit.svg)](https://www.npmjs.com/package/toolbox-devvit)

Helpers for working with /r/toolbox data from Devvit community apps. [Read the documentation.](https://toolbox-team.github.io/toolbox-devvit/)

## Installation

```bash
npm install --production toolbox-devvit
```

## Usage Example

```ts
import {Devvit} from '@devvit/public-api';
import {ToolboxClient} from 'toolbox-devvit';

Devvit.configure({
	redditAPI: true,
	// ...
});

// A simple action that creates a usernote on a post's author
Devvit.addMenuItem({
	location: 'post',
	label: 'Create Test Usernote',
	description: 'Creates a Toolbox usernote for testing',
	onPress: async (event, {reddit, ui, postId}) => {
		const subredditName = (await reddit.getCurrentSubreddit()).name;
		const username = (await reddit.getPostById(postId!)).authorName;
		const text = 'Hihi i am a note';
		const wikiRevisionReason = 'Create note via my custom app';

		const toolbox = new ToolboxClient(reddit);
		await toolbox.addUsernote(subredditName, {
			username,
			text,
		}, wikiRevisionReason);

		ui.showToast({
			appearance: 'success',
			text: 'Note added!',
		});
	},
});

export default Devvit;
```

## License

[MIT &copy; the toolbox team](/LICENSE)
