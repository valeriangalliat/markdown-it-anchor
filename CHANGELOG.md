# [Changelog](http://keepachangelog.com/)

This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased][unreleased]

## [4.0.0] - 2017-02-26
* Drop Babel. This drops support for Node.js versions that doesn't
  support ES6.
* Support code in titles. ([#27])
* Support individual header level selection. ([#27])

## [3.0.0] - 2017-02-06
* Use existing ID as slug if present. This drops the support for
  markdown-it 5 and lower, hence the major bump. ([#22])

## [2.5.1] - 2016-11-19
* Patch for supporting "Constructor" title. ([#18])

## [2.5.0] - 2016-03-22
* Test against markdown-it 6.
* Support anchors with HTML in header.

## [2.4.0] - 2016-02-12
* Add a callback option. ([#16]).

## [2.3.3] - 2015-12-21
* Add a live example ([#13]).

## [2.3.2] - 2015-11-29
* Test against markdown-it 5.
* Keep assigning `module.exports` after Babel 6 upgrade (that
  assigns `exports.default` only instead), using
  `babel-plugin-add-module-exports`. ([#12])

## [2.3.1] - 2015-11-29
* Remove hard dependency on markdown-it and replace `lodash.assign` with
  `Object.assign`. ([#11])
* Move to Babel 6.
* Use `babel-plugin-transform-object-assign` to have `Object.assign`
  work in ES5 environments.
* Add the permalink during compilation instead of rendering.

## [2.3.0] - 2015-08-13
* Allow to pass HTML as permalink symbol. ([#8])

## [2.2.1] - 2015-08-13
* Do not crash when permalink is enabled and headers below specified
  level are present. ([#7])

## [2.2.0] - 2015-07-20
* Use `core.ruler` to add attributes so other plugins can reuse them. ([#5])

## [2.1.0] - 2015-06-22
* Set `aria-hidden` on permalink anchor.

## [2.0.0] - 2015-05-28
* Place the permalink after the header by default. ([#3])

  If you want to keep the old behavior, set the `permalinkBefore` option
  to `true`:

  ```js
  const md = require('markdown-it')
    .use(require('markdown-it-anchor'), {
      permalink: true,
      permalinkBefore: true
    })
  ```

## [1.1.2] - 2015-05-23
* Fix a code example in the readme.

## [1.1.1] - 2015-05-20
* Slight tweaks in `package.json`.
* Upgrade Babel.

## [1.1.0] - 2015-04-24
* Allow to customize the permalink symbol. ([#1])
* Handle duplicate slugs by appending a number.

## 1.0.0 - 2015-03-18
* Initial release.

[unreleased]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v4.0.0...HEAD
[4.0.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v3.0.0...v4.0.0
[3.0.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v2.5.1...v3.0.0
[2.5.1]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v2.5.0...v2.5.1
[2.5.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v2.4.0...v2.5.0
[2.4.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v2.3.3...v2.4.0
[2.3.3]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v2.3.2...v2.3.3
[2.3.2]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v2.3.1...v2.3.2
[2.3.1]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v2.2.1...v2.3.0
[2.2.1]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v1.1.2...v2.0.0
[1.1.2]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v1.0.0...v1.1.0

[#1]: https://github.com/valeriangalliat/markdown-it-anchor/pull/1
[#3]: https://github.com/valeriangalliat/markdown-it-anchor/issues/3
[#5]: https://github.com/valeriangalliat/markdown-it-anchor/issues/5
[#7]: https://github.com/valeriangalliat/markdown-it-anchor/issues/7
[#8]: https://github.com/valeriangalliat/markdown-it-anchor/issues/8
[#11]: https://github.com/valeriangalliat/markdown-it-anchor/pull/11
[#12]: https://github.com/valeriangalliat/markdown-it-anchor/issues/12
[#13]: https://github.com/valeriangalliat/markdown-it-anchor/issues/13
[#16]: https://github.com/valeriangalliat/markdown-it-anchor/issues/16
[#18]: https://github.com/valeriangalliat/markdown-it-anchor/issues/18
[#22]: https://github.com/valeriangalliat/markdown-it-anchor/pull/22
[#27]: https://github.com/valeriangalliat/markdown-it-anchor/issues/27
