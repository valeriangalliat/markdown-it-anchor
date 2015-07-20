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
    assign(new Token('text', '', 0), { content: opts.permalinkSymbol }),
    new Token('link_close', 'a', -1)
  ]

  // `push` or `unshift` according to position option.
  // Space is at the opposite side.
  linkTokens[position[!opts.permalinkBefore]](space())
  tokens[idx + 1].children[position[opts.permalinkBefore]](...linkTokens)
}

const uniqueSlug = (slug, env) => {
  // Add slug storage to environment if it doesn't already exist.
  env.slugs = env.slugs || {}

  // Mark this slug as used in the environment.
  env.slugs[slug] = (env.slugs[slug] || 0) + 1

  // First slug, return as is.
  if (env.slugs[slug] === 1) {
    return slug
  }

  // Duplicate slug, add a `-2`, `-3`, etc. to keep ID unique.
  return slug + '-' + env.slugs[slug]
}

const anchor = (md, opts) => {
  opts = assign({}, anchor.defaults, opts)

  const addAnchors = state => {

    let env = {}
    let tokens = state.tokens

    for (let idx = 0, l = tokens.length; idx < l; idx++) {
      let token = tokens[idx]

      if (token.type !== 'heading_open') continue
      if (token.tag.substr(1) < opts.level) continue

      const title = tokens[idx + 1].children
        .reduce((acc, t) => acc + t.content, '')

      const slug = uniqueSlug(opts.slugify(title), env)

      token.attrPush(['id', slug])
    }
  }

  md.core.ruler.push('anchor', addAnchors)

  const originalHeadingOpen = md.renderer.rules.heading_open

  md.renderer.rules.heading_open = function (...args) {
    const [ tokens, idx ] = args

    if (opts.permalink) {
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
