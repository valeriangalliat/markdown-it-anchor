const test = require('ava')
const md = require('markdown-it')
const attrs = require('markdown-it-attrs')
const anchor = require('./')

function nest (group, f) {
  f((name, ...args) => test(`${group}: ${name}`, ...args))
}

test('default', t => {
  t.is(
    md().use(anchor).render('# H1\n\n## H2'),
    '<h1 id="h1" tabindex="-1">H1</h1>\n<h2 id="h2" tabindex="-1">H2</h2>\n'
  )
})

nest('makrdown-it-attrs', test => {
  test('default', t => {
    t.is(
      md().use(attrs).use(anchor).render('# H1 {id=bubblegum}\n\n## H2 {id=shoelaces}'),
      '<h1 id="bubblegum" tabindex="-1">H1</h1>\n<h2 id="shoelaces" tabindex="-1">H2</h2>\n'
    )
  })

  test('partial auto', t => {
    t.is(
      md().use(attrs).use(anchor).render('# H1 {id=h2}\n\n## H2'),
      '<h1 id="h2" tabindex="-1">H1</h1>\n<h2 id="h2-1" tabindex="-1">H2</h2>\n'
    )
  })

  test('id conflict user', t => {
    t.is(
      (() => {
        try {
          return md().use(attrs).use(anchor).render('# H1 {id=bubblegum}\n\n## H2 {id=bubblegum}')
        } catch (ex) {
          return ex.message
        }
      })(),
      'User defined `id` attribute `bubblegum` is not unique. Please fix it in your Markdown to continue.'
    )
  })

  test('id conflict auto', t => {
    t.is(
      (() => {
        try {
          return md().use(attrs).use(anchor).render('# H1\n\n## H2 {id=h1}')
        } catch (ex) {
          return ex.message
        }
      })(),
      'User defined `id` attribute `h1` is not unique. Please fix it in your Markdown to continue.'
    )
  })
})

test('level number', t => {
  t.is(
    md().use(anchor, { level: 2 }).render('# H1\n\n## H2'),
    '<h1>H1</h1>\n<h2 id="h2" tabindex="-1">H2</h2>\n'
  )
})

test('level array', t => {
  t.is(
    md().use(anchor, { level: [2, 4] }).render('# H1\n\n## H2\n\n### H3\n\n#### H4\n\n##### H5'),
    '<h1>H1</h1>\n<h2 id="h2" tabindex="-1">H2</h2>\n<h3>H3</h3>\n<h4 id="h4" tabindex="-1">H4</h4>\n<h5>H5</h5>\n'
  )
})

nest('legacy permalink', test => {
  test('default', t => {
    t.is(
      md().use(anchor, { permalink: true }).render('# H1'),
      '<h1 id="h1" tabindex="-1">H1 <a class="header-anchor" href="#h1">¶</a></h1>\n'
    )
  })

  test('class', t => {
    t.is(
      md().use(anchor, { permalink: true, permalinkClass: 'test' }).render('# H1'),
      '<h1 id="h1" tabindex="-1">H1 <a class="test" href="#h1">¶</a></h1>\n'
    )
  })

  test('class null', t => {
    t.is(
      md().use(anchor, { permalink: true, permalinkClass: null }).render('# H1'),
      '<h1 id="h1" tabindex="-1">H1 <a href="#h1">¶</a></h1>\n'
    )
  })

  test('symbol', t => {
    t.is(
      md().use(anchor, { permalink: true, permalinkSymbol: 'P' }).render('# H1'),
      '<h1 id="h1" tabindex="-1">H1 <a class="header-anchor" href="#h1">P</a></h1>\n'
    )
  })

  test('symbol html', t => {
    t.is(
      md().use(anchor, { permalink: true, permalinkSymbol: '<i class="icon"></i>' }).render('# H1'),
      '<h1 id="h1" tabindex="-1">H1 <a class="header-anchor" href="#h1"><i class="icon"></i></a></h1>\n'
    )
  })

  test('before', t => {
    t.is(
      md().use(anchor, { permalink: true, permalinkBefore: true }).render('# H1'),
      '<h1 id="h1" tabindex="-1"><a class="header-anchor" href="#h1">¶</a> H1</h1>\n'
    )
  })

  test('level', t => {
    t.is(
      md().use(anchor, { level: 2, permalink: true }).render('# H1\n\n## H2'),
      '<h1>H1</h1>\n<h2 id="h2" tabindex="-1">H2 <a class="header-anchor" href="#h2">¶</a></h2>\n'
    )
  })

  test('html', t => {
    t.is(
      md({ html: true }).use(anchor, { permalink: true }).render('# <span>H1</span>'),
      '<h1 id="h1" tabindex="-1"><span>H1</span> <a class="header-anchor" href="#h1">¶</a></h1>\n'
    )
  })

  test('href', t => {
    t.is(
      md().use(anchor, {
        permalinkHref: (slug, state) => `${state.env.path}#${slug}`,
        permalink: true
      }).render('# H1', { path: 'file.html' }),
      '<h1 id="h1" tabindex="-1">H1 <a class="header-anchor" href="file.html#h1">¶</a></h1>\n'
    )
  })

  test('space', t => {
    t.is(
      md({ html: true }).use(anchor, { permalink: true, permalinkSpace: false }).render('# H1'),
      '<h1 id="h1" tabindex="-1">H1<a class="header-anchor" href="#h1">¶</a></h1>\n'
    )
  })

  test('no space', t => {
    t.is(
      md({ html: true }).use(anchor, { permalink: false, permalinkSpace: false }).render('# H1'),
      '<h1 id="h1" tabindex="-1">H1</h1>\n'
    )
  })

  test('attrs', t => {
    t.is(
      md()
        .use(anchor, { permalink: true, permalinkAttrs: (slug, state) => ({ 'aria-label': `permalink to ${slug}`, title: 'permalink' }) })
        .render('# My title'),
      '<h1 id="my-title" tabindex="-1">My title <a class="header-anchor" href="#my-title" aria-label="permalink to my-title" title="permalink">¶</a></h1>\n'
    )
  })
})

test('tabindex', t => {
  t.is(
    md().use(anchor).render('# Title\n\n## Title'),
    '<h1 id="title" tabindex="-1">Title</h1>\n<h2 id="title-1" tabindex="-1">Title</h2>\n'
  )
})

test('code', t => {
  t.is(
    md().use(anchor).render('#### `options`'),
    '<h4 id="options" tabindex="-1"><code>options</code></h4>\n'
  )
})

test('callback', t => {
  const calls = []
  const callback = (token, info) => calls.push({ token, info })

  t.is(
    md().use(anchor, { callback }).render('# First Heading\n\n## Second Heading'),
    '<h1 id="first-heading" tabindex="-1">First Heading</h1>\n<h2 id="second-heading" tabindex="-1">Second Heading</h2>\n'
  )

  t.is(calls.length, 2)
  t.is(calls[0].token.tag, 'h1')
  t.is(calls[0].info.title, 'First Heading')
  t.is(calls[0].info.slug, 'first-heading')
  t.is(calls[1].token.tag, 'h2')
  t.is(calls[1].info.title, 'Second Heading')
  t.is(calls[1].info.slug, 'second-heading')
})

test('tabIndex false', t => {
  t.is(
    md().use(anchor, { tabIndex: false }).render('# H1\n\n## H2'),
    '<h1 id="h1">H1</h1>\n<h2 id="h2">H2</h2>\n'
  )
})

test('tabIndex 0', t => {
  t.is(
    md().use(anchor, { tabIndex: '0' }).render('# H1\n\n## H2'),
    '<h1 id="h1" tabindex="0">H1</h1>\n<h2 id="h2" tabindex="0">H2</h2>\n'
  )
})

test('uniqueSlugStartIndex', t => {
  t.is(
    md()
      .use(anchor, { uniqueSlugStartIndex: 2 })
      .render('# Lorem\n## Lorem\n### Lorem'),
    '<h1 id="lorem" tabindex="-1">Lorem</h1>\n<h2 id="lorem-2" tabindex="-1">Lorem</h2>\n<h3 id="lorem-3" tabindex="-1">Lorem</h3>\n'
  )
})

test('nested things', t => {
  t.is(
    md({ html: true }).use(anchor).render('# H1 [link](link) ![image](link) `code` ~~strike~~ _em_ **strong** <span>inline html</span>'),
    '<h1 id="h1-link-code-strike-em-strong-inline-html" tabindex="-1">H1 <a href="link">link</a> <img src="link" alt="image"> <code>code</code> <s>strike</s> <em>em</em> <strong>strong</strong> <span>inline html</span></h1>\n'
  )
})

test('getTokensText', t => {
  t.is(
    md().use(anchor, {
      getTokensText: tokens => tokens.filter(t => ['text', 'image'].includes(t.type)).map(t => t.content).join('')
    }).render('# H1 ![image](link) `code` _em_'),
    '<h1 id="h1-image-em" tabindex="-1">H1 <img src="link" alt="image"> <code>code</code> <em>em</em></h1>\n'
  )
})

test('slugify', t => {
	t.is(
		md().use(anchor, { slugify: (title, env) => `${env.docId}-${title}` }).render('# bar', { docId: 'foo' }),
		'<h1 id="foo-bar" tabindex="-1">bar</h1>\n'
	)
})

nest('permalink.linkInsideHeader', test => {
  test('default', t => {
    t.is(
      md().use(anchor, { permalink: anchor.permalink.linkInsideHeader() }).render('# H1'),
      '<h1 id="h1" tabindex="-1">H1 <a class="header-anchor" href="#h1">#</a></h1>\n'
    )
  })

  test('no space', t => {
    t.is(
      md().use(anchor, { permalink: anchor.permalink.linkInsideHeader({ space: false }) }).render('# H1'),
      '<h1 id="h1" tabindex="-1">H1<a class="header-anchor" href="#h1">#</a></h1>\n'
    )
  })

  test('custom space', t => {
    t.is(
      md().use(anchor, { permalink: anchor.permalink.linkInsideHeader({ space: '&nbsp;' }) }).render('# H1'),
      '<h1 id="h1" tabindex="-1">H1&nbsp;<a class="header-anchor" href="#h1">#</a></h1>\n'
    )
  })

  test('html', t => {
    const symbol = '<span class="visually-hidden">Jump to heading</span> <span aria-hidden="true">#</span>'

    t.is(
      md().use(anchor, {
        permalink: anchor.permalink.linkInsideHeader({
          symbol,
          placement: 'before'
        })
      }).render('# H1'),
      `<h1 id="h1" tabindex="-1"><a class="header-anchor" href="#h1">${symbol}</a> H1</h1>\n`
    )
  })

  test('renderAttrs', t => {
    t.is(
      md().use(anchor, {
        permalink: anchor.permalink.linkInsideHeader({
          renderAttrs: () => ({
            class: 'should-merge-class',
            id: 'some-id'
          })
        })
      }).render('# H1'),
      '<h1 id="h1" tabindex="-1">H1 <a class="header-anchor should-merge-class" href="#h1" id="some-id">#</a></h1>\n'
    )
  })
})

nest('permalink.ariaHidden', test => {
  test('default', t => {
    t.is(
      md().use(anchor, { permalink: anchor.permalink.ariaHidden() }).render('# H1'),
      '<h1 id="h1" tabindex="-1">H1 <a class="header-anchor" href="#h1" aria-hidden="true">#</a></h1>\n'
    )
  })

  test('html', t => {
    t.is(
      md().use(anchor, {
        permalink: anchor.permalink.ariaHidden({
          symbol: '<i class="icon"></i>'
        })
      }).render('# H1'),
      '<h1 id="h1" tabindex="-1">H1 <a class="header-anchor" href="#h1" aria-hidden="true"><i class="icon"></i></a></h1>\n'
    )
  })
})

nest('permalink.headerLink', test => {
  test('default', t => {
    t.is(
      md().use(anchor, { permalink: anchor.permalink.headerLink() }).render('# H1'),
      '<h1 id="h1" tabindex="-1"><a class="header-anchor" href="#h1">H1</a></h1>\n'
    )
  })

  test('Safari reader fix', t => {
    t.is(
      md().use(anchor, { permalink: anchor.permalink.headerLink({ safariReaderFix: true }) }).render('# H1'),
      '<h1 id="h1" tabindex="-1"><a class="header-anchor" href="#h1"><span>H1</span></a></h1>\n'
    )
  })
})

nest('permalink.linkAfterHeader', test => {
  test('default', t => {
    t.is(
      md().use(anchor, {
        permalink: anchor.permalink.linkAfterHeader({
          symbol: '<i class="icon"></i>',
          style: 'visually-hidden',
          assistiveText: title => `Permalink to “${title}”`,
          visuallyHiddenClass: 'visually-hidden'
        })
      }).render('# H1'),
      '<h1 id="h1" tabindex="-1">H1</h1>\n<a class="header-anchor" href="#h1"><span class="visually-hidden">Permalink to “H1”</span> <span aria-hidden="true"><i class="icon"></i></span></a>'
    )
  })

  test('no symbol', t => {
    t.is(
      md().use(anchor, {
        permalink: anchor.permalink.linkAfterHeader({
          style: 'visually-hidden',
          assistiveText: title => `Permalink to “${title}”`,
          visuallyHiddenClass: 'visually-hidden'
        })
      }).render('# H1'),
      '<h1 id="h1" tabindex="-1">H1</h1>\n<a class="header-anchor" href="#h1"><span class="visually-hidden">Permalink to “H1”</span> <span aria-hidden="true">#</span></a>'
    )
  })

  test('multiple headers', t => {
    t.is(
      md().use(anchor, {
        permalink: anchor.permalink.linkAfterHeader({
          style: 'visually-hidden',
          assistiveText: title => `Permalink to “${title}”`,
          visuallyHiddenClass: 'visually-hidden'
        })
      }).render('# H1\n\n## H2\n\n### H3\n\n#### H4\n\n## H2-2'),
      '<h1 id="h1" tabindex="-1">H1</h1>\n<a class="header-anchor" href="#h1"><span class="visually-hidden">Permalink to “H1”</span> ' +
      '<span aria-hidden="true">#</span></a><h2 id="h2" tabindex="-1">H2</h2>\n<a class="header-anchor" href="#h2"><span class="visually-hidden">Permalink to “H2”</span> ' +
      '<span aria-hidden="true">#</span></a><h3 id="h3" tabindex="-1">H3</h3>\n<a class="header-anchor" href="#h3"><span class="visually-hidden">Permalink to “H3”</span> ' +
      '<span aria-hidden="true">#</span></a><h4 id="h4" tabindex="-1">H4</h4>\n<a class="header-anchor" href="#h4"><span class="visually-hidden">Permalink to “H4”</span> ' +
      '<span aria-hidden="true">#</span></a><h2 id="h2-2" tabindex="-1">H2-2</h2>\n<a class="header-anchor" href="#h2-2"><span class="visually-hidden">Permalink to “H2-2”</span> <span aria-hidden="true">#</span></a>'
    )
  })

  test('aria-label', t => {
    t.is(
      md().use(anchor, {
        permalink: anchor.permalink.linkAfterHeader({
          style: 'aria-label',
          assistiveText: title => `Permalink to “${title}”`
        })
      }).render('# H1'),
      '<h1 id="h1" tabindex="-1">H1</h1>\n<a class="header-anchor" href="#h1" aria-label="Permalink to “H1”">#</a>'
    )
  })

  test('aria-describedby', t => {
    t.is(
      md().use(anchor, {
        permalink: anchor.permalink.linkAfterHeader({
          style: 'aria-describedby'
        })
      }).render('# H1'),
      '<h1 id="h1" tabindex="-1">H1</h1>\n<a class="header-anchor" href="#h1" aria-describedby="h1">#</a>'
    )
  })

  test('placement', t => {
    t.is(
      md().use(anchor, {
        permalink: anchor.permalink.linkAfterHeader({
          style: 'visually-hidden',
          assistiveText: title => `Permalink to “${title}”`,
          visuallyHiddenClass: 'visually-hidden',
          placement: 'before',
          space: false
        })
      }).render('# H1'),
      '<h1 id="h1" tabindex="-1">H1</h1>\n<a class="header-anchor" href="#h1"><span aria-hidden="true">#</span><span class="visually-hidden">Permalink to “H1”</span></a>'
    )
  })

  test('custom splice wrapper', t => {
    const linkAfterHeader = anchor.permalink.linkAfterHeader({
      style: 'visually-hidden',
      assistiveText: title => `Permalink to “${title}”`,
      visuallyHiddenClass: 'visually-hidden'
    })

    t.is(
      md().use(anchor, {
        permalink (slug, opts, state, idx) {
          state.tokens.splice(idx, 0, Object.assign(new state.Token('div_open', 'div', 1), {
            attrs: [['class', 'wrapper']],
            block: true
          }))

          state.tokens.splice(idx + 4, 0, Object.assign(new state.Token('div_close', 'div', -1), {
            block: true
          }))

          linkAfterHeader(slug, opts, state, idx + 1)
        }
      }).render('# H1'),
      '<div class="wrapper">\n<h1 id="h1" tabindex="-1">H1</h1>\n<a class="header-anchor" href="#h1"><span class="visually-hidden">Permalink to “H1”</span> <span aria-hidden="true">#</span></a></div>\n'
    )
  })

  test('custom native wrapper', t => {
    t.is(
      md().use(anchor, {
        permalink: anchor.permalink.linkAfterHeader({
          style: 'visually-hidden',
          assistiveText: title => `Permalink to “${title}”`,
          visuallyHiddenClass: 'visually-hidden',
          wrapper: ['<div class="wrapper">', '</div>']
        })
      }).render('# H1'),
      '<div class="wrapper">\n<h1 id="h1" tabindex="-1">H1</h1>\n<a class="header-anchor" href="#h1"><span class="visually-hidden">Permalink to “H1”</span> <span aria-hidden="true">#</span></a></div>\n'
    )
  })
})

nest('tokens', test => {
  function dumpTokens (cb) {
    return md => {
      md.core.ruler.push('test', state => {
        cb(state.tokens)
      })
    }
  }

  test('legacy permalink html_block', t => {
    md().use(anchor, { permalink: true }).use(dumpTokens(tokens => {
      // Ensure consistent legacy behaviour of `html_block`.
      t.is(tokens[1].children[3].type, 'html_block')
      t.is(tokens[1].children[3].content, '¶')

      // Check proper meta is set.
      t.deepEqual(tokens[1].children[3].meta, { isPermalinkSymbol: true })
    })).render('# H1')
  })

  test('new permalink html_inline', t => {
    md().use(anchor, { permalink: anchor.permalink.ariaHidden() }).use(dumpTokens(tokens => {
      t.is(tokens[1].children[3].type, 'html_inline')
      t.is(tokens[1].children[3].content, '#')
      t.deepEqual(tokens[1].children[3].meta, { isPermalinkSymbol: true })
    })).render('# H1')
  })
})
