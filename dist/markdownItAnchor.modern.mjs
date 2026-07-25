let emittedWarning = false;
const position = {
  false: 'push',
  true: 'unshift',
  after: 'push',
  before: 'unshift'
};
const permalinkSymbolMeta = {
  isPermalinkSymbol: true
};
function legacy(slug, opts, state, idx) {
  if (!emittedWarning) {
    const warningText = 'Using deprecated markdown-it-anchor permalink option, see https://github.com/valeriangalliat/markdown-it-anchor#permalinks';
    if (typeof process === 'object' && process && process.emitWarning) {
      process.emitWarning(warningText);
    } else {
      console.warn(warningText);
    }
    emittedWarning = true;
  }
  const linkTokens = [Object.assign(new state.Token('link_open', 'a', 1), {
    attrs: [...(opts.permalinkClass ? [['class', opts.permalinkClass]] : []), ['href', opts.permalinkHref(slug, state)], ...Object.entries(opts.permalinkAttrs(slug, state))]
  }), Object.assign(new state.Token('html_block', '', 0), {
    content: opts.permalinkSymbol,
    meta: permalinkSymbolMeta
  }), new state.Token('link_close', 'a', -1)];
  if (opts.permalinkSpace) {
    state.tokens[idx + 1].children[position[opts.permalinkBefore]](Object.assign(new state.Token('text', '', 0), {
      content: ' '
    }));
  }
  state.tokens[idx + 1].children[position[opts.permalinkBefore]](...linkTokens);
}
function renderHref(slug) {
  return `#${slug}`;
}
function renderAttrs(slug) {
  return {};
}
const commonDefaults = {
  class: 'header-anchor',
  symbol: '#',
  renderHref,
  renderAttrs
};
function makePermalink(renderPermalinkImpl) {
  function renderPermalink(opts) {
    opts = Object.assign({}, renderPermalink.defaults, opts);
    return (slug, anchorOpts, state, idx) => {
      return renderPermalinkImpl(slug, opts, anchorOpts, state, idx);
    };
  }
  renderPermalink.defaults = Object.assign({}, commonDefaults);
  renderPermalink.renderPermalinkImpl = renderPermalinkImpl;
  return renderPermalink;
}
function mergeDuplicateClassAttrs(attrs) {
  const classValues = [];
  const mergedAttrs = attrs.filter(([key, value]) => {
    if (key !== 'class') {
      return true;
    }
    classValues.push(value);
  });
  if (classValues.length > 0) {
    mergedAttrs.unshift(['class', classValues.join(' ')]);
  }
  return mergedAttrs;
}
const linkInsideHeader = makePermalink((slug, opts, anchorOpts, state, idx) => {
  const linkTokens = [Object.assign(new state.Token('link_open', 'a', 1), {
    attrs: mergeDuplicateClassAttrs([...(opts.class ? [['class', opts.class]] : []), ['href', opts.renderHref(slug, state)], ...(opts.ariaHidden ? [['aria-hidden', 'true']] : []), ...Object.entries(opts.renderAttrs(slug, state))])
  }), Object.assign(new state.Token('html_inline', '', 0), {
    content: opts.symbol,
    meta: permalinkSymbolMeta
  }), new state.Token('link_close', 'a', -1)];
  if (opts.space) {
    const space = typeof opts.space === 'string' ? opts.space : ' ';
    const type = typeof opts.space === 'string' ? 'html_inline' : 'text';
    state.tokens[idx + 1].children[position[opts.placement]](Object.assign(new state.Token(type, '', 0), {
      content: space
    }));
  }
  state.tokens[idx + 1].children[position[opts.placement]](...linkTokens);
});
Object.assign(linkInsideHeader.defaults, {
  space: true,
  placement: 'after',
  ariaHidden: false
});
const ariaHidden = makePermalink(linkInsideHeader.renderPermalinkImpl);
ariaHidden.defaults = Object.assign({}, linkInsideHeader.defaults, {
  ariaHidden: true
});
const headerLink = makePermalink((slug, opts, anchorOpts, state, idx) => {
  const linkTokens = [Object.assign(new state.Token('link_open', 'a', 1), {
    attrs: mergeDuplicateClassAttrs([...(opts.class ? [['class', opts.class]] : []), ['href', opts.renderHref(slug, state)], ...Object.entries(opts.renderAttrs(slug, state))])
  }), ...(opts.safariReaderFix ? [new state.Token('span_open', 'span', 1)] : []), ...state.tokens[idx + 1].children, ...(opts.safariReaderFix ? [new state.Token('span_close', 'span', -1)] : []), new state.Token('link_close', 'a', -1)];
  state.tokens[idx + 1].children = linkTokens;
});
Object.assign(headerLink.defaults, {
  safariReaderFix: false
});
const linkAfterHeader = makePermalink((slug, opts, anchorOpts, state, idx) => {
  if (!['visually-hidden', 'aria-label', 'aria-describedby', 'aria-labelledby'].includes(opts.style)) {
    throw new Error(`\`permalink.linkAfterHeader\` called with unknown style option \`${opts.style}\``);
  }
  if (!['aria-describedby', 'aria-labelledby'].includes(opts.style) && !opts.assistiveText) {
    throw new Error(`\`permalink.linkAfterHeader\` called without the \`assistiveText\` option in \`${opts.style}\` style`);
  }
  if (opts.style === 'visually-hidden' && !opts.visuallyHiddenClass) {
    throw new Error('`permalink.linkAfterHeader` called without the `visuallyHiddenClass` option in `visually-hidden` style');
  }
  const title = state.tokens[idx + 1].children.filter(token => token.type === 'text' || token.type === 'code_inline').reduce((acc, t) => acc + t.content, '');
  const subLinkTokens = [];
  const linkAttrs = [];
  if (opts.class) {
    linkAttrs.push(['class', opts.class]);
  }
  linkAttrs.push(['href', opts.renderHref(slug, state)]);
  linkAttrs.push(...Object.entries(opts.renderAttrs(slug, state)));
  if (opts.style === 'visually-hidden') {
    subLinkTokens.push(Object.assign(new state.Token('span_open', 'span', 1), {
      attrs: [['class', opts.visuallyHiddenClass]]
    }), Object.assign(new state.Token('text', '', 0), {
      content: opts.assistiveText(title)
    }), new state.Token('span_close', 'span', -1));
    if (opts.space) {
      const space = typeof opts.space === 'string' ? opts.space : ' ';
      const type = typeof opts.space === 'string' ? 'html_inline' : 'text';
      subLinkTokens[position[opts.placement]](Object.assign(new state.Token(type, '', 0), {
        content: space
      }));
    }
    subLinkTokens[position[opts.placement]](Object.assign(new state.Token('span_open', 'span', 1), {
      attrs: [['aria-hidden', 'true']]
    }), Object.assign(new state.Token('html_inline', '', 0), {
      content: opts.symbol,
      meta: permalinkSymbolMeta
    }), new state.Token('span_close', 'span', -1));
  } else {
    subLinkTokens.push(Object.assign(new state.Token('html_inline', '', 0), {
      content: opts.symbol,
      meta: permalinkSymbolMeta
    }));
  }
  if (opts.style === 'aria-label') {
    linkAttrs.push(['aria-label', opts.assistiveText(title)]);
  } else if (['aria-describedby', 'aria-labelledby'].includes(opts.style)) {
    linkAttrs.push([opts.style, slug]);
  }
  const linkTokens = [Object.assign(new state.Token('link_open', 'a', 1), {
    attrs: mergeDuplicateClassAttrs(linkAttrs)
  }), ...subLinkTokens, new state.Token('link_close', 'a', -1)];
  state.tokens.splice(idx + 3, 0, ...linkTokens);
  if (opts.wrapper) {
    state.tokens.splice(idx, 0, Object.assign(new state.Token('html_block', '', 0), {
      content: opts.wrapper[0] + '\n'
    }));
    state.tokens.splice(idx + 3 + linkTokens.length + 1, 0, Object.assign(new state.Token('html_block', '', 0), {
      content: opts.wrapper[1] + '\n'
    }));
  }
});
Object.assign(linkAfterHeader.defaults, {
  style: 'visually-hidden',
  space: true,
  placement: 'after',
  wrapper: null
});

var permalink = {
  __proto__: null,
  legacy: legacy,
  renderHref: renderHref,
  renderAttrs: renderAttrs,
  makePermalink: makePermalink,
  linkInsideHeader: linkInsideHeader,
  ariaHidden: ariaHidden,
  headerLink: headerLink,
  linkAfterHeader: linkAfterHeader
};

const slugify = s => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'));
function getTokensText(tokens) {
  return tokens.filter(t => ['text', 'code_inline'].includes(t.type)).map(t => t.content).join('');
}
function uniqueSlug(slug, slugs, failOnNonUnique, startIndex) {
  let uniq = slug;
  let i = startIndex;
  {
    while (Object.prototype.hasOwnProperty.call(slugs, uniq)) {
      uniq = `${slug}-${i}`;
      i += 1;
    }
  }
  slugs[uniq] = true;
  return uniq;
}
const isLevelSelectedNumber = selection => level => level >= selection;
const isLevelSelectedArray = selection => level => selection.includes(level);
function anchor(md, opts) {
  opts = Object.assign({}, anchor.defaults, opts);
  md.core.ruler.push('anchor', state => {
    const slugs = {};
    const tokens = state.tokens;
    const isLevelSelected = Array.isArray(opts.level) ? isLevelSelectedArray(opts.level) : isLevelSelectedNumber(opts.level);
    for (let idx = 0; idx < tokens.length; idx++) {
      const token = tokens[idx];
      if (token.type !== 'heading_open') {
        continue;
      }
      if (!isLevelSelected(Number(token.tag.substr(1)))) {
        continue;
      }

      // Aggregate the next token children text.
      const title = opts.getTokensText(tokens[idx + 1].children);
      let slug = token.attrGet('id');
      if (slug == null) {
        if (opts.slugifyWithState) {
          slug = opts.slugifyWithState(title, state);
        } else {
          slug = opts.slugify(title);
        }
        slug = uniqueSlug(slug, slugs, false, opts.uniqueSlugStartIndex);
      } else {
        slug = uniqueSlug(slug, slugs, true, opts.uniqueSlugStartIndex);
      }
      token.attrSet('id', slug);
      if (opts.tabIndex !== false) {
        token.attrSet('tabindex', `${opts.tabIndex}`);
      }
      if (typeof opts.permalink === 'function') {
        opts.permalink(slug, opts, state, idx);
      } else if (opts.permalink) {
        opts.renderPermalink(slug, opts, state, idx);
      } else if (opts.renderPermalink && opts.renderPermalink !== legacy) {
        opts.renderPermalink(slug, opts, state, idx);
      }

      // A permalink renderer could modify the `tokens` array so
      // make sure to get the up-to-date index on each iteration.
      idx = tokens.indexOf(token);
      if (opts.callback) {
        opts.callback(token, {
          slug,
          title
        });
      }
    }
  });
}
anchor.permalink = permalink;
anchor.defaults = {
  level: 1,
  slugify,
  uniqueSlugStartIndex: 1,
  tabIndex: '-1',
  getTokensText,
  // Legacy options.
  permalink: false,
  renderPermalink: legacy,
  permalinkClass: ariaHidden.defaults.class,
  permalinkSpace: ariaHidden.defaults.space,
  permalinkSymbol: '¶',
  permalinkBefore: ariaHidden.defaults.placement === 'before',
  permalinkHref: ariaHidden.defaults.renderHref,
  permalinkAttrs: ariaHidden.defaults.renderAttrs
};

// Dirty hack to make `import anchor from 'markdown-it-anchor'` work with
// TypeScript which doesn't support the `module` field of `package.json` and
// will always get the CommonJS version which otherwise wouldn't have a
// `default` key, resulting in markdown-it-anchor being undefined when being
// imported that way.
anchor.default = anchor;

export { anchor as default };
//# sourceMappingURL=markdownItAnchor.modern.mjs.map
