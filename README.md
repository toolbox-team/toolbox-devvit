# toolbox-api

Helpers for interfacing with Reddit Moderator Toolbox settings and usernotes.

## Installation

This library is still under initial development, but dev builds are generated automatically and can be installed from Github:

```bash
npm install --save --production https://github.com/eritbh/toolbox-api.git#builds/main
```

## Usage Example

```js
const {UsernotesData} = require('toolbox-api');

// Get your data however you want
const data = '{"ver":6, ...}';

// Create a UsernotesData instance
const usernotes = new UsernotesData(data);

// Add a usernote to a user
usernotes.addUsernote('someone', 'wears the freshest clothes');

// Directly modify the underlying usernote objects
usernotes.users['someone'].ns[0].n += '... or do they?';

// Get all the usernotes for a user, with more helpful object keys
usernotes.notesForUser('someone')
//=> [
//     {
//       text: 'wears the freshest clothes... or do they?',
//       timestamp: 2020-03-03T02:13:10.042Z,
//       link: undefined,
//     },
//     ...
//   ]

// Generate compressed JSON to write back to the wiki page
JSON.stringify(usernotes)
//=> '{"ver":6, ...}'
```

## License

[MIT &copy; eritbh](/LICENSE)
