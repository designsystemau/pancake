Pancake Sass plugin

## 3.0.0

### Major Changes

- bae24a3: Publish to npm scope at @gold.au

### Patch Changes

- Updated dependencies [bae24a3]
  - @gold.au/pancake@2.0.0

## 2.3.8

### Patch Changes

- # 1857381: Internal references to @gov.au are now updated to use @gold.au

> This is a [Pancake](https://github.com/designsystemau/pancake) plugin to handle sass files.

## Versions

- [v2.3.7 - Remove sass-versioning](v237)
- [v2.3.4 - Added cross-platform path seperator for org replace function](v234)
- [v2.2.4 - Upgrade dependencies](v224)
- [v2.1.4 - Reverted pathing issue with pancake-sass, corrected changelog](v214)
- [v2.1.3 - Added cross-platform path seperator for org replace function](v213)
- [v2.1.2 - Multiple organisations](v212)
- [v2.1.1 - Update dependencies](v211)
- [v2.1.0 - Replace sass with node-sass](v210)
- [v2.0.1 - Update dependencies](v201)
- [v2.0.0 - Replace node-sass with sass](v200)
- [v1.3.2 - Update forgotten changelog](v132)
- [v1.3.1 - Update node modules](v131)
- [v1.3.0 - Optimized pancake for yarn monorepos](v130)
- [v1.2.0 - Added support for modules without Sass files](v120)
- [v1.1.1 - Bumped node-sass to 4.5.3](v111)
- [v1.1.0 - Optimized pancake for windows](v110)
- [v1.0.11 - Added a comment into the generated Sass files](v1011)
- [v1.0.10 - Fixed mixed js and Sass module bug](v1010)
- [v1.0.9 - Cleaned logs](v109)
- [v1.0.8 - Dependencies and tests](v108)
- [v1.0.7 - Sass custom path, global settings](v107)
- [v1.0.6 - Loading fixes](v106)
- [v1.0.5 - Made sass-versioning entirely optional](v105)
- [v1.0.4 - Bug hunting](v104)
- [v1.0.3 - 💥 Initial version](v103)

---

## v2.3.7

- Remove sass-versioning

## v2.3.4

- Added cross-platform path seperator for org replace function

## v2.2.4

- Upgrade dependencies

## v2.1.4

- Reverted pathing issue with pancake-sass, corrected changelog

## v2.1.3

- Added cross-platform path seperator for org replace function

## v2.1.2

- Multiple organisations

## v2.1.1

- Update dependencies

## v2.1.0

- Replace `sass` with `node-sass`

## v2.0.1

- Update dependencies

## v2.0.0

- Replace `node-sass` with `sass`

## v1.3.2

- Add changelogs

## v1.3.1

- Update dependencies

## v1.3.0

- Pancake now searches the folder above the current/package.json folder to better support monorepos via yarn
  ([#15](https://github.com/designsystemau/pancake/issues/15))

## v1.2.0

- Added support for modules without Sass files

## v1.1.1

- Bumped node-sass to 4.5.3
  ([sass/node-sass#1969](https://github.com/sass/node-sass/pull/1969))

## v1.1.0

- Pancake now works on windows after escaping every path separator. Other operating system, other way to break code.
  ([#14](https://github.com/designsystemau/pancake/issues/14))

## v1.0.11

- Added a comment into the generated Sass files.

## v1.0.10

- Fixed a bug where pancake would fail when we mix modules that are only Sass and only Js.

## v1.0.9

- Cleaned log so now pancake will announce plugins just when it tries to run them

## v1.0.8

- Made pancake a dependency
- Added jest unit tests

## v1.0.7

- Fixed #16 sass with custom path
- Receiving global settings from pancake now
- Added version comment tag into pancake.min.css
- Loading now separate from main module in case the main module is globally installed

## v1.0.6

- Loading as a plugin is now fixed, even when you have pancake installed globally
- Removed pancake as a dependency

## v1.0.5

- Made [sass-versioning](https://github.com/dominikwilkowski/sass-versioning) entirely optional

## v1.0.4

- Fixed some bugs

## v1.0.3

- 💥 Initial version

**[⬆ back to top](#contents)**

# };
