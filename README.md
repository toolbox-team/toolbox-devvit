# toolbox-api

Helpers for interfacing with Reddit Moderator Toolbox settings and usernotes.

## Installation

This library is still under initial development, but dev builds are generated automatically and can be installed with the following commands:

```bash
# With Yarn:
$ yarn add --production https://github.com/Geo1088/toolbox-api.git#builds/master
# With npm:
$ npm install --save --production https://github.com/Geo1088/toolbox-api.git#builds/master
```

## Usage Example

```js
const {UsernotesData} = require('toolbox-api');

// Get your data however you want
const data = '{"ver":6,"constants":{"users":["geo1088"],"warnings":["gooduser"]},"blob":"eJwNi0EKgDAMBL9S9tyDVSIhXxEPRYsKtYKNeJD+3VxmYdj5sKUrdMyQD6VCJhsIUtTqojrdk1v2I+dU1d2G+NyxaIWHQgJxTzwSdR4nxJitzX5YmRayz2uyza39a54eYg=="}';

// Create a UsernotesData instance
const usernotes = new UsernotesData(data);

// Add a usernote to a user
usernotes.addUsernote('geo1088', 'wears the freshest clothes');

// Directly modify the underlying usernote objects
usernotes.users['geo1088'].ns[0].n += '... or does he?';

// Get all the usernotes for a user, with more helpful object keys
usernotes.notesForUser('geo1088')
//=> [
//     {
//       text: 'eats at the chillest restaurants... or does he?',
//       timestamp: 2020-02-24T23:22:30.000Z,
//       link: 'https://www.reddit.com/comments/3d85c5'
//     },
//     {
//       text: 'wears the freshest clothes',
//       timestamp: 2020-03-03T02:13:10.042Z,
//       link: undefined
//     }
//   ]

// Generate compressed JSON to write back to the wiki page
JSON.stringify(usernotes)
//=> '{"ver":6,"constants":{"users":["geo1088"],"warnings":["gooduser"]},"blob":"eJw9zcEKwjAMBuBXCTmX0m1Gai8+iHgoW7RCXaGp7DD67kYFL3/IT/iy453L4LzHsOMqGC46MCDHJhAbtMQwp0fOLA2qRnzVuDax1kKpsBQWSHxGgw3DQH4kfyRyBp8YNLNS2UyLp5n0ZtOym9+HjWOVr39TN338ORfd5Y9Noxvo5Kw7jP3a+xulwTM1"}'
```

## License

[MIT &copy; Geo1088](/LICENSE)
