import test from 'ava';

import {compressBlob, decompressBlob, RawUsernotes} from './RawUsernotes';
import {Usernotes} from './Usernotes';

test('constructor: accept empty input', t => {
	t.assert(
		new Usernotes() instanceof Usernotes,
		'passing nothing to Usernotes constructor should return a Usernotes instance',
	);

	t.assert(
		new Usernotes('') instanceof Usernotes,
		'passing empty string to Usernotes constructor should return a Usernotes instance',
	);
});

test.todo('constructor: most other things');

test.todo('get: most other things');

test('get: read and merge existing entries for lowercased usernames', t => {
	let rawUsernotes: RawUsernotes = {
		ver: 6,
		constants: {
			users: ['someMod'],
			warnings: [],
		},
		blob: compressBlob({
			someuser: {
				ns: [
					{
						m: 0,
						n: 'test 0',
						t: 0,
					},
					{
						m: 0,
						n: 'test 2',
						t: 2,
					},
				],
			},
			someUser: {
				ns: [
					{
						m: 0,
						n: 'test 1',
						t: 1,
					},
					{
						m: 0,
						n: 'test 3',
						t: 3,
					},
				],
			},
		}),
	};
	let usernotes = new Usernotes(JSON.stringify(rawUsernotes));

	let notes = usernotes.get('someUser');

	// expect notes under both variants of the username to be present and sorted
	t.like(notes, [
		{
			text: 'test 3',
		},
		{
			text: 'test 2',
		},
		{
			text: 'test 1',
		},
		{
			text: 'test 0',
		},
	], 'notes from both spellings of the username should be returned in order');

	// expect the entry under the lowercased username to be gone when saving
	const newUsersData = decompressBlob(usernotes.toJSON().blob);
	t.false(
		'someuser' in newUsersData,
		'lowercased spelling of the username should be removed from usernotes object',
	);
});

test.todo('add');

test.todo('toJSON');

test.todo('toString');
