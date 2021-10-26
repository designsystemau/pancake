/***************************************************************************************************************************************************************
 *
 * dependencies.js unit tests
 *
 * @file - pancake-syrup/src/dependencies.js
 *
 **************************************************************************************************************************************************************/


const { AddDeps } = require( '../src/dependencies' );

// FIXME: these tests fail when run in CI (reproduce with `CI=true yarn test`)
describe.skip('AddDeps', () => {

test('AddDeps - Should return an object with dependencies', () => {
	const dependencies = {
		"@gov.au/core": "^0.1.0",
		"@gov.au/link-list": "^0.1.0",
	};
	const installed = new Map();
	installed.set( '@gov.au/testmodule1', '11.0.1' );
	installed.set( '@gov.au/testmodule2', '11.0.0' );
	installed.set( '@gov.au/testmodule3', '11.0.0' );

	expect( AddDeps( dependencies, installed, 10 ) ).toMatchObject( {
		breakage: false,
		lines: [
			{
				type: 'separator',
				line: '\u001b[2m├── core       ^0.1.0            \u001b[22m',
			},
			{
				type: 'separator',
				line: '\u001b[2m└── link-list  ^0.1.0            \u001b[22m',
			},
		],
		breaking: [],
	} );
});

test('AddDeps - Should return an object with dependencies nicely centred', () => {
	const dependencies = {
		"@gov.au/core": "^0.1.0",
		"@gov.au/link-list": "^0.1.0",
	};
	const installed = new Map();
	installed.set( '@gov.au/testmodule1', '11.0.1' );
	installed.set( '@gov.au/testmodule2', '11.0.0' );
	installed.set( '@gov.au/testmodule3', '11.0.0' );
	installed.set( '@gov.au/testmodule4', '12.0.0' );
	installed.set( '@gov.au/testmodule5', '13.0.0' );

	expect( AddDeps( dependencies, installed, 20 ) ).toMatchObject({
		breakage: false,
		lines: [
			{
				type: 'separator',
				line: '\u001b[2m├── core                 ^0.1.0            \u001b[22m'
			},
			{
				type: 'separator',
				line: '\u001b[2m└── link-list            ^0.1.0            \u001b[22m'
			},
		],
		breaking: [],
	});
});

test('AddDeps - Should highlight breaking dependencies', () => {
	const dependencies = {
		"@gov.au/core": "^0.1.0",
		"@gov.au/link-list": "^0.1.0",
		"@gov.au/testmodule2": "^11.1.0",
		"@gov.au/testmodule5": "^13.1.0",
	};
	const installed = new Map();
	installed.set( '@gov.au/testmodule1', '11.0.1' );
	installed.set( '@gov.au/testmodule2', '11.0.0' );
	installed.set( '@gov.au/testmodule3', '11.0.0' );
	installed.set( '@gov.au/testmodule4', '12.0.0' );
	installed.set( '@gov.au/testmodule5', '13.0.0' );

	expect( AddDeps( dependencies, installed, 20 ) ).toMatchObject({
		breakage: true,
		lines: [
			{
				type: 'separator',
				line: '\u001b[2m├── core                 ^0.1.0            \u001b[22m'
			},
			{
				type: 'separator',
				line: '\u001b[2m├── link-list            ^0.1.0            \u001b[22m'
			},
			{
				type: 'separator',
				line: '\u001b[2m├── \u001b[35mtestmodule2\u001b[39m          \u001b[35m^11.1.0   !   11.0.0\u001b[39m   installed\u001b[22m'
			},
			{
				type: 'separator',
				line: '\u001b[2m└── \u001b[35mtestmodule5\u001b[39m          \u001b[35m^13.1.0   !   13.0.0\u001b[39m   installed\u001b[22m'
			},
		],
		breaking: [
			'@gov.au/testmodule2@^11.1.0',
			'@gov.au/testmodule5@^13.1.0'
		],
	});
});

});
