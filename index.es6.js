import assign from 'lodash.assign'
import string from 'string'
import Token from 'markdown-it/lib/token'

const slugify = s =>
  string(s).slugify().toString()

const renderPermalink = (slug, opts, tokens, idx) =>
  tokens[idx + 1].children.unshift(
    assign(new Token('link_open', 'a', 1), {
      attrs: [['class', opts.permalinkClass], ['href', `#${slug}`]],
    }),
    assign(new Token('text', '', 0), { content: opts.permalinkSymbol }),
    new Token('link_close', 'a', -1),
    assign(new Token('text', '', 0), { content: ' ' })
  )

const uniqueSlug = (slug, env) => {
  // Add slug storage to environment if it doesn't already exist.
  env.slugs ||= {}

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

  const originalHeadingOpen = md.renderer.rules.heading_open

  md.renderer.rules.heading_open = function (...args) {
    const [ tokens, idx, , env, self ] = args

    if (tokens[idx].tag.substr(1) >= opts.level) {
      const title = tokens[idx + 1].children
        .reduce((acc, t) => acc + t.content, '')

      const slug = uniqueSlug(opts.slugify(title), env)

      ;(tokens[idx].attrs ||= []).push(['id', slug])

      if (opts.permalink) {
        opts.renderPermalink(slug, opts, ...args)
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
  permalinkSymbol: '¶',
}

export default anchor
