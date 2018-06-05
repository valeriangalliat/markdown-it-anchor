# markdown-it-anchor [![npm version](http://img.shields.io/npm/v/markdown-it-anchor.svg?style=flat-square)](https://www.npmjs.org/package/markdown-it-anchor)

> Header anchors for [markdown-it].

[markdown-it]: https://github.com/markdown-it/markdown-it

Usage
-----

```js
const md = require('markdown-it')()
  .use(require('markdown-it-anchor'), opts)
```

See a [demo as JSFiddle](https://jsfiddle.net/9ukc8dy6/).

The `opts` object can contain:

Name              | Description                                                    | Default
------------------|----------------------------------------------------------------|-----------------------------------
`level`           | Minimum level to apply anchors on or array of selected levels. | 1
`slugify`         | A custom slugification function.                               | [`slugify`][slugify]
`permalink`       | Whether to add permalinks next to titles.                      | `false`
`renderPermalink` | A custom permalink rendering function.                         | See [`index.js`](index.js)
`permalinkClass`  | The class of the permalink anchor.                             | `header-anchor`
`permalinkSymbol` | The symbol in the permalink anchor.                            | `¶`
`permalinkBefore` | Place the permalink before the title.                          | `false`
`permalinkHref`   | A custom permalink `href` rendering function.                  | See [`index.js`](index.js)
`callback`        | Called with token and info after rendering.                    | `undefined`

[slugify]: https://www.npmjs.com/package/slugify

The `renderPermalink` function takes the slug, an options object with
the above options, and then all the usual markdown-it rendering
arguments.

All headers above `level` will then have an `id` attribute with a slug
of their content. `level` can also be an array of headers levels to
apply the anchor, like `[2, 3]` to have an anchor on only level 2 and
3 headers.

If `permalink` is `true`, a `¶` symbol linking to the header itself will
be added.

You may want to use the [link symbol](http://graphemica.com/🔗) as
`permalinkSymbol`, or a symbol from your favorite web font.

The `callback` option is a function that will be called at the end of
rendering with the `token` and an `info` object.  The `info` object has
`title` and `slug` properties with the token content and the slug used
for the identifier.
