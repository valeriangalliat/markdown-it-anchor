import { equal } from 'assert'
import md from 'markdown-it'
import attrs from 'markdown-it-attrs'
import anchor from './'

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
