const string = require('string')

const slugify = s =>
  string(s).slugify().toString()

const position = {
  false: 'push',
  true: 'unshift'
}

const hasProp = ({}).hasOwnProperty

const permalinkHref = slug => `#${slug}`

const renderPermalink = (slug, opts, state, idx) => {
  const space = () =>
    Object.assign(new state.Token('text', '', 0), { content: ' ' })

  const linkTokens = [
    Object.assign(new state.Token('link_open', 'a', 1), {
      attrs: [
        ['class', opts.permalinkClass],
        ['href', opts.permalinkHref(slug, state)],
        ['aria-hidden', 'true']
      ]
    }),
    Object.assign(new state.Token('html_block', '', 0), { content: opts.permalinkSymbol }),
    new state.Token('link_close', 'a', -1)
  ]

  // `push` or `unshift` according to position option.
  // Space is at the opposite side.
  linkTokens[position[!opts.permalinkBefore]](space())
  state.tokens[idx + 1].children[position[opts.permalinkBefore]](...linkTokens)
}

const uniqueSlug = (slug, slugs) => {
  // Mark this slug as used in the environment.
  slugs[slug] = (hasProp.call(slugs, slug) ? slugs[slug] : 0) + 1

  // console.log(slugs, slug)

  // First slug, return as is.
  if (slugs[slug] === 1) {
    return slug
  }

  // Duplicate slug, add a `-2`, `-3`, etc. to keep ID unique.
  return slug + '-' + slugs[slug]
}

const isLevelSelectedNumber = selection => level => level >= selection
const isLevelSelectedArray = selection => level => selection.includes(level)

const buildSlugString = (slugHistory, modifier, slugString) => {
  return slugHistory[slugHistory.length - modifier].slug + '-' + slugString
}

const anchor = (md, opts) => {
  opts = Object.assign({}, anchor.defaults, opts)

  md.core.ruler.push('anchor', state => {
    const slugs = {}
    const tokens = state.tokens
    let previousLevel = 0
    let currentLevel = 1
    let slugHistory = []
    let appropriateStart = false

    const isLevelSelected = Array.isArray(opts.level)
      ? isLevelSelectedArray(opts.level)
      : isLevelSelectedNumber(opts.level)

    tokens
      .filter(token => token.type === 'heading_open')
      .filter(token => isLevelSelected(Number(token.tag.substr(1))))
      .forEach(token => {
        currentLevel = Number(token.tag.substr(1))

        // Aggregate the next token children text.
        const title = tokens[tokens.indexOf(token) + 1].children
          .filter(token => token.type === 'text' || token.type === 'code_inline')
          .reduce((acc, t) => acc + t.content, '')

        let slugString = opts.slugify(title)
        let slug = token.attrGet('id')

        if (slug == null) {
          // console.log(currentLevel, previousLevel)

          if (!appropriateStart && currentLevel === 1 && previousLevel === 0) {
            appropriateStart = true
          }

          if (opts.nestSlugs && appropriateStart) {
            if (currentLevel === 1) {
              previousLevel = 1
              slugHistory = [{slug: slugString}]
              // console.log('is parent')
            } else if (currentLevel > previousLevel) {
              previousLevel = currentLevel
              slugString = buildSlugString(slugHistory, 1, slugString)
              slugHistory[currentLevel - 1] = {slug: slugString}
              // console.log('has parent')
            } else if (currentLevel === previousLevel) {
              // console.log(slugHistory)
              slugString = buildSlugString(slugHistory, 2, slugString)
              // console.log('sibling')
            } else if (currentLevel < previousLevel) {
              slugHistory.pop()
              slugString = buildSlugString(slugHistory, 2, slugString)
              slugHistory[currentLevel - 1] = {slug: slugString}
              // console.log('has older sibling')
            }
          }

          // console.log(slugHistory)

          slug = uniqueSlug(slugString, slugs)

          if (opts.nestSlugs) {
            if (slug !== slugString) {
              slugHistory[currentLevel] = {slug: slug}
            }
          }

          // console.log(slug)
          // console.log(' ')
          token.attrPush(['id', slug])
        }

        if (opts.permalink) {
          opts.renderPermalink(slug, opts, state, tokens.indexOf(token))
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
  permalinkSymbol: '¶',
  permalinkBefore: false,
  permalinkHref,
  nestSlugs: false
}

module.exports = anchor
