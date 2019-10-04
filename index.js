const slugify = (s) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'))

const position = {
  false: 'push',
  true: 'unshift'
}

const hasProp = Object.prototype.hasOwnProperty

const permalinkHref = slug => `#${slug}`

const createLink = (state, className, href, content) => {
  return [
    Object.assign(new state.Token('link_open', 'a', 1), {
      attrs: [
        ['class', className],
        ['href', href],
        ['aria-hidden', 'true']
      ]
    }),
    Object.assign(new state.Token('html_block', '', 0), { content }),
    new state.Token('link_close', 'a', -1)
  ]
}

const addLink = (state, withSpace, before, idx, linkTokens) => {
  const space = () => Object.assign(new state.Token('text', '', 0), { content: ' ' })

  // `push` or `unshift` according to position option.
  // Space is at the opposite side.
  if (withSpace) {
    linkTokens[position[!before]](space())
  }

  state.tokens[idx + 1].children[position[before]](...linkTokens)
}

const renderPermalink = (slug, opts, state, idx) => {
  const linkTokens = createLink(state, opts.permalinkClass,
    opts.permalinkHref(slug, state), opts.permalinkSymbol)

  addLink(state, opts.permalinkSpace, opts.permalinkBefore, idx, linkTokens)
}

const renderToplink = (slug, opts, state, idx) => {
  const linkTokens = createLink(state, opts.toplinkClass, `#${opts.toplinkName}`,
    opts.toplinkSymbol)

  addLink(state, opts.toplinkSpace, opts.toplinkBefore, idx, linkTokens)
}

const uniqueSlug = (slug, slugs) => {
  let uniq = slug
  let i = 2
  while (hasProp.call(slugs, uniq)) uniq = `${slug}-${i++}`
  slugs[uniq] = true
  return uniq
}

const isLevelSelectedNumber = selection => level => level >= selection
const isLevelSelectedArray = selection => level => selection.includes(level)

const anchor = (md, opts) => {
  opts = Object.assign({}, anchor.defaults, opts)

  md.core.ruler.push('anchor', state => {
    const slugs = {}
    const tokens = state.tokens

    const isLevelSelected = Array.isArray(opts.level)
      ? isLevelSelectedArray(opts.level)
      : isLevelSelectedNumber(opts.level)

    tokens
      .filter(token => token.type === 'heading_open')
      .filter(token => isLevelSelected(Number(token.tag.substr(1))))
      .forEach(token => {
        // Aggregate the next token children text.
        const title = tokens[tokens.indexOf(token) + 1]
          .children
          .filter(token => token.type === 'text' || token.type === 'code_inline')
          .reduce((acc, t) => acc + t.content, '')

        let slug = token.attrGet('id')

        if (slug == null) {
          slug = uniqueSlug(opts.slugify(title), slugs)
          token.attrPush(['id', slug])
        }

        if (opts.permalink) {
          opts.renderPermalink(slug, opts, state, tokens.indexOf(token))
        }

        if (opts.toplink) {
          opts.renderToplink(slug, opts, state, tokens.indexOf(token))
        }

        if (opts.callback) {
          opts.callback(token, { slug, title })
        }
      })
  })
}

anchor.defaults = {
  level: 1,
  slugify,
  permalink: false,
  renderPermalink,
  permalinkClass: 'header-anchor',
  permalinkSpace: true,
  permalinkSymbol: '¶',
  permalinkBefore: false,
  permalinkHref,
  toplink: false,
  renderToplink,
  toplinkClass: 'header-toplink',
  toplinkSpace: true,
  toplinkSymbol: '↑',
  toplinkBefore: true,
  toplinkName: 'top'
}

export default anchor
