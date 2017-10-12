const { equal } = require('assert')
const md = require('markdown-it')
const attrs = require('markdown-it-attrs')
const anchor = require('./')

equal(
  md().use(anchor, { nestSlugs: true }).render('### H3\n\n### H3'),
  '<h3 id="h3">H3</h3>\n<h3 id="h3-2">H3</h3>\n'
)

equal(
  md().use(anchor, { nestSlugs: true }).render('### H3\n\n### H3\n\n# H1\n\n## H2'),
  '<h3 id="h3">H3</h3>\n<h3 id="h3-2">H3</h3>\n<h1 id="h1">H1</h1>\n<h2 id="h1-h2">H2</h2>\n'
)

equal(
  md().use(anchor, { nestSlugs: true }).render('# H1\n\n### H3'),
  '<h1 id="h1">H1</h1>\n<h3 id="h1-h3">H3</h3>\n'
)

equal(
  md().use(anchor, { nestSlugs: true }).render('# H1\n\n### H3\n\n### H3'),
  '<h1 id="h1">H1</h1>\n<h3 id="h1-h3">H3</h3>\n<h3 id="h1-h3-2">H3</h3>\n'
)

equal(
  md().use(anchor, { nestSlugs: true }).render('# H1\n\n### H3\n\n## H2'),
  '<h1 id="h1">H1</h1>\n<h3 id="h1-h3">H3</h3>\n<h2 id="h1-h2">H2</h2>\n'
)

equal(
  md().use(anchor, { nestSlugs: true }).render('# H1\n\n#### H4\n\n# H1\n\n### H3'),
  '<h1 id="h1">H1</h1>\n<h4 id="h1-h4">H4</h4>\n<h1 id="h1-2">H1</h1>\n<h3 id="h1-2-h3">H3</h3>\n'
)

equal(
  md().use(anchor, { nestSlugs: true }).render('# H1\n\n## H2'),
  '<h1 id="h1">H1</h1>\n<h2 id="h1-h2">H2</h2>\n'
)

equal(
  md().use(anchor, { nestSlugs: true }).render('# Title\n\n## Title'),
  '<h1 id="title">Title</h1>\n<h2 id="title-title">Title</h2>\n'
)

equal(
  md().use(anchor, { nestSlugs: true }).render('# H1\n\n## H2\n\n## H2'),
  '<h1 id="h1">H1</h1>\n<h2 id="h1-h2">H2</h2>\n<h2 id="h1-h2-2">H2</h2>\n'
)

equal(
  md().use(anchor, { nestSlugs: true }).render('# H1\n\n## H2\n\n## H2\n\n# H1'),
  '<h1 id="h1">H1</h1>\n<h2 id="h1-h2">H2</h2>\n<h2 id="h1-h2-2">H2</h2>\n<h1 id="h1-2">H1</h1>\n'
)

equal(
  md().use(anchor, { nestSlugs: true }).render('# H1\n\n## H2\n\n### H3'),
  '<h1 id="h1">H1</h1>\n<h2 id="h1-h2">H2</h2>\n<h3 id="h1-h2-h3">H3</h3>\n'
)

equal(
  md().use(anchor, { nestSlugs: true }).render('# H1\n\n## H2\n\n### H3\n\n## H2'),
  '<h1 id="h1">H1</h1>\n<h2 id="h1-h2">H2</h2>\n<h3 id="h1-h2-h3">H3</h3>\n<h2 id="h1-h2-2">H2</h2>\n'
)

equal(
  md().use(anchor, { nestSlugs: true }).render('# H1\n\n## H2\n\n## H2\n\n# H1\n\n## H2'),
  '<h1 id="h1">H1</h1>\n<h2 id="h1-h2">H2</h2>\n<h2 id="h1-h2-2">H2</h2>\n<h1 id="h1-2">H1</h1>\n<h2 id="h1-2-h2">H2</h2>\n'
)

equal(
  md().use(anchor, { nestSlugs: true }).render('# H1\n\n## H2\n\n## H2\n\n# H1\n\n## H2\n\n### H3'),
  '<h1 id="h1">H1</h1>\n<h2 id="h1-h2">H2</h2>\n<h2 id="h1-h2-2">H2</h2>\n<h1 id="h1-2">H1</h1>\n<h2 id="h1-2-h2">H2</h2>\n<h3 id="h1-2-h2-h3">H3</h3>\n'
)

equal(
  md().use(anchor).render('# H1\n\n## H2'),
  '<h1 id="h1">H1</h1>\n<h2 id="h2">H2</h2>\n'
)

equal(
  md().use(attrs, anchor).render('# H1 {id=bubblegum}\n\n## H2 {id=shoelaces}'),
  '<h1 id="bubblegum">H1</h1>\n<h2 id="shoelaces">H2</h2>\n'
)

equal(
  md().use(anchor, { level: 2 }).render('# H1\n\n## H2'),
  '<h1>H1</h1>\n<h2 id="h2">H2</h2>\n'
)

equal(
  md().use(anchor, { level: [2, 4] }).render('# H1\n\n## H2\n\n### H3\n\n#### H4\n\n##### H5'),
  '<h1>H1</h1>\n<h2 id="h2">H2</h2>\n<h3>H3</h3>\n<h4 id="h4">H4</h4>\n<h5>H5</h5>\n'
)

equal(
  md().use(anchor, { permalink: true }).render('# H1'),
  '<h1 id="h1">H1 <a class="header-anchor" href="#h1" aria-hidden="true">¶</a></h1>\n'
)

equal(
  md().use(anchor, { permalink: true, permalinkClass: 'test' }).render('# H1'),
  '<h1 id="h1">H1 <a class="test" href="#h1" aria-hidden="true">¶</a></h1>\n'
)

equal(
  md().use(anchor, { permalink: true, permalinkSymbol: 'P' }).render('# H1'),
  '<h1 id="h1">H1 <a class="header-anchor" href="#h1" aria-hidden="true">P</a></h1>\n'
)

equal(
  md().use(anchor, { permalink: true, permalinkSymbol: '<i class="icon"></i>' }).render('# H1'),
  '<h1 id="h1">H1 <a class="header-anchor" href="#h1" aria-hidden="true"><i class="icon"></i></a></h1>\n'
)

equal(
  md().use(anchor).render('# Title\n\n## Title'),
  '<h1 id="title">Title</h1>\n<h2 id="title-2">Title</h2>\n'
)

equal(
  md().use(anchor, { permalink: true, permalinkBefore: true }).render('# H1'),
  '<h1 id="h1"><a class="header-anchor" href="#h1" aria-hidden="true">¶</a> H1</h1>\n'
)

equal(
  md().use(anchor, { level: 2, permalink: true }).render('# H1\n\n## H2'),
  '<h1>H1</h1>\n<h2 id="h2">H2 <a class="header-anchor" href="#h2" aria-hidden="true">¶</a></h2>\n'
)

equal(
  md({ html: true }).use(anchor, { permalink: true }).render('# <span>H1</span>'),
  '<h1 id="h1"><span>H1</span> <a class="header-anchor" href="#h1" aria-hidden="true">¶</a></h1>\n'
)

equal(
  md().use(anchor).render('#### `options`'),
  '<h4 id="options"><code>options</code></h4>\n'
)

const calls = []
const callback = (token, info) => calls.push({ token, info })

equal(
  md().use(anchor, { callback }).render('# First Heading\n\n## Second Heading'),
  '<h1 id="first-heading">First Heading</h1>\n<h2 id="second-heading">Second Heading</h2>\n'
)

equal(
  md().use(anchor, {
    permalinkHref: (slug, state) => `${state.env.path}#${slug}`,
    permalink: true
  }).render('# H1', { path: 'file.html' }),
  '<h1 id="h1">H1 <a class="header-anchor" href="file.html#h1" aria-hidden="true">¶</a></h1>\n'
)

equal(calls.length, 2)
equal(calls[0].token.tag, 'h1')
equal(calls[0].info.title, 'First Heading')
equal(calls[0].info.slug, 'first-heading')
equal(calls[1].token.tag, 'h2')
equal(calls[1].info.title, 'Second Heading')
equal(calls[1].info.slug, 'second-heading')
