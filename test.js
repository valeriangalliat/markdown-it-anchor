import { equal } from 'assert'
import md from 'markdown-it'
import anchor from './'

equal(
  md().use(anchor).render('# H1\n\n## H2'),
  '<h1 id="h1">H1</h1>\n<h2 id="h2">H2</h2>\n'
)

equal(
  md().use(anchor, { level: 2 }).render('# H1\n\n## H2'),
  '<h1>H1</h1>\n<h2 id="h2">H2</h2>\n'
)

equal(
  md().use(anchor, { permalink: true }).render('# H1'),
  '<h1 id="h1"><a class="header-anchor" href="#h1">¶</a> H1</h1>\n'
)

equal(
  md().use(anchor, { permalink: true, permalinkClass: 'test' }).render('# H1'),
  '<h1 id="h1"><a class="test" href="#h1">¶</a> H1</h1>\n'
)
