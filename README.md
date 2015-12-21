# markdown-it-anchor [![npm version](http://img.shields.io/npm/v/markdown-it-anchor.svg?style=flat-square)](https://www.npmjs.org/package/markdown-it-anchor)

> Header anchors for [markdown-it].

[markdown-it]: https://github.com/markdown-it/markdown-it/tree/master

Usage
-----

```js
const md = require('markdown-it')
  .use(require('markdown-it-anchor'), opts)
```

[demo as jsfiddle](https://jsfiddle.net/arve0/6x8x5j75/2/)

The `opts` object can contain:

Name              | Description                               | Default
------------------|-------------------------------------------|------------------------------------
`level`           | Minimum level to apply anchors on.        | 1
`slugify`         | A custom slugification function.          | [string.js' `slugify`][slugify]
`permalink`       | Whether to add permalinks next to titles. | `false`
`renderPermalink` | A custom permalink rendering function.    | See [`index.es6.js`](index.es6.js)
`permalinkClass`  | The class of the permalink anchor.        | `header-anchor`
`permalinkSymbol` | The symbol in the permalink anchor.       | `¶`
`permalinkBefore` | Place the permalink before the title.     | `false`

[slugify]: http://stringjs.com/#methods/slugify

The `renderPermalink` function takes the slug, an options object with
the above options, and then all the usual markdown-it rendering
arguments.

All headers above `level` will then have an `id` attribute with a slug
of their content, and if `permalink` is `true`, a `¶` symbol linking to
the header itself.

You may want to use the [link symbol](http://graphemica.com/🔗) as
`permalinkSymbol`, or a symbol from your favorite web font.
