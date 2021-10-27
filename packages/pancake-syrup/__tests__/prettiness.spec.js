/***************************************************************************************************************************************************************
 *
 * prettiness.js unit tests
 *
 * @file - pancake-syrup/src/prettiness.js
 *
 **************************************************************************************************************************************************************/

const StripAnsi = require('strip-ansi');

const { HighlightDiff, Headline } = require('../src/prettiness');

describe('HighlightDiff', () => {
	test('Should highlight the mayor version', () => {
		expect(HighlightDiff('1.0.0', '2.0.0')).toBe('\u001b[35m2.0.0\u001b[39m');
	});

	test('Should highlight the minor version', () => {
		expect(HighlightDiff('1.0.0', '1.1.0')).toBe('1.\u001b[35m1.0\u001b[39m');
	});

	test('Should highlight the patch version', () => {
		expect(HighlightDiff('1.0.0', '1.0.10')).toBe('1.0.\u001b[35m10\u001b[39m');
	});

	test('Should not highlight the same version', () => {
		expect(HighlightDiff('1.0.0', '1.0.0')).toBe('1.0.0');
	});
});

describe('Headline', () => {
	test('Should generate the correct headlines', () => {
		const lines = Headline('Headline', 'Secondary headline', 20);

		expect(StripAnsi(lines[0].line)).toEqual(' ');
		expect(StripAnsi(lines[1].line)).toEqual('  ═══╡ Headline ╞═══  ');
		expect(StripAnsi(lines[2].line)).toEqual('  Secondary headline');
		expect(lines).toHaveLength(3);
	});

	test('Should output the correct center alignment', () => {
		const lines = Headline('Headline', 'Secondary line', 40);

		expect(StripAnsi(lines[1].line)).toEqual(
			'  ═════════════╡ Headline ╞═════════════  '
		);
		expect(StripAnsi(lines[2].line)).toEqual('              Secondary line');
	});

	test(`Should build a headline even with a smaller table than the headline`, () => {
		const lines = Headline('Headline', 'Secondary headline', 5);
		expect(StripAnsi(lines[1].line)).toEqual('  ═╡ Headline ╞═  ');
		expect(StripAnsi(lines[2].line)).toEqual('Secondary headline');
	});
});
