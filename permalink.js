let emittedWarning = false

const position = {
  false: 'push',
  true: 'unshift',
  after: 'push',
  before: 'unshift'
}

export function legacy (slug, opts, state, idx) {
  if (!emittedWarning) {
    const warningText = 'Using deprecated markdown-it-anchor permalink option, see https://github.com/valeriangalliat/markdown-it-anchor#todo-anchor-or-file'

    if (process && process.emitWarning) {
      process.emitWarning(warningText)
    } else {
      console.warn(warningText)
    }

    emittedWarning = true
  }

  const linkTokens = [
    Object.assign(new state.Token('link_open', 'a', 1), {
      attrs: [
        ...(opts.permalinkClass ? [['class', opts.permalinkClass]] : []),
        ['href', opts.permalinkHref(slug, state)],
        ...Object.entries(opts.permalinkAttrs(slug, state))
      ]
    }),
    Object.assign(new state.Token('html_block', '', 0), { content: opts.permalinkSymbol }),
    new state.Token('link_close', 'a', -1)
  ]

  if (opts.permalinkSpace) {
    state.tokens[idx + 1].children[position[opts.permalinkBefore]](Object.assign(new state.Token('text', '', 0), { content: ' ' }))
  }

  state.tokens[idx + 1].children[position[opts.permalinkBefore]](...linkTokens)
}

export function renderHref (slug) {
  return `#${slug}`
}

export function renderAttrs (slug) {
  return {}
}

const commonDefaults = {
  class: 'header-anchor',
  symbol: '#',
  renderHref,
  renderAttrs
}

export function makePermalink (wrappedRenderPermalink) {
  function renderPermalink (opts) {
    opts = Object.assign({}, renderPermalink.defaults, opts)

    return (slug, anchorOpts, state, idx) => {
      return wrappedRenderPermalink(slug, opts, anchorOpts, state, idx)
    }
  }

  renderPermalink.defaults = Object.assign({}, commonDefaults)

  return renderPermalink
}

export const ariaHidden = makePermalink((slug, opts, anchorOpts, state, idx) => {
  const linkTokens = [
    Object.assign(new state.Token('link_open', 'a', 1), {
      attrs: [
        ...(opts.class ? [['class', opts.class]] : []),
        ['href', opts.renderHref(slug, state)],
        ['aria-hidden', 'true'],
        ...Object.entries(opts.renderAttrs(slug, state))
      ]
    }),
    Object.assign(new state.Token('text', '', 0), { content: opts.symbol }),
    new state.Token('link_close', 'a', -1)
  ]

  if (opts.space) {
    state.tokens[idx + 1].children[position[opts.placement]](Object.assign(new state.Token('text', '', 0), { content: ' ' }))
  }

  state.tokens[idx + 1].children[position[opts.placement]](...linkTokens)
})

Object.assign(ariaHidden.defaults, {
  space: true,
  placement: 'after'
})

export const headerLink = makePermalink((slug, opts, anchorOpts, state, idx) => {
  const linkTokens = [
    Object.assign(new state.Token('link_open', 'a', 1), {
      attrs: [
        ...(opts.class ? [['class', opts.class]] : []),
        ['href', opts.renderHref(slug, state)],
        ...Object.entries(opts.renderAttrs(slug, state))
      ]
    }),
    ...state.tokens[idx + 1].children,
    new state.Token('link_close', 'a', -1)
  ]

  state.tokens[idx + 1] = Object.assign(new state.Token('inline', '', 0), {
    children: linkTokens
  })
})

export const linkAfterHeader = makePermalink((slug, opts, anchorOpts, state, idx) => {
  if (!['visually-hidden', 'aria-label', 'aria-describedby', 'aria-labelledby'].includes(opts.style)) {
    throw new Error(`\`permalink.linkAfterHeader\` called with unknown style option \`${opts.style}\``)
  }

  if (!['aria-describedby', 'aria-labelledby'].includes(opts.style) && !opts.assistiveText) {
    throw new Error(`\`permalink.linkAfterHeader\` called without the \`assistiveText\` option in \`${opts.style}\` style`)
  }

  if (opts.style === 'visually-hidden' && !opts.visuallyHiddenClass) {
    throw new Error('`permalink.linkAfterHeader` called without the `visuallyHiddenClass` option in `visually-hidden` style')
  }

  const title = state.tokens[idx + 1]
    .children
    .filter(token => token.type === 'text' || token.type === 'code_inline')
    .reduce((acc, t) => acc + t.content, '')

  const subLinkTokens = []
  const linkAttrs = []

  if (opts.class) {
    linkAttrs.push(['class', opts.class])
  }

  linkAttrs.push(['href', opts.renderHref(slug, state)])
  linkAttrs.push(...Object.entries(opts.renderAttrs(slug, state)))

  if (opts.style === 'visually-hidden') {
    subLinkTokens.push(
      Object.assign(new state.Token('span_open', 'span', 1), {
        attrs: [['class', opts.visuallyHiddenClass]],
      }),
      Object.assign(new state.Token('text', '', 0), {
        content: opts.assistiveText(title)
      }),
      new state.Token('span_close', 'span', -1)
    )

    if (opts.space) {
      subLinkTokens[position[opts.placement]](Object.assign(new state.Token('text', '', 0), { content: ' ' }))
    }

    subLinkTokens[position[opts.placement]](
      Object.assign(new state.Token('span_open', 'span', 1), {
        attrs: [['aria-hidden', 'true']],
      }),
      Object.assign(new state.Token('text', '', 0), {
        content: opts.symbol,
      }),
      new state.Token('span_close', 'span', -1)
    )
  } else {
    subLinkTokens.push(
      Object.assign(new state.Token('text', '', 0), {
        content: opts.symbol,
      })
    )
  }

  if (opts.style === 'aria-label') {
    linkAttrs.push(['aria-label', opts.assistiveText(title)])
  } else if (['aria-describedby', 'aria-labelledby'].includes(opts.style)) {
    linkAttrs.push([opts.style, slug])
  }

  const linkTokens = [
    Object.assign(new state.Token('link_open', 'a', 1), {
      attrs: linkAttrs
    }),
    ...subLinkTokens,
    new state.Token('link_close', 'a', -1),
  ]

  state.tokens.splice(idx + 3, 0, ...linkTokens)
})

Object.assign(linkAfterHeader.defaults, {
  style: 'visually-hidden',
  space: true,
  placement: 'after'
})
