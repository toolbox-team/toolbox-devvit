import test from 'ava';
import {LATEST_KNOWN_CONFIG_SCHEMA} from '../helpers/config';
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

test('constructor: on empty input, each element other than ver is falsy', t => {
	const config = new SubredditConfig();
	const configAsJson = config.toJSON();

	for (const configItem in configAsJson) {
		if (configItem !== 'ver') {
			t.falsy(
				configAsJson[configItem],
				`expected ${configItem} to be falsy when passing nothing to SubredditConfig constructor`,
			);
		}
	}

	t.is(
		configAsJson.ver,
		LATEST_KNOWN_CONFIG_SCHEMA,
		'passing nothing to SubredditConfig should result in an empty config at the latest version',
	);
});

test.todo('getAllNoteTypes');
test.todo('getNoteType');
test.todo('toJSON');
test.todo('toString');
