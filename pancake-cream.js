#!/usr/bin/env node

/***************************************************************************************************************************************************************
 *
 * CREAM 👀
 *
 * @repo    - https://github.com/AusDTO/uikit-pancake
 * @author  - Dominik Wilkowski
 * @license - https://raw.githubusercontent.com/AusDTO/uikit-pancake/master/LICENSE (MIT)
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const Program = require('commander');
const Inquirer = require('inquirer');
const Request = require('request');
const Semver =  require('semver');
const Chalk = require('chalk');
const Path = require(`path`);


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// CLI program
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
let pkgPath = Path.normalize(`${ process.cwd() }/`); //default value of the pkgPath path

Program
	.usage( `[command] <input> <option>` )
	.arguments('<pkgPath>')
	.action( pkgPathArgument => {
		pkgPath = pkgPathArgument; //overwriting default value with user input
	})
	.option( `-v, --verbose`, `Run the program in verbose mode` )
	.parse( process.argv );


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Globals
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const pancakes = require(`./pancake-utilities.js`)( Program.verbose );
const Log = pancakes.Log;
const UIKITurl = `https://raw.githubusercontent.com/govau/uikit/master/uikit.json`;


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Reusable functions
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * Get remote json file and return it's data
 *
 * @param  {string} url - The URL of the remote json file
 *
 * @return {object}     - The parsed object of the json content
 */
const GetRemoteJson = url => {
	return new Promise( ( resolve, reject ) => {
		Request.get(
			{
				url: url,
				json: true,
				headers: {
					'User-Agent': 'pancake',
				},
			}, ( error, result, data ) => {
				if( error ) {
					Log.error( error );

					reject( error );
				}
				else if( result.statusCode !== 200 ) {
					Log.error(`Status code of request to ${ Chalk.yellow( url ) } returned: ${ Chalk.yellow( result.statusCode ) } `);

					reject( result.statusCode );
				}
				else {
					resolve( data );
				}
			}
		);
	});
};


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Cream
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
Log.info(`PANCAKE PUTTING THE CREAM ON TOP`);

let allPromises = []; //collect both promises

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Get uikit.json
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
Log.verbose(`Getting uikit.json from: ${ Chalk.yellow( UIKITurl ) }`);

const gettingUikit = GetRemoteJson( UIKITurl ); //get the uikig json
let UIKIT = {};                                 //for uikit data in a larger scope

gettingUikit.then( data => {
	UIKIT = data; //adding the data of uikit.json into our scoped variable
});

allPromises.push( gettingUikit ); //keep track of all promises


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Get uikit modules
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
let allModules = {}; //for all modules in a larger scope

const allPackages = pancakes.GetPackages( pkgPath ); //read all packages and return an object per module

allPackages.then( data => {
	allModules = data; //adding all uikit modules into our scoped variable
});

allPromises.push( allPackages ); //keep track of all promises


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Start compiling what we have vs what we could have
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
Promise.all( allPromises )
	.catch( error => {
		Log.error(`An error occurred getting the basics: ${ error }`);
	})
	.then( () => {
		let choices = [];          //to be filled with all choices we have
		let installed = new Map(); //to be filled with installed modules

		//convert installed modules array into map for better querying
		for( const modulePackage of allModules ) {
			installed.set( modulePackage.name, modulePackage.version );
		}

		Log.verbose(
			`Got all data from uikit.json and installed modules:\n` +
			`Installed: ${ Chalk.yellow( JSON.stringify( [ ... installed ] ) ) }\n` +
			`UIKIT:     ${ Chalk.yellow( JSON.stringify( UIKIT ) ) }`
		);

		//iterate over all uikit modules
		for( const module of Object.keys( UIKIT ) ) {
			const thisChoice = {};                            //let's build this choice out
			const installedVersion = installed.get( module ); //the installed version of this module

			thisChoice.name = `${ module } v${ UIKIT[ module ] }`; //we add each module of the uikit in here
			thisChoice.value = {
				[ module ]: UIKIT[ module ], //let's make sure we can parse the answer
			};

			if( installedVersion.length ) { //in case we have this module already installed, let's check if you can upgrade
				if(
					Semver.gte( UIKIT[ module ], installedVersion ) && //if this version is newer than the installed one
					!Semver.eq( UIKIT[ module ], installedVersion )    //and not equal
				) {
					thisChoice.name = `${ thisChoice.name } - ${ Chalk.green('*NEWER VERSION AVAILABLE*') }`; //this is actually an upgrade

					choices.push({ //this is the module version you got installed
						name: `${ module } v${ installedVersion }`,
						value: {
							[ module ]: installedVersion,
						},
						checked: true,
					});
				}

				if( Semver.eq( UIKIT[ module ], installedVersion ) ) { //if this version is the same as what's installed
					thisChoice.checked = true; //you got the latest
				}
			}

			choices.push( thisChoice ); //adding to all checkboxes
		}

		Log.space(); //prettiness

		Inquirer.prompt([
			{
				type: 'checkbox',
				message: 'Select your UI-Kit modules',
				name: 'modules',
				choices: choices,
				validate: ( answer ) => {
					if( answer.length < 1 ) {
						return 'You must choose at least one module to install.';
					}

					return true;
				}
			}
		]).then(( modules ) => {
			console.log(JSON.stringify(modules, null, '  ')); //let's work from here :)
		});
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Adding some event handling to exit signals
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
process.on( 'exit', pancakes.ExitHandler.bind( null, { now: false } ) );              //on closing
process.on( 'SIGINT', pancakes.ExitHandler.bind( null, { now: true } ) );             //on [ctrl] + [c]
process.on( 'uncaughtException', pancakes.ExitHandler.bind( null, { now: true } ) );  //on uncaught exceptions