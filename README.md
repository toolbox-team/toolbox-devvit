# toolbox-devvit

Helpers for working with /r/toolbox data from Devvit community apps.

## Installation

```bash
npm install --production @eritbh/toolbox-devvit
```

## Usage Example

Install the library

```ts
import {Devvit, RedditAPIClient, Context} from '@devvit/public-api';
import {ToolboxClient} from '@eritbh/toolbox-devvit';

const reddit = new RedditAPIClient();
const toolbox = new ToolboxClient(reddit);

// A simple action that creates a usernote on a post's author
Devvit.addAction({
	context: Context.POST,
	name: 'Create Test Usernote',
	description: 'Creates a Toolbox usernote for testing',
	handler: async (event, metadata) => {
		const subreddit = (await reddit.getCurrentSubreddit(metadata)).name;
		const user = event.post.author!;
		const note = 'Hihi i am a note';
		await toolbox.createUsernote({subreddit, user, note}, metadata);
		return {success: true, message: 'Note added!'};
	}
});

export default Devvit;
```

## License

[MIT &copy; eritbh](/LICENSE)
