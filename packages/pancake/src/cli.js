/***************************************************************************************************************************************************************
 *
 * Running pancake inside a cli
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
const Path = require( 'path' );
// const Fs = require( 'fs' );


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Module imports
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const { ExitHandler, CheckNPM, Cwd, Size } = require( './helpers' );
const { InstallPlugins, RunPlugins } = require( './plugins' );
const { GetModules, GetPlugins } = require( './modules' );
const { Log, Style, Loading } = require( './logging' );
const { ParseArgs } = require( './parse-arguments' );
const { CheckModules } = require( './conflicts' );
const { Settings } = require( './settings' );


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Default export
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * Running the program in CLI
 *
 * @param  {array} argv - The arguments passed to node
 */
module.exports.init = ( argv = process.argv ) => {
	const pkg = require( Path.normalize(`${ __dirname }/../package.json`) );

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Verbose flag
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	let verbose = false;
	if( process.argv.indexOf('-v') !== -1 || process.argv.indexOf('--verbose') !== -1 ) {
		Log.verboseMode = true;
	}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Check npm version
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	const npmVersion = CheckNPM();

	//npm 3 and higher is required as below will install dependencies inside each module folder
	if( !npmVersion ) {
		Log.error(`Pancake only works with npm 3 and later.`);
		Log.space();
		process.exit( 1 );
	}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Get global settings
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	let SETTINGS = Settings.GetGlobal();


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Parsing cli arguments
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	const ARGS = ParseArgs( SETTINGS, argv );

	//arg overwrites
	SETTINGS.npmOrg = ARGS.org;
	SETTINGS.plugins = ARGS.plugins;
	SETTINGS.ignorePlugins = ARGS.ignorePlugins.length ? ARGS.ignorePlugins : SETTINGS.ignorePlugins;


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Set global settings
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	if( ARGS.set.length > 0 ) {
		SETTINGS = Settings.SetGlobal( __dirname, SETTINGS, ...ARGS.set );

		Loading.stop();
		Log.space();
		process.exit( 0 ); //finish after
	}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Display help
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	if( ARGS.help ) {
		Log.info(`Pancake help`);
		Loading.stop();

		if( Size().width > 110 ) { //only show if we have enough space
			console.log( Style.yellow(`
                                                 ${ Style.white(`.,;+@@@@@@@@@#+;,
                                              #+':               .+@@;
                                            @\`                       \`##
                                           @+   \`;@@#+'      ,+@@@@@@@@@@`) }
                                 \`,;''+#@@++${ Style.white(`@     .,;@;    @@@@@@@@@@@@@ #@@@@`) }+:\`
                          \`,'@@+,\`   :;:;+'${ Style.white(`\`:@@;.       \`@@@@@@@@@@@+..@@@@@@@@@@@`) }#;\`
                       +@#,        \`\`.,.  ${ Style.white(`@@.+ @@@':. \`;@#  ;.,+@@@@@@@@@@@@@@@@@@@@@@@@@@@`) }'
                   ,#@,     \`.\`        ${ Style.white(`#@.#@@@@@@#@@@ \`: ;@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.@`) }   ;@'
               .@@@;:,\`  .;++;,      ${ Style.white(`#@#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`) }        \`   \`@:
             @@,   ,;::;;,.        ${ Style.white(`@@@@@@@@@@@@#':'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`) }    \`  \`,\`  \`  .#+\`
           '@.   ..   ,'+':\`      ${ Style.white(`@@@@@@@@'\`        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`) }\'      .,  .\`     ,@'
        ,@+       '.               ${ Style.white(`@@@@,           ,@@@@@@:    .#@@@@@@@@@@@@@@@@@@@@@+`) }                  ;@
      ;@,                                           ${ Style.white(`#@+\`          .@@@@@+     .+@@@#+@`) };                    @
      @+      .@'++                                                 ${ Style.white(`:@@@`) }                                  @#
         +#@,          :;:':':                     - pancake -        ${ Style.white(`@@@`) }                         \`:'':  \`@'
       '@@@@@@@@@@,                                                    ${ Style.white(`@@`) }:      '\`  ,'+##@@@@@@@@@.    \`\`
   \`@@\`   \`::,';:;#@@@@@@#;.  \`,;++',                               .' ${ Style.white(`@@@`) }  ,@@@,@@@@@@@#+':,\`             ,+#
  :@\`                    .#@@@@@@+#@@@@@@@@@@@@@@#+''+++@@@@@@@+#+++   ${ Style.white(`@@@@`) };,,;,\`                             @
  \`@:                                   \`:;+#@@##@@@+;,\`              ${ Style.white(`#@';@@`) }                                 #,
    ;#+;            \`\`\`                                               ${ Style.white(`@@+@@#`) }                             .+'.
         '@@@@@@@@@@@@@@@@#.                             \`\`           ${ Style.white(`#@@@#`) }     \`\`         \`#@@@@@@:'@@@@@@,
                   \`\`...,,+@@@@@@@@'.\`.,;''#@@@;    \`'@@@@@@@@@@@@@@#:     @@@#'\` \`###@@#'.        ,;;,::
                                     ,@@@@@@@@#@@@:@@@@#;.`));
		}

		console.log(
			Style.yellow(`\n  ( ^-^)_旦\n\n`) +
			`  🥞  Pancake is an utility to make working with npm modules for the frontend sweet and seamlessly.\n\n` +
			`  It will check your peerDependencies for conflicts and comes with plugins to compile the contents\n` +
			`  for you and lists all available modules for you to select and install.\n\n` +
			`  ${ Style.gray(`${ String.repeat(`-`, Size().width > 114 ? 110 : Size().width - 4 ) }\n\n`) }` +
			`  ${ Style.bold(`PATH`) }            - Run pancake in a specific path and look for pancake modules there.\n` +
			`    $ ${ Style.yellow(`pancake /Users/you/project/folder`) }\n\n` +
			`  ${ Style.bold(`SETTINGS`) }        - Set global settings. Available settings are: ${ Style.yellow( Object.keys( SETTINGS ).join(', ') ) }.\n` +
			`    $ ${ Style.yellow(`pancake --set npmOrg "@yourOrg @anotherOrg"`) }\n` +
			`    $ ${ Style.yellow(`pancake --set ignorePlugins @gold.au/pancake-sass,@gold.au/pancake-svg`) }\n\n` +
			`  ${ Style.bold(`ORG`) }             - Change the org scope of the pancake modules you like to use.\n` +
			`    $ ${ Style.yellow(`pancake --org "@your.org"`) }\n\n` +
			`  ${ Style.bold(`PLUGINS`) }         - Temporarily turn off all plugins.\n` +
			`    $ ${ Style.yellow(`pancake --noplugins`) }\n\n` +
			`  ${ Style.bold(`IGNORED PLUGINS`) } - Prevent a certain plugin(s) from being installed and run.\n` +
			`    $ ${ Style.yellow(`pancake --ignore @gold.au/pancake-js,@gold.au/pancake-sass`) }\n\n` +
			`  ${ Style.bold(`DON’T SAVE`) }      - Prevent pancake to save it’s settings into your package.json.\n` +
			`    $ ${ Style.yellow(`pancake --nosave`) }\n\n` +
			`  ${ Style.bold(`HELP`) }            - Display the help (this screen).\n` +
			`    $ ${ Style.yellow(`pancake --help`) }\n\n` +
			`  ${ Style.bold(`VERSION`) }         - Display the version of pancake.\n` +
			`    $ ${ Style.yellow(`pancake --version`) }\n\n` +
			`  ${ Style.bold(`VERBOSE`) }         - Run pancake in verbose silly mode\n` +
			`    $ ${ Style.yellow(`pancake --verbose`) }`
		);

		Log.space();
		process.exit( 0 ); //finish after
	}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Finding the current working directory
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	const pkgPath = Cwd( ARGS.cwd );


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Get local settings
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	let SETTINGSlocal = Settings.GetLocal( pkgPath );


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Display version
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	if( ARGS.version ) {
		console.log(`v${ pkg.version }`);

		if( ARGS.verbose ) { //show some space if we had verbose enabled
			Log.space();
		}

		process.exit( 0 ); //finish after
	}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Show banner
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	Log.info(`PANCAKE MIXING THE BATTER`);


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Get all modules data
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	Loading.start();

	GetModules( pkgPath, SETTINGS.npmOrg )
		.catch( error => {
			Log.error(`Reading all package.json files bumped into an error: ${ error }`);
			Log.error( error );

			process.exit( 1 );
		})
		.then( allModules => { //once we got all the content from all package.json files
			Log.verbose(`Gathered all modules:\n${ Style.yellow( JSON.stringify( allModules ) ) }`);

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Check for conflicts
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
			if( allModules.length < 1 ) {
				Log.info(`No modules found 😬`);
				Loading.stop();
			}
			else {
				const conflicts = CheckModules( allModules );

				if( conflicts.conflicts ) {
					Log.error( Style.red( conflicts.message ) );

					process.exit( 1 ); //error out so npm knows things went wrong
				}
				else {
					Log.ok(`All modules(${ allModules.length }) without conflict 💥`);
				}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Install all plugins
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
				let plugins = [];   //gather all plugins we have to run later
				let installed = []; //an array to be filled with a promise from InstallPlugins

				if( SETTINGSlocal.plugins === false || SETTINGS.plugins === false ) {
					Loading.stop();

					Log.verbose(`Skipping plugins`);
				}
				else {
					const allPlugins = GetPlugins( allModules );

					allPlugins.map( plugin => { //filtering out ignored plugins
						if(
							SETTINGSlocal.ignore.filter( ignore => ignore === plugin ).length === 0 &&
							SETTINGS.ignorePlugins.filter( ignore => ignore === plugin ).length === 0
						) {
							plugins.push( plugin );
						}
					});

					installed.push( InstallPlugins( plugins, pkgPath ) ); //add the promise to the installed array
				}

				Promise.all( installed ) //if we had plugins installed, wait until they are finished
					.catch( error => {
						Log.error( error );

						process.exit( 1 );
					})
					.then( data => {


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Run all plugins
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
					RunPlugins( pkg.version, plugins, pkgPath, allModules, SETTINGSlocal, SETTINGS )
						.catch( error => {
							Loading.stop();

							Log.error( error );
						})
						.then( ( settings ) => {
							Loading.start();


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Save local settings into host package.json
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
							if( SETTINGSlocal['auto-save'] && !ARGS.nosave ) {

								//merge all plugin settings
								settings.map( setting => {
									Object.keys( setting ).map( key => {
										SETTINGSlocal[ key ] = Object.assign( setting[ key ], SETTINGSlocal[ key ] );
									});
								});

								Settings.SetLocal( SETTINGSlocal, pkgPath ) //let’s save all settings
									.catch( error => {
										Log.error(`Saving settings caused an error: ${ error }`);

										process.exit( 1 );
									})
									.then( SETTINGSlocal => {
										Log.ok(`SETTINGS SAVED`); //all done!

										Log.done(`YOUR PANCAKE IS READY ( ˘▽˘)っ旦`); //all done!
								});
							}
							else {
								Log.done(`YOUR PANCAKE IS READY ( ˘▽˘)っ旦`); //all done!
							}
					});

				});

			}
	});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Adding some event handling to exit signals
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	process.on( 'exit', ExitHandler.bind( null, { withoutSpace: false } ) );              //on closing
	process.on( 'SIGINT', ExitHandler.bind( null, { withoutSpace: false } ) );            //on [ctrl] + [c]
	process.on( 'uncaughtException', ExitHandler.bind( null, { withoutSpace: false } ) ); //on uncaught exceptions
}
