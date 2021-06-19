import * as permalink from './permalink'

const slugify = (s) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'))

function uniqueSlug (slug, slugs, failOnNonUnique, startIndex) {
  let uniq = slug
  let i = startIndex

  if (failOnNonUnique && Object.prototype.hasOwnProperty.call(slugs, uniq)) {
    throw new Error(`User defined \`id\` attribute \`${slug}\` is not unique. Please fix it in your Markdown to continue.`)
  } else {
    while (Object.prototype.hasOwnProperty.call(slugs, uniq)) {
      uniq = `${slug}-${i}`
      i += 1
    }
  }

  slugs[uniq] = true

  return uniq
}

const isLevelSelectedNumber = selection => level => level >= selection
const isLevelSelectedArray = selection => level => selection.includes(level)

function anchor (md, opts) {
  opts = Object.assign({}, anchor.defaults, opts)

  md.core.ruler.push('anchor', state => {
    const slugs = {}
    const tokens = state.tokens

    const isLevelSelected = Array.isArray(opts.level)
      ? isLevelSelectedArray(opts.level)
      : isLevelSelectedNumber(opts.level)

    for (const token of tokens) {
      if (token.type !== 'heading_open') {
        continue
      }

      if (!isLevelSelected(Number(token.tag.substr(1)))) {
        continue
      }

      // A permalink renderer could modify the `tokens` array so
      // make sure to get the up-to-date index on each iteration.
      const index = tokens.indexOf(token)

      // Aggregate the next token children text.
      const title = tokens[index + 1]
        .children
        .filter(token => token.type === 'text' || token.type === 'code_inline')
        .reduce((acc, t) => acc + t.content, '')

      let slug = token.attrGet('id')

      if (slug == null) {
        slug = uniqueSlug(opts.slugify(title), slugs, false, opts.uniqueSlugStartIndex)
      } else {
        slug = uniqueSlug(slug, slugs, true, opts.uniqueSlugStartIndex)
      }

      token.attrSet('id', slug)

      if (opts.tabIndex !== false) {
        token.attrSet('tabindex', `${opts.tabIndex}`)
      }

      if (typeof opts.permalink === 'function') {
        opts.permalink(slug, opts, state, index)
      } else if (opts.permalink) {
        opts.renderPermalink(slug, opts, state, index)
      } else if (opts.renderPermalink && opts.renderPermalink !== permalink.legacy) {
        opts.renderPermalink(slug, opts, state, index)
      }

      if (opts.callback) {
        opts.callback(token, { slug, title })
      }
    }
  })
}

anchor.permalink = permalink

anchor.defaults = {
  level: 1,
  slugify,
  uniqueSlugStartIndex: 1,
  tabIndex: '-1',

  // Legacy options.
  permalink: false,
  renderPermalink: permalink.legacy,
  permalinkClass: permalink.ariaHidden.defaults.class,
  permalinkSpace: permalink.ariaHidden.defaults.space,
  permalinkSymbol: '¶',
  permalinkBefore: permalink.ariaHidden.defaults.placement === 'before',
  permalinkHref: permalink.ariaHidden.defaults.renderHref,
  permalinkAttrs: permalink.ariaHidden.defaults.renderAttrs
}

export default anchor
