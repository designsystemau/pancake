Pancake
=======

> Pancake is a tool to make working with npm on the front end easy and sweet.

![The Pancake tool](https://raw.githubusercontent.com/govau/pancake/master/assets/pancake.png)

[Npm wrote about](http://blog.npmjs.org/post/101775448305/npm-and-front-end-packaging) the challenges frontend developers face when trying to use npm. Pancake is addressing those by embracing the idea of small individually versioned independent modules. Interdependencies is what npm does really well and Pancake will help you keep them flat and error out on conflicts. [Read more about our solution](https://medium.com/dailyjs/npm-and-the-front-end-950c79fc22ce)

Pancake will check your `"peerDependencies"` for conflicts and comes with plugins to compile the contents of your modules for you and lists all available modules for you to select and install.


----------------------------------------------------------------------------------------------------------------------------------------------------------------

## Getting started

Pancake comes installed with GOLD Design System components. To know if you have `pancake` installed, check your `package.json` file for a `"pancake": { ... }` object. You can configure this at [Pancake settings](#settings) section.

If you have issues with using SASS globals in a ReactJS project, please check out the [Design System React starter repo](https://github.com/govau/design-system-starter-react) for an example.

**[⬆ back to top](#contents)**

----------------------------------------------------------------------------------------------------------------------------------------------------------------

## Reference

### Pancake module object

To make sure Pancake can detect your module amongst the other hundred npm packages you have to add the `pancake-module` object into your `pancake` object.

```diff
{
  "name": "your-module-name",
  "version": "1.0.0",
  "description": "Your description",
+  "pancake": {
+    "pancake-module": {                   //pancake is looking for this object to id your module as a pancake module
+      "version": "1.0.0",                 //the major version of pancake
+      "plugins": [                        //only state the plugins you need here
+        "@gov.au/pancake-sass"
+      ],
+      "org": "@gov.au @nsw.gov.au",       //the npm organisations that will be searched for pancake modules
+      "sass": {                           //sass plugin specific settings
+        "path": "lib/sass/_module.scss",  //where is your sass
+        "sass-versioning": true           //enable sass-versioning. Read more here: https://github.com/dominikwilkowski/sass-versioning
+      },
+      "js": {                             //js plugin specific settings
+        "path": "lib/js/module.js"        //where is your js
+      },
+      "react": {
+        "location": "lib/js/react.js"     //the location to move the react files to
+      }
+    }
+  },
  "dependencies": {},
  "peerDependencies": {},
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

### The script

The magic of Pancake lies within the `postinstall` script. To enable Pancake add it as a dependency and add the script:

```diff
{
  "name": "your-module-name",
  "version": "1.0.0",
  "description": "Your description",
  "pancake": {
    "pancake-module": {
      "version": "1.0.0",
      "plugins": [
        "@gov.au/pancake-sass"
      ],
      "sass": {
        "path": "lib/sass/_module.scss",
        "sass-versioning": true
      },
      "js": {
        "path": "lib/js/module.js"
      },
      "react": {
        "location": "lib/js/react.js"
      }
    }
  },
  "dependencies": {
+    "@gov.au/pancake": "~1"
  },
  "peerDependencies": {},
  "devDependencies": {},
  "scripts": {
+    "postinstall": "pancake"
  },
  "author": "",
  "license": "ISC"
}
```

This will run Pancake right after install and make sure you always get the latest version of the release 1.0.0.
If you have to change settings (very likely) you don’t actually have to fork this project. You can set those settings globally before running it with your
`postinstall` script.

```shell
"postinstall": "pancake --set npmOrg yourOrg && pancake"
```

### Peer dependencies

Adding peer dependencies is simple as long as you remember to add it to the `dependencies` and `peerDependencies` the same time. That way npm will install the
peer dependency and pancake can check if you have conflicts.

```diff
{
  "name": "your-module-name",
  "version": "1.0.0",
  "description": "Your description",
  "pancake": {
    "pancake-module": {
      "version": "1.0.0",
      "plugins": [
        "@gov.au/pancake-sass"
      ],
      "sass": {
        "path": "lib/sass/_module.scss",
        "sass-versioning": true
      },
      "js": {
        "path": "lib/js/module.js"
      },
      "react": {
        "location": "lib/js/react.js"
      }
    }
  },
  "dependencies": {
    "@gov.au/pancake": "~1",

+    "@gov.au/core": "^0.1.0"
  },
  "peerDependencies": {
+    "@gov.au/core": "^0.1.0"
  },
  "devDependencies": {},
  "scripts": {
    "postinstall": "pancake"
  },
  "author": "",
  "license": "ISC"
}
```

Now you’re ready to publish your modules and start using Pancake.


**[⬆ back to top](#contents)**

----------------------------------------------------------------------------------------------------------------------------------------------------------------

## Taste / Tests

### Test modules

We have published four test modules in our scoped npm org to test interdependencies and to debug with verbose mode switched on.
Find below a list of what is inside each version:

**@gov.au/testmodule1**
- ![Testmodule1 version](https://img.shields.io/npm/v/@gov.au/testmodule1.svg?label=version&colorA=313131&colorB=1B7991)  

**@gov.au/testmodule2**
- ![Testmodule2 version](https://img.shields.io/npm/v/@gov.au/testmodule2.svg?label=version&colorA=313131&colorB=1B7991)  
	- └── `@gov.au/testmodule1`: `^15.0.0`

**@gov.au/testmodule3**
- ![Testmodule3 version](https://img.shields.io/npm/v/@gov.au/testmodule3.svg?label=version&colorA=313131&colorB=1B7991)  
	- ├── `@gov.au/testmodule1`: `^15.0.0`
	- └── `@gov.au/testmodule2`: `^19.0.0`

**@gov.au/testmodule4**
- ![Testmodule4 version](https://img.shields.io/npm/v/@gov.au/testmodule4.svg?label=version&colorA=313131&colorB=1B7991)  
	- └── `@gov.au/testmodule1`: `^15.0.0`


### Software tests

We have an [end-to-end test script](https://github.com/govau/pancake/blob/develop/tests/tester.js) that will take a number of scenarios and compare the output
of pancake against fixtures.

We also use unit tests with [jest](https://facebook.github.io/jest/).

To run all tests use the below command:

```shell
npm test
```

### Node support

Pancake has been tested with Ubuntu 16.04, Mac OS 10.11, 10.12 and Windows 10 all node version coming with npm 3 and higher:

- node `v5.0.0`
- node `v5.12.0`
- node `v6.9.5`
- node `v7.0.0`
- node `v7.4.0`
- node `v7.5.0`
- node `v7.6.0`
- node `v10.0.0`


**[⬆ back to top](#contents)**


# };
