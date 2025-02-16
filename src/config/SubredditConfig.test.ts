import test from 'ava';
import {DEFAULT_CONFIG} from './config';
import {SubredditConfig} from './SubredditConfig';

test('constructor: accept empty input', t => {
	t.assert(
		new SubredditConfig() instanceof SubredditConfig,
		'passing nothing to SubredditConfig constructor should return a SubredditConfig instance',
	);

	t.assert(
		new SubredditConfig('') instanceof SubredditConfig,
		'passing empty string to SubredditConfig constructor should return a SubredditConfig instance',
	);
});

test('constructor: results of passing in nothing and empty input are identical', t => {
	const configFromNothing = new SubredditConfig();
	const configFromEmpty = new SubredditConfig('');

	t.deepEqual(
		configFromNothing.toJSON(),
		configFromEmpty.toJSON(),
		'SubredditConfig initiated with nothing vs empty should be identical',
	);
});

test('constructor: on empty input, the default config is returned', t => {
	const config = new SubredditConfig();
	const configAsJson = config.toJSON();

	t.deepEqual(
		configAsJson,
		DEFAULT_CONFIG,
		'SubredditConfig initiated with nothing should return default config',
	);
});

test.todo('getAllNoteTypes');
test.todo('getNoteType');
test.todo('toJSON');
test.todo('toString');
