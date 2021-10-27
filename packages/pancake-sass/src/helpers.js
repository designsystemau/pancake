/***************************************************************************************************************************************************************
 *
 * Helper methods
 *
 * @repo    - https://github.com/designsystemau/pancake
 * @author  - Dominik Wilkowski
 * @license - https://raw.githubusercontent.com/designsystemau/pancake/master/LICENSE (MIT)
 *
 **************************************************************************************************************************************************************/

'use strict';

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// const Path = require( 'path' );
// const Fs = require( 'fs' );

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Included modules
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// import { Log, Style } = require( '@gold.au/pancake' );

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Default export
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * Remove duplicated lines
 *
 * @param  {string} content - A bunch of lines that COULD have duplicates
 *
 * @return {string}         - Removed duplicate lines
 */
module.exports.StripDuplicateLines = (content) => {
	let lines = content.split(`\n`); //split into each line

	if (lines[lines.length - 1] === '') {
		//remove empty line at the end
		lines.pop();
	}

	let sortedLines = [...new Set(lines)]; //make each line unique

	return sortedLines.join(`\n`);
};
