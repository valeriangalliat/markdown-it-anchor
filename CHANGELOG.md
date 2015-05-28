# [Changelog](http://keepachangelog.com/)

This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased][unreleased]

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

[unreleased]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v1.1.2...v2.0.0
[1.1.2]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/valeriangalliat/markdown-it-anchor/compare/v1.0.0...v1.1.0

[#1]: https://github.com/valeriangalliat/markdown-it-anchor/pull/1
[#3]: https://github.com/valeriangalliat/markdown-it-anchor/issues/3
