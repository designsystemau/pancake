/***************************************************************************************************************************************************************
 *
 * prettiness.js unit tests
 *
 * @file - pancake-syrup/src/prettiness.js
 *
 **************************************************************************************************************************************************************/


const { HighlightDiff, Headline } = require( '../src/prettiness' );

describe('HighlightDiff', () => {
	test('Should highlight the mayor version', () => {
		expect( HighlightDiff( '1.0.0', '2.0.0' ) ).toBe('\u001b[35m2.0.0\u001b[39m');
	});

	test('Should highlight the minor version', () => {
		expect( HighlightDiff( '1.0.0', '1.1.0' ) ).toBe('1.\u001b[35m1.0\u001b[39m');
	});

	test('Should highlight the patch version', () => {
		expect( HighlightDiff( '1.0.0', '1.0.10' ) ).toBe('1.0.\u001b[35m10\u001b[39m');
	});

	test('Should not highlight the same version', () => {
		expect( HighlightDiff( '1.0.0', '1.0.0' ) ).toBe('1.0.0');
	});
});

// FIXME: these tests fail when run in CI (reproduce with `CI=true yarn test`)
describe.skip('Headline', () => {
test('Should output the correct array with the correct ansi codes', () => {
	expect( Headline( 'Headline', 'Subline', 20 ) ).toMatchObject([
		{
			type: 'separator',
			line: '\u001b[2m \u001b[22m',
		},
		{
			type: 'separator',
			line: '\u001b[2m\u001b[0m\u001b[44m\u001b[1m\u001b[36m  ═══╡ Headline ╞═══  \u001b[39m\u001b[2m\u001b[49m\u001b[0m\u001b[22m',
		},
		{
			type: 'separator',
			line: '\u001b[2m       \u001b[0m\u001b[36mSubline\u001b[39m\u001b[0m\u001b[22m',
		},
	]);
});

test('Should output the correct center alignment', () => {
	expect( Headline( 'Headline', 'Subline', 30 ) ).toMatchObject([
		{
			type: 'separator',
			line: '\u001b[2m \u001b[22m',
		},
		{
			type: 'separator',
			line: '\u001b[2m\u001b[0m\u001b[44m\u001b[1m\u001b[36m  ════════╡ Headline ╞════════  \u001b[39m\u001b[2m\u001b[49m\u001b[0m\u001b[22m',
		},
		{
			type: 'separator',
			line: '\u001b[2m            \u001b[0m\u001b[36mSubline\u001b[39m\u001b[0m\u001b[22m',
		},
	]);
});


test(`Should build a headline even with a smaller table than the headline`, () => {
	expect( Headline( 'Headline', 'Subline', 5 ) ).toMatchObject([
		{
			type: 'separator',
			line: '\u001b[2m \u001b[22m',
		},
		{
			type: 'separator',
			line: '\u001b[2m\u001b[0m\u001b[44m\u001b[1m\u001b[36m  ═╡ Headline ╞═  \u001b[39m\u001b[2m\u001b[49m\u001b[0m\u001b[22m',
		},
		{
			type: 'separator',
			line: '\u001b[2m\u001b[0m\u001b[36mSubline\u001b[39m\u001b[0m\u001b[22m',
		},
	]);
});
});
