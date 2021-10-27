/***************************************************************************************************************************************************************
 *
 * dependencies.js unit tests
 *
 * @file - pancake-syrup/src/dependencies.js
 *
 **************************************************************************************************************************************************************/

const { AddDeps } = require("../src/dependencies");

describe("AddDeps", () => {
	test("Should list the dependencies", () => {
		const dependencies = {
			"@gold.au/core": "^0.1.0",
			"@gold.au/link-list": "^0.1.0"
		};
		const installed = new Map([
			["@gold.au/testmodule1", "11.0.1"],
			["@gold.au/testmodule2", "11.0.0"],
			["@gold.au/testmodule3", "11.0.0"]
		]);

		const result = AddDeps(dependencies, installed, 10);
		expect(result.breakage).toBe(false);
		expect(result.lines.map(l => l.line)).toEqual(
			expect.arrayContaining([
				expect.stringMatching(/core\s+\^0/),
				expect.stringMatching(/link-list\s+\^0/)
			])
		);
		expect(result.breaking).toHaveLength(0);
	});

	test("Should nicely align the output", () => {
		const dependencies = {
			"@gold.au/core": "^0.1.0",
			"@gold.au/link-list": "^0.1.0"
		};
		const installed = new Map();

		// Longest name 10 chars
		const result10 = AddDeps(dependencies, installed, 10);
		expect(result10.lines.map(l => l.line)).toEqual(
			expect.arrayContaining([
				expect.stringMatching(/core\s{7}\^0/),
				expect.stringMatching(/link-list\s{2}\^0/)
			])
		);

		// Longest name 40 chars
		const result40 = AddDeps(dependencies, installed, 40);
		expect(result40.lines.map(l => l.line)).toEqual(
			expect.arrayContaining([
				expect.stringMatching(/core\s{37}\^0/),
				expect.stringMatching(/link-list\s{32}\^0/)
			])
		);
	});

	test("Should highlight installed dependencies", () => {
		const dependencies = {
			"@gold.au/core": "^0.1.0",
			"@gold.au/link-list": "^0.1.0"
		};
		const installed = new Map([["@gold.au/core", "11.0.1"]]);

		const result = AddDeps(dependencies, installed, 20);

		// core is already installed
		expect(result.lines[0].line).toEqual(expect.stringMatching(/core/));
		expect(result.lines[0].line).toEqual(expect.stringMatching(/installed/));

		// link-list is NOT installed
		expect(result.lines[1].line).toEqual(expect.stringMatching(/link-list/));
		expect(result.lines[1].line).toEqual(
			expect.not.stringMatching(/installed/)
		);
	});

	test("Should report breaking dependencies", () => {
		const dependencies = {
			"@gold.au/safe": "^1.0.1",
			"@gold.au/breaking": "^2.0.0"
		};
		const installed = new Map([
			["@gold.au/safe", "1.1.0"],
			["@gold.au/breaking", "3.0.0"]
		]);

		const result = AddDeps(dependencies, installed, 20);
		expect(result.breakage).toBe(true);
		expect(result.breaking).toEqual(["@gold.au/breaking@^2.0.0"]);
	});
});
