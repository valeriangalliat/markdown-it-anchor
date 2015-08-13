# [Changelog](http://keepachangelog.com/)

This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased][unreleased]

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

[unreleased]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v2.3.0...HEAD
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
