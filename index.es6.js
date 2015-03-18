import assign from 'lodash.assign'
import string from 'string'
import Token from 'markdown-it/lib/token'

const slugify = s =>
  string(s).slugify().toString()

const renderPermalink = (slug, className, tokens, idx) =>
  tokens[idx + 1].children.unshift(
    assign(new Token('link_open', 'a', 1), {
      attrs: [['class', className], ['href', `#${slug}`]],
    }),
    assign(new Token('text', '', 0), { content: '¶' }),
    new Token('link_close', 'a', -1),
    assign(new Token('text', '', 0), { content: ' ' })
  )

const anchor = (md, opts) => {
  opts = assign({}, anchor.defaults, opts)

  const originalHeadingOpen = md.renderer.rules.heading_open

  md.renderer.rules.heading_open = function (...args) {
    const [ tokens, idx, , , self ] = args

    if (tokens[idx].tag.substr(1) >= opts.level) {
      const title = tokens[idx + 1].children
        .reduce((acc, t) => acc + t.content, '')

      const slug = opts.slugify(title)

      ;(tokens[idx].attrs ||= []).push(['id', slug])

      if (opts.permalink) {
        opts.renderPermalink(slug, opts.permalinkClass, ...args)
      }
    }

    if (originalHeadingOpen) {
      return originalHeadingOpen.apply(this, args)
    } else {
      return self.renderToken(...args)
    }
  }
}

anchor.defaults = {
  level: 1,
  slugify,
  permalink: false,
  renderPermalink,
  permalinkClass: 'header-anchor',
}

export default anchor
