import assign from 'lodash.assign'
import string from 'string'
import Token from 'markdown-it/lib/token'

const slugify = s =>
  string(s).slugify().toString()

const space = () =>
  assign(new Token('text', '', 0), { content: ' ' })

const position = {
  false: 'push',
  true: 'unshift'
}

const getAttr = (token, name) =>
  token.attrs[token.attrIndex(name)][1]

const renderPermalink = (slug, opts, tokens, idx) => {
  const linkTokens = [
    assign(new Token('link_open', 'a', 1), {
      attrs: [
        ['class', opts.permalinkClass],
        ['href', `#${slug}`],
        ['aria-hidden', 'true']
      ]
    }),
    assign(new Token('html_block', '', 0), { content: opts.permalinkSymbol }),
    new Token('link_close', 'a', -1)
  ]

  // `push` or `unshift` according to position option.
  // Space is at the opposite side.
  linkTokens[position[!opts.permalinkBefore]](space())
  tokens[idx + 1].children[position[opts.permalinkBefore]](...linkTokens)
}

const uniqueSlug = (slug, slugs) => {
  // Mark this slug as used in the environment.
  slugs[slug] = (slugs[slug] || 0) + 1

  // First slug, return as is.
  if (slugs[slug] === 1) {
    return slug
  }

  // Duplicate slug, add a `-2`, `-3`, etc. to keep ID unique.
  return slug + '-' + slugs[slug]
}

const anchor = (md, opts) => {
  opts = assign({}, anchor.defaults, opts)

  md.core.ruler.push('anchor', state => {
    const slugs = {}
    const tokens = state.tokens

    tokens
      .filter(token => token.type === 'heading_open')
      .filter(token => token.tag.substr(1) >= opts.level)
      .forEach(token => {
        // Aggregate the next token children text.
        const title = tokens[tokens.indexOf(token) + 1].children
          .reduce((acc, t) => acc + t.content, '')

        const slug = uniqueSlug(opts.slugify(title), slugs)

        token.attrPush(['id', slug])
      })
  })

  const originalHeadingOpen = md.renderer.rules.heading_open

  md.renderer.rules.heading_open = function (...args) {
    const [ tokens, idx ] = args

    if (opts.permalink && tokens[idx].tag.substr(1) >= opts.level) {
      const slug = getAttr(tokens[idx], 'id')

      opts.renderPermalink(slug, opts, ...args)
    }

    if (originalHeadingOpen) {
      return originalHeadingOpen.apply(this, args)
    } else {
      return md.renderer.renderToken(...args)
    }
  }
}

anchor.defaults = {
  level: 1,
  slugify,
  permalink: false,
  renderPermalink,
  permalinkClass: 'header-anchor',
  permalinkSymbol: '¶',
  permalinkBefore: false
}

export default anchor
