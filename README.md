# markdown-it-anchor [![npm version](http://img.shields.io/npm/v/markdown-it-anchor.svg?style=flat-square)](https://www.npmjs.org/package/markdown-it-anchor)

> Header anchors for [markdown-it].

[markdown-it]: https://github.com/markdown-it/markdown-it

English | [中文 (v7.0.1)](./README-zh_CN.md)

## Usage

```js
const md = require('markdown-it')()
  .use(require('markdown-it-anchor'), opts)
```

See a [demo as JSFiddle](https://jsfiddle.net/9ukc8dy6/).

The `opts` object can contain:

| Name                   | Description                                                               | Default                    |
|------------------------|---------------------------------------------------------------------------|----------------------------|
| `level`                | Minimum level to apply anchors, or array of selected levels.              | 1                          |
| `slugify`              | A custom slugification function.                                          | See [`index.js`](index.js) |
| `uniqueSlugStartIndex` | Index to start with when making duplicate slugs unique.                   | 1                          |
| `permalink`            | A function to render permalinks, see [permalinks] below.                  | `undefined`                |
| `callback`             | Called with token and info after rendering.                               | `undefined`                |
| `tabIndex`             | Value of the `tabindex` attribute on headings, set to `false` to disable. | `-1`                       |

[permalinks]: #permalinks

All headers greater than the minimum `level` will have an `id` attribute
with a slug of their content. For example, you can set `level` to 2 to
add anchors to all headers but `h1`. You can also pass an array of
header levels to apply the anchor, like `[2, 3]` to have an anchor on
only level 2 and 3 headers.

If a `permalink` renderer is given, it will be called for each matching header
to add a permalink. See [permalinks] below.

The `callback` option is a function that will be called at the end of
rendering with the `token` and an `info` object.  The `info` object has
`title` and `slug` properties with the token content and the slug used
for the identifier.

Finally, we set by default [`tabindex="-1"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)
on headers. This marks the headers as focusable elements that are not
reachable by keyboard navigation. The effect is that screen readers will
read the title content when it's being jumped to. Outside of screen
readers, the experience is the same as not setting that attribute. You
can override this behavior with the `tabIndex` option. Set it to `false`
to remove the attribute altogether, otherwise the value will be used as
attribute value.

## User-friendly URLs

Starting from v5.0.0, markdown-it-anchor dropped the [`string`](https://github.com/jprichardson/string.js)
package keeping it's core value of being an unopinionated and secure
library. Yet, users looking for backward compatibility may want the old
`slugify` function:

```sh
npm install string
```

```js
const string = require('string')
const slugify = s => string(s).slugify().toString()

const md = require('markdown-it')()
  .use(require('markdown-it-anchor'), { slugify })
```

Another popular library for this is [`@sindresorhus/slugify`](https://github.com/sindresorhus/slugify),
which have better Unicode support and other cool features:

```sh
npm install @sindresorhus/slugify
```

```js
const slugify = require('@sindresorhus/slugify')

const md = require('markdown-it')()
  .use(require('markdown-it-anchor'), { slugify: s => slugify(s) })
```

## Explicit `id`s

You might want to explicitly set the `id` attribute of your headings
from the Markdown document, for example to keep them consistent across
translations.

markdown-it-anchor is designed to reuse any existing `id`, making [markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs)
a perfect fit for this use case. Make sure to load it before markdown-it-anchor!

Then you can do something like this:

```markdown
# Your title {#your-custom-id}
```

The anchor link will reuse the `id` that you explicitly defined.

## Table of contents

Looking for an automatic table of contents (TOC) generator? Take a look at
[markdown-it-toc-done-right](https://www.npmjs.com/package/markdown-it-toc-done-right)
it's made from the ground to be a great companion of this plugin.

## Browser example

See [`example.html`](example.html).

## Permalinks

Version 8.0.0 completely reworked the way permalinks work in order to
offer more accessible options out of the box.

Instead of a single default way of rendering permalinks (which used to
have a poor UX on screen readers), we now have multiple styles of
permalinks for you to chose from.

```js
const anchor = require('markdown-it-anchor')
const md = require('markdown-it')()

md.use(anchor, {
  permalink: anchor.permalink[styleOfPermalink](permalinkOpts)
})
```

Here, `styleOfPermalink` is one of the available styles documented
below, and `permalinkOpts` is an options object. All renderers share a
common set of options:

| Name          | Description                                       | Default                            |
|---------------|---------------------------------------------------|------------------------------------|
| `class`       | The class of the permalink anchor.                | `header-anchor`                    |
| `symbol`      | The symbol in the permalink anchor.               | `#`                                |
| `renderHref`  | A custom permalink `href` rendering function.     | See [`permalink.js`](permalink.js) |
| `renderAttrs` | A custom permalink attributes rendering function. | See [`permalink.js`](permalink.js) |

For the `symbol`, you may want to use the [link symbol](http://graphemica.com/🔗),
or a symbol from your favorite web font.

### Header link

This style wraps the header itself in an anchor link. It doesn't use the
`symbol` option as there's no symbol needed in the markup (though you
could add it with CSS using `::before` if you like).

It's so simple it doesn't have any behaviour to custom, and it's also
accessible out of the box without any further configuration, hence it
doesn't have other options than the common ones described above.

You can find this style on the [MDN] as well as [HTTP Archive] and their
[Web Almanac], which to me is a good sign that this is a thoughtful way of
implementing permalinks. This is also the style that I chose for my own
[blog].

[MDN]: https://developer.mozilla.org/en-US/docs/Web
[HTTP Archive]: https://httparchive.org/reports/state-of-the-web
[Web Almanac]: https://almanac.httparchive.org/en/2020/table-of-contents
[blog]: https://www.codejam.info/

```js
const anchor = require('markdown-it-anchor')
const md = require('markdown-it')()

md.use(anchor, {
  permalink: anchor.permalink.headerLink()
})
```

```html
<h2 id="title"><a class="header-anchor" href="#title">Title</a></h2>
```

The main caveat of this approach is that you can't include links inside
headers. If you do, consider the other styles.

Also note that this pattern [breaks reader mode in Safari](https://www.leereamsnyder.com/blog/making-headings-with-links-show-up-in-safari-reader),
an issue you can also notice on the referenced websites above. This was
already [reported to Apple](https://bugs.webkit.org/show_bug.cgi?id=225609#c2)
but their bug tracker is not public.

### Link after header

If you want to customize further the screen reader experience of your
permalinks, this style gives you much more freedom than the [header link](#header-link).

It works by leaving the header itself alone, and adding the permalink
*after* it, giving you different methods of customizing the assistive
text. It makes the permalink symbol `aria-hidden` to not pollute the
experience, and leverages a `visuallyHiddenClass` to hide the assistive
text from the visual experience.

| Name                  | Description                                                                                               | Default                                                             |
|-----------------------|-----------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------|
| `style`               | The (sub) style of link, one of `visually-hidden`, `aria-label`, `aria-describedby` or `aria-labelledby`. | `visually-hidden`                                                   |
| `assistiveText`       | A function that takes the title and returns the assistive text.                                           | `undefined`, required for `visually-hidden` and `aria-label` styles |
| `visuallyHiddenClass` | The class you use to make an element visually hidden.                                                     | `undefined`, required for `visually-hidden` style                   |
| `space`               | Add a space between the assistive text and the permalink symbol.                                          | `true`                                                              |
| `placement`           | Placement of the permalink symbol relative to the assistive text, can be `before` or `after` the header.  | `after`                                                             |

```js
const anchor = require('markdown-it-anchor')
const md = require('markdown-it')()

md.use(anchor, {
  permalink: anchor.permalink.linkAfterHeader({
    style: 'visually-hidden',
    assistiveText: title => `Permalink to “${title}”`,
    visuallyHiddenClass: 'visually-hidden'
  })
})
```

```html
<h2 id="title">Title</h2>
<a class="header-anchor" href="#title">
  <span class="visually-hidden">Permalink to “Title”</span>
  <span aria-hidden="true">#</span>
</a>
```

By using a visually hidden element for the assistive text, we make sure
that the assistive text can be picked up by translation services, as
most of the popular translation services currently ignore `aria-label`.

If you prefer an alternative method for the assistive text, see other
styles:

<details>
<summary><code>aria-label</code> variant</summary>

This removes the need from a visually hidden `span`, but will likely
hurt the permalink experience when using a screen reader through a
translation service.

```js
const anchor = require('markdown-it-anchor')
const md = require('markdown-it')()

md.use(anchor, {
  permalink: anchor.permalink.linkAfterHeader({
    style: 'aria-label'
    assistiveText: title => `Permalink to “${title}”`
  })
})
```

```html
<h2 id="title">Title</h2>
<a class="header-anchor" href="#title" aria-label="Permalink to “Title”">#</a>
```

</details>

<details>
<summary><code>aria-describedby</code> and <code>aria-labelledby</code> variants</summary>

This removes the need to customize the assistive text to your locale and
doesn't need a visually hidden `span` either, but since the anchor will
be described by just the text of the title without any context, it might
be confusing.

```js
const anchor = require('markdown-it-anchor')
const md = require('markdown-it')()

md.use(anchor, {
  permalink: anchor.permalink.linkAfterHeader({
    style: 'aria-describedby' // Or `aria-labelledby`
  })
})
```

```html
<h2 id="title">Title</h2>
<a class="header-anchor" href="#title" aria-describedby="title">#</a>
```

</details>

### ARIA hidden

This is the closest one to the old default permalink, and is similar to
GitHub's way of rendering permalinks.

It's the same markup as before with the addition of `aria-hidden="true"`
to make that permalink explicitly inaccessible instead of having the
permalink and its symbol being read by screen readers as part of every
single headings (which was a pretty terrible experience).

While no experience might be arguably better than a bad experience, I
would instead recommend using one of the above renderers to provide an
accessible experience. My favorite one is the [header link](#header-link),
which is also the simplest one.

If the `aria-hidden` style is still your way to go, it offers a number
of options:

| Name        | Description                                                                                                         | Default |
|-------------|---------------------------------------------------------------------------------------------------------------------|---------|
| `space`     | Add a space between the header text and the permalink symbol.                                                       | `true`  |
| `placement` | Placement of the permalink, can be `before` or `after` the header. This option used to be called `permalinkBefore`. | `after` |


```js
const anchor = require('markdown-it-anchor')
const md = require('markdown-it')()

md.use(anchor, {
  permalink: anchor.permalink.ariaHidden({
    placement: 'before'
  })
})
```

```html
<h2 id="title"><a class="header-anchor" href="#title" aria-hidden="true">#</a> Title</h2>
```

## Debugging

If you want to debug this library more easily, we support source maps.

Use the [source-map-support](https://www.npmjs.com/package/source-map-support)
module to enable it with Node.js.

```sh
node -r source-map-support/register your-script.js
```

## Development

```sh
# Build the library in the `dist/` directory.
npm run build

# Watch file changes to update `dist/`.
npm run dev

# Run tests, will use the build version so make sure to build after
# making changes.
npm test
```
