const { strictEqual } = require('assert')
const md = require('markdown-it')
const attrs = require('markdown-it-attrs')
const anchor = require('./')

strictEqual(
  md().use(anchor).render('# H1\n\n## H2'),
  '<h1 id="h1">H1</h1>\n<h2 id="h2">H2</h2>\n'
)

strictEqual(
  md().use(attrs).use(anchor).render('# H1 {id=bubblegum}\n\n## H2 {id=shoelaces}'),
  '<h1 id="bubblegum">H1</h1>\n<h2 id="shoelaces">H2</h2>\n'
)

strictEqual(
  md().use(anchor, { level: 2 }).render('# H1\n\n## H2'),
  '<h1>H1</h1>\n<h2 id="h2">H2</h2>\n'
)

strictEqual(
  md().use(anchor, { level: [2, 4] }).render('# H1\n\n## H2\n\n### H3\n\n#### H4\n\n##### H5'),
  '<h1>H1</h1>\n<h2 id="h2">H2</h2>\n<h3>H3</h3>\n<h4 id="h4">H4</h4>\n<h5>H5</h5>\n'
)

strictEqual(
  md().use(anchor, { permalink: true }).render('# H1'),
  '<h1 id="h1">H1 <a class="header-anchor" href="#h1">¶</a></h1>\n'
)

strictEqual(
  md().use(anchor, { permalink: true, permalinkClass: 'test' }).render('# H1'),
  '<h1 id="h1">H1 <a class="test" href="#h1">¶</a></h1>\n'
)

strictEqual(
  md().use(anchor, { permalink: true, permalinkClass: null }).render('# H1'),
  '<h1 id="h1">H1 <a href="#h1">¶</a></h1>\n'
)

strictEqual(
  md().use(anchor, { permalink: true, permalinkSymbol: 'P' }).render('# H1'),
  '<h1 id="h1">H1 <a class="header-anchor" href="#h1">P</a></h1>\n'
)

strictEqual(
  md().use(anchor, { permalink: true, permalinkSymbol: '<i class="icon"></i>' }).render('# H1'),
  '<h1 id="h1">H1 <a class="header-anchor" href="#h1"><i class="icon"></i></a></h1>\n'
)

strictEqual(
  md().use(anchor).render('# Title\n\n## Title'),
  '<h1 id="title">Title</h1>\n<h2 id="title-1">Title</h2>\n'
)

strictEqual(
  md().use(anchor, { permalink: true, permalinkBefore: true }).render('# H1'),
  '<h1 id="h1"><a class="header-anchor" href="#h1">¶</a> H1</h1>\n'
)

strictEqual(
  md().use(anchor, { level: 2, permalink: true }).render('# H1\n\n## H2'),
  '<h1>H1</h1>\n<h2 id="h2">H2 <a class="header-anchor" href="#h2">¶</a></h2>\n'
)

strictEqual(
  md({ html: true }).use(anchor, { permalink: true }).render('# <span>H1</span>'),
  '<h1 id="h1"><span>H1</span> <a class="header-anchor" href="#h1">¶</a></h1>\n'
)

strictEqual(
  md().use(anchor).render('#### `options`'),
  '<h4 id="options"><code>options</code></h4>\n'
)

const calls = []
const callback = (token, info) => calls.push({ token, info })

strictEqual(
  md().use(anchor, { callback }).render('# First Heading\n\n## Second Heading'),
  '<h1 id="first-heading">First Heading</h1>\n<h2 id="second-heading">Second Heading</h2>\n'
)

strictEqual(
  md().use(anchor, {
    permalinkHref: (slug, state) => `${state.env.path}#${slug}`,
    permalink: true
  }).render('# H1', { path: 'file.html' }),
  '<h1 id="h1">H1 <a class="header-anchor" href="file.html#h1">¶</a></h1>\n'
)

strictEqual(calls.length, 2)
strictEqual(calls[0].token.tag, 'h1')
strictEqual(calls[0].info.title, 'First Heading')
strictEqual(calls[0].info.slug, 'first-heading')
strictEqual(calls[1].token.tag, 'h2')
strictEqual(calls[1].info.title, 'Second Heading')
strictEqual(calls[1].info.slug, 'second-heading')

strictEqual(
  md({ html: true }).use(anchor, { permalink: true, permalinkSpace: false }).render('# H1'),
  '<h1 id="h1">H1<a class="header-anchor" href="#h1">¶</a></h1>\n'
)

strictEqual(
  md({ html: true }).use(anchor, { permalink: false, permalinkSpace: false }).render('# H1'),
  '<h1 id="h1">H1</h1>\n'
)

strictEqual(
  md()
    .use(anchor, { permalink: true, permalinkAttrs: (slug, state) => ({ 'aria-label': `permalink to ${slug}`, title: 'permalink' }) })
    .render('# My title'),
  '<h1 id="my-title">My title <a class="header-anchor" href="#my-title" aria-label="permalink to my-title" title="permalink">¶</a></h1>\n'
)

strictEqual(
  md()
    .use(anchor, { uniqueSlugStartIndex: 2 })
    .render('# Lorem\n## Lorem\n### Lorem'),
  '<h1 id="lorem">Lorem</h1>\n<h2 id="lorem-2">Lorem</h2>\n<h3 id="lorem-3">Lorem</h3>\n'
)

strictEqual(
  (() => {
    try {
      return md().use(attrs).use(anchor).render('# H1 {id=bubblegum}\n\n## H2 {id=bubblegum}')
    } catch (ex) {
      return ex.message
    }
  })(),
  "User defined id attribute 'bubblegum' is NOT unique. Please fix it in your markdown to continue."
)

strictEqual(
  md().use(attrs).use(anchor).render('# H1 {id=h2}\n\n## H2'),
  '<h1 id="h2">H1</h1>\n<h2 id="h2-1">H2</h2>\n'
)

strictEqual(
  (() => {
    try {
      return md().use(attrs).use(anchor).render('# H1\n\n## H2 {id=h1}')
    } catch (ex) {
      return ex.message
    }
  })(),
  "User defined id attribute 'h1' is NOT unique. Please fix it in your markdown to continue."
)
