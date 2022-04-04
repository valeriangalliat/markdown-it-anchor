# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
* Support wrapping output of `linkAfterHeader`. ([#100], [#110])

## [8.4.1] - 2021-10-11
* Attempt to fix `npm publish` that didn't publish previous version.

## [8.4.0] - 2021-10-11
* Add a fix for Safari reader view in `headerLink`. ([#107])

## [8.3.1] - 2021-09-15
* Update TypeScript types to properly reflect the export style of
  `@types/markdown-it`. Also use `export default anchor` in type
  declaration instead of `export = anchor` so that TypeScript allows both
  `import anchor from 'markdown-it-anchor'` and `import anchor = require('markdown-it-anchor')`
  syntaxes instead of being forced to the latter. ([#106])
* Added a hack to make TypeScript work with the modern import syntax
  when not being used with a bundler. ([`6fcc502`])

## [8.3.0] - 2021-08-26
* Make core loop resilient to permalink renderers mutating the token
  stream with `splice`. ([#100])

## [8.2.0] - 2021-08-26
* Introduce a `linkInsideHeader` permalink option, which is the closest
  to the permalink in previous versions. ([#101])
* Refactor tests using AVA.

## [8.1.3] - 2021-08-24
* Fix `tabIndex` type. ([#103])

## [8.1.2] - 2021-07-23
* Fix `prepublish` script not being run on `npm publish` anymore.
* Update the `dist` code.

## [8.1.1] - 2021-07-23
* Fix `ReferenceError` with `process.emitWarning` in the browser. ([#102])

## [8.1.0] - 2021-07-01
* Add `token.meta.isPermalinkSymbol` to help other plugins (e.g. TOC) to
  identify and ignore permalink symbols. ([#99])

## [8.0.5] - 2021-07-01
* Revert `html_inline` to `html_block` in legacy permalink. ([#98])

## [8.0.4] - 2021-06-25
* Fix `level` option TypeScript type. ([#97])

## [8.0.3] - 2021-06-20
* Update TypeScript types compatible with 8.0.0 release. ([#95])

## [8.0.2] - 2021-06-19
* Fix bug with `linkAfterHeader` permalink renderer. ([#93])
* Also fix regression where `symbol` wasn't allowed to be HTML anymore
  in new renderers.

## [8.0.1] - 2021-06-15
* Fix permalink option typo in readme. ([#91])

## [8.0.0] - 2021-06-14
* Set `tabindex="-1"` on headers. ([#85], [#86])
* Change the way to configure a permalink, allowing for more accessible
  choices. ([#82], [#89])
* Show a deprecation warning for the old permalink option.

## [7.1.0] - 2021-03-06
* Update TypeScript types. ([#83])

## [7.0.2] - 2021-02-06
* Optimize token parsing. ([#80])

## [7.0.1] - 2021-01-28
* Add a Chinese readme. ([#79])

## [7.0.0] - 2021-01-04
* Depend on any markdown-it version. ([#76])

## [6.0.1] - 2020-11-19
* Added `example.html` test case.
* Added `uniqueSlugStartIndex` test case.
* Fix `equal` -> `strictEqual`.
* Updated dependencies -> `found 0 vulnerabilities`.

## [6.0.0] - 2020-09-29
* Allow to configure unique slug start index, and make it 1 instead of 2
  to mimic what markdown-toc, github-slugger, and GitHub itself does by
  default. This should improve out of the box compatibility with other
  packages. ([#74])

## [5.3.0] - 2020-05-12
* Fix support for user defined ids by using `markdown-it-attrs`.
* Updated dependencies -> `found 0 vulnerabilities`.

## [5.2.7] - 2020-04-01
* Forgot to build before pushing to npm.

## [5.2.6] - 2020-02-05
* Support arbitrary permalink attributes with `permalinkAttrs`. ([#63])

## [5.2.5] - 2019-10-16
* Removing `aria-hidden` from links. ([#58])

## [5.2.4] - 2019-06-03
* Rolled back to `...linkTokens`.
* Executed `npm audit fix` to fix dependencies vulnerabilities.

## [5.2.3] - 2019-05-28
* `...linkTokens` -> `(...).apply(null, linkTokens)` IE doesn't support spread syntax.

## [5.2.2] - 2019-05-28
* `...linkTokens` -> `[].concat(linkTokens)` makes IE compatible.

## [5.2.1] - 2019-05-28
* Fix typo.

## [5.2.0] - 2019-05-28
* Added support for unpkg
* Added support for mjs
* Fix Babel issue, support ES modules. ([#40], [#46])
* New option `permalinkSpace` makes possible to suppress the whitespace
  between the permalink and the header text value. Defaults to `true`. ([#52])
* Fix duplicate ID edge case. ([#35])

## [5.0.1] - 2018-06-14
* `trim()` before `toLowerCase()` to prevent dashes as prefixes and suffixes.

## [5.0.0] - 2018-06-14
* New contributor: [**@nagaozen**](https://github.com/nagaozen)
* Drop `string` package in favour of `encodeURIComponent`. ([#44], [#43], [#38], [#17], [#45])

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
* Add a callback option. ([#16])

## [2.3.3] - 2015-12-21
* Add a live example. ([#13])

## [2.3.2] - 2015-11-29
* Test against markdown-it 5.
* Keep assigning `module.exports` after Babel 6 upgrade (that assigns
  `exports.default` only instead), using
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

## [1.0.0] - 2015-03-18
* Initial release.

[Unreleased]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v8.4.1...HEAD
[8.4.1]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v8.4.0...v8.4.1
[8.4.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v8.3.1...v8.4.0
[8.3.1]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v8.3.0...v8.3.1
[8.3.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v8.2.0...v8.3.0
[8.2.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v8.1.3...v8.2.0
[8.1.3]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v8.1.2...v8.1.3
[8.1.2]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v8.1.1...v8.1.2
[8.1.1]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v8.1.0...v8.1.1
[8.1.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v8.0.5...v8.1.0
[8.0.5]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v8.0.4...v8.0.5
[8.0.4]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v8.0.3...v8.0.4
[8.0.3]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v8.0.2...v8.0.3
[8.0.2]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v8.0.1...v8.0.2
[8.0.1]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v8.0.0...v8.0.1
[8.0.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v7.1.0...v8.0.0
[7.1.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v7.0.2...v7.1.0
[7.0.2]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v7.0.1...v7.0.2
[7.0.1]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v7.0.0...v7.0.1
[7.0.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v6.0.1...v7.0.0
[6.0.1]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v6.0.0...v6.0.1
[6.0.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v5.3.0...v6.0.0
[5.3.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v5.2.7...v5.3.0
[5.2.7]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v5.2.6...v5.2.7
[5.2.6]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v5.2.5...v5.2.6
[5.2.5]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v5.2.4...v5.2.5
[5.2.4]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v5.2.3...v5.2.4
[5.2.3]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v5.2.2...v5.2.3
[5.2.2]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v5.2.1...v5.2.2
[5.2.1]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v5.2.0...v5.2.1
[5.2.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v5.0.1...v5.2.0
[5.0.1]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v5.0.0...v5.0.1
[5.0.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v4.0.0...v5.0.0
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
[1.0.0]: https://github.com/valeriangalliat/markdown-it-anchor/tree/v1.0.0

[#1]: https://github.com/valeriangalliat/markdown-it-anchor/pull/1
[#3]: https://github.com/valeriangalliat/markdown-it-anchor/issues/3
[#5]: https://github.com/valeriangalliat/markdown-it-anchor/issues/5
[#7]: https://github.com/valeriangalliat/markdown-it-anchor/issues/7
[#8]: https://github.com/valeriangalliat/markdown-it-anchor/issues/8
[#11]: https://github.com/valeriangalliat/markdown-it-anchor/pull/11
[#12]: https://github.com/valeriangalliat/markdown-it-anchor/issues/12
[#13]: https://github.com/valeriangalliat/markdown-it-anchor/issues/13
[#16]: https://github.com/valeriangalliat/markdown-it-anchor/issues/16
[#17]: https://github.com/valeriangalliat/markdown-it-anchor/issues/17
[#18]: https://github.com/valeriangalliat/markdown-it-anchor/issues/18
[#22]: https://github.com/valeriangalliat/markdown-it-anchor/pull/22
[#27]: https://github.com/valeriangalliat/markdown-it-anchor/issues/27
[#35]: https://github.com/valeriangalliat/markdown-it-anchor/issues/35
[#38]: https://github.com/valeriangalliat/markdown-it-anchor/issues/38
[#40]: https://github.com/valeriangalliat/markdown-it-anchor/issues/40
[#43]: https://github.com/valeriangalliat/markdown-it-anchor/issues/43
[#44]: https://github.com/valeriangalliat/markdown-it-anchor/issues/44
[#45]: https://github.com/valeriangalliat/markdown-it-anchor/issues/46
[#46]: https://github.com/valeriangalliat/markdown-it-anchor/issues/46
[#52]: https://github.com/valeriangalliat/markdown-it-anchor/pull/52
[#58]: https://github.com/valeriangalliat/markdown-it-anchor/issues/58
[#63]: https://github.com/valeriangalliat/markdown-it-anchor/pull/63
[#74]: https://github.com/valeriangalliat/markdown-it-anchor/issues/74
[#76]: https://github.com/valeriangalliat/markdown-it-anchor/pull/76
[#79]: https://github.com/valeriangalliat/markdown-it-anchor/pull/79
[#80]: https://github.com/valeriangalliat/markdown-it-anchor/issues/80
[#82]: https://github.com/valeriangalliat/markdown-it-anchor/issues/82
[#83]: https://github.com/valeriangalliat/markdown-it-anchor/pull/83
[#85]: https://github.com/valeriangalliat/markdown-it-anchor/issues/85
[#86]: https://github.com/valeriangalliat/markdown-it-anchor/pull/86
[#89]: https://github.com/valeriangalliat/markdown-it-anchor/pull/89
[#91]: https://github.com/valeriangalliat/markdown-it-anchor/pull/91
[#93]: https://github.com/valeriangalliat/markdown-it-anchor/pull/93
[#95]: https://github.com/valeriangalliat/markdown-it-anchor/pull/95
[#97]: https://github.com/valeriangalliat/markdown-it-anchor/pull/97
[#98]: https://github.com/valeriangalliat/markdown-it-anchor/issues/98
[#99]: https://github.com/valeriangalliat/markdown-it-anchor/pull/99
[#100]: https://github.com/valeriangalliat/markdown-it-anchor/issues/100
[#101]: https://github.com/valeriangalliat/markdown-it-anchor/issues/101
[#102]: https://github.com/valeriangalliat/markdown-it-anchor/pull/102
[#103]: https://github.com/valeriangalliat/markdown-it-anchor/issues/103
[#106]: https://github.com/valeriangalliat/markdown-it-anchor/pull/106
[#107]: https://github.com/valeriangalliat/markdown-it-anchor/issues/107
[#110]: https://github.com/valeriangalliat/markdown-it-anchor/issues/110

[`6fcc502`]: https://github.com/valeriangalliat/markdown-it-anchor/commit/6fcc50233d593458aa883e5b515cb8311114555c
