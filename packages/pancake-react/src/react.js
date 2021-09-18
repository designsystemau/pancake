/***************************************************************************************************************************************************************
 *
 * Move react files
 *
 * @repo    - https://github.com/designsystemau/pancake
 * @author  - Dominik Wilkowski and Alex Page
 * @license - https://raw.githubusercontent.com/designsystemau/pancake/master/LICENSE (MIT)
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Included modules
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const { Log, Style, ReadFile, WriteFile } = require( '@gold.au/pancake' );


/**
 * Get react file from module and write to disk
 *
 * @param  {string} from     - Where is the module so we can read from there
 * @param  {string} to       - Where shall we write the module to
 * @param  {string} tag      - The tag to be added to the top of the file
 *
 * @return {promise object}  - The js code either minified or bare bone
 */
module.exports.HandleReact = ( from, to, tag ) => {
	return new Promise( ( resolve, reject ) => {
		ReadFile( from ) //read the module
			.catch( error => {
				Log.error(`Unable to read file ${ Style.yellow( from ) }`);
				Log.error( error );

				reject( error );
			})
			.then( ( code ) => WriteFile( to, code ) //write the generated content to file and return its promise
					.catch( error => {
						Log.error( error );

						reject( error );
					})
					.then( () => {
						resolve( code );
				})
			);
	});
};

