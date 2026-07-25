var emittedWarning = false;
var position = {
  "false": 'push',
  "true": 'unshift',
  after: 'push',
  before: 'unshift'
};
var permalinkSymbolMeta = {
  isPermalinkSymbol: true
};
function legacy(slug, opts, state, idx) {
  var _state$tokens$childre;
  if (!emittedWarning) {
    var warningText = 'Using deprecated markdown-it-anchor permalink option, see https://github.com/valeriangalliat/markdown-it-anchor#permalinks';
    if (typeof process === 'object' && process && process.emitWarning) {
      process.emitWarning(warningText);
    } else {
      console.warn(warningText);
    }
    emittedWarning = true;
  }
  var linkTokens = [Object.assign(new state.Token('link_open', 'a', 1), {
    attrs: [].concat(opts.permalinkClass ? [['class', opts.permalinkClass]] : [], [['href', opts.permalinkHref(slug, state)]], Object.entries(opts.permalinkAttrs(slug, state)))
  }), Object.assign(new state.Token('html_block', '', 0), {
    content: opts.permalinkSymbol,
    meta: permalinkSymbolMeta
  }), new state.Token('link_close', 'a', -1)];
  if (opts.permalinkSpace) {
    state.tokens[idx + 1].children[position[opts.permalinkBefore]](Object.assign(new state.Token('text', '', 0), {
      content: ' '
    }));
  }
  (_state$tokens$childre = state.tokens[idx + 1].children)[position[opts.permalinkBefore]].apply(_state$tokens$childre, linkTokens);
}
function renderHref(slug) {
  return "#" + slug;
}
function renderAttrs(slug) {
  return {};
}
var commonDefaults = {
  "class": 'header-anchor',
  symbol: '#',
  renderHref: renderHref,
  renderAttrs: renderAttrs
};
function makePermalink(renderPermalinkImpl) {
  function renderPermalink(opts) {
    opts = Object.assign({}, renderPermalink.defaults, opts);
    return function (slug, anchorOpts, state, idx) {
      return renderPermalinkImpl(slug, opts, anchorOpts, state, idx);
    };
  }
  renderPermalink.defaults = Object.assign({}, commonDefaults);
  renderPermalink.renderPermalinkImpl = renderPermalinkImpl;
  return renderPermalink;
}
function mergeDuplicateClassAttrs(attrs) {
  var classValues = [];
  var mergedAttrs = attrs.filter(function (_ref) {
    var key = _ref[0],
      value = _ref[1];
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
var linkInsideHeader = makePermalink(function (slug, opts, anchorOpts, state, idx) {
  var _state$tokens$childre2;
  var linkTokens = [Object.assign(new state.Token('link_open', 'a', 1), {
    attrs: mergeDuplicateClassAttrs([].concat(opts["class"] ? [['class', opts["class"]]] : [], [['href', opts.renderHref(slug, state)]], opts.ariaHidden ? [['aria-hidden', 'true']] : [], Object.entries(opts.renderAttrs(slug, state))))
  }), Object.assign(new state.Token('html_inline', '', 0), {
    content: opts.symbol,
    meta: permalinkSymbolMeta
  }), new state.Token('link_close', 'a', -1)];
  if (opts.space) {
    var space = typeof opts.space === 'string' ? opts.space : ' ';
    var type = typeof opts.space === 'string' ? 'html_inline' : 'text';
    state.tokens[idx + 1].children[position[opts.placement]](Object.assign(new state.Token(type, '', 0), {
      content: space
    }));
  }
  (_state$tokens$childre2 = state.tokens[idx + 1].children)[position[opts.placement]].apply(_state$tokens$childre2, linkTokens);
});
Object.assign(linkInsideHeader.defaults, {
  space: true,
  placement: 'after',
  ariaHidden: false
});
var ariaHidden = makePermalink(linkInsideHeader.renderPermalinkImpl);
ariaHidden.defaults = Object.assign({}, linkInsideHeader.defaults, {
  ariaHidden: true
});
var headerLink = makePermalink(function (slug, opts, anchorOpts, state, idx) {
  var linkTokens = [Object.assign(new state.Token('link_open', 'a', 1), {
    attrs: mergeDuplicateClassAttrs([].concat(opts["class"] ? [['class', opts["class"]]] : [], [['href', opts.renderHref(slug, state)]], Object.entries(opts.renderAttrs(slug, state))))
  })].concat(opts.safariReaderFix ? [new state.Token('span_open', 'span', 1)] : [], state.tokens[idx + 1].children, opts.safariReaderFix ? [new state.Token('span_close', 'span', -1)] : [], [new state.Token('link_close', 'a', -1)]);
  state.tokens[idx + 1].children = linkTokens;
});
Object.assign(headerLink.defaults, {
  safariReaderFix: false
});
var linkAfterHeader = makePermalink(function (slug, opts, anchorOpts, state, idx) {
  var _state$tokens;
  if (!['visually-hidden', 'aria-label', 'aria-describedby', 'aria-labelledby'].includes(opts.style)) {
    throw new Error("`permalink.linkAfterHeader` called with unknown style option `" + opts.style + "`");
  }
  if (!['aria-describedby', 'aria-labelledby'].includes(opts.style) && !opts.assistiveText) {
    throw new Error("`permalink.linkAfterHeader` called without the `assistiveText` option in `" + opts.style + "` style");
  }
  if (opts.style === 'visually-hidden' && !opts.visuallyHiddenClass) {
    throw new Error('`permalink.linkAfterHeader` called without the `visuallyHiddenClass` option in `visually-hidden` style');
  }
  var title = state.tokens[idx + 1].children.filter(function (token) {
    return token.type === 'text' || token.type === 'code_inline';
  }).reduce(function (acc, t) {
    return acc + t.content;
  }, '');
  var subLinkTokens = [];
  var linkAttrs = [];
  if (opts["class"]) {
    linkAttrs.push(['class', opts["class"]]);
  }
  linkAttrs.push(['href', opts.renderHref(slug, state)]);
  linkAttrs.push.apply(linkAttrs, Object.entries(opts.renderAttrs(slug, state)));
  if (opts.style === 'visually-hidden') {
    subLinkTokens.push(Object.assign(new state.Token('span_open', 'span', 1), {
      attrs: [['class', opts.visuallyHiddenClass]]
    }), Object.assign(new state.Token('text', '', 0), {
      content: opts.assistiveText(title)
    }), new state.Token('span_close', 'span', -1));
    if (opts.space) {
      var space = typeof opts.space === 'string' ? opts.space : ' ';
      var type = typeof opts.space === 'string' ? 'html_inline' : 'text';
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
  var linkTokens = [Object.assign(new state.Token('link_open', 'a', 1), {
    attrs: mergeDuplicateClassAttrs(linkAttrs)
  })].concat(subLinkTokens, [new state.Token('link_close', 'a', -1)]);
  (_state$tokens = state.tokens).splice.apply(_state$tokens, [idx + 3, 0].concat(linkTokens));
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

var slugify = function slugify(s) {
  return encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'));
};
function getTokensText(tokens) {
  return tokens.filter(function (t) {
    return ['text', 'code_inline'].includes(t.type);
  }).map(function (t) {
    return t.content;
  }).join('');
}
function uniqueSlug(slug, slugs, failOnNonUnique, startIndex) {
  var uniq = slug;
  var i = startIndex;
  {
    while (Object.prototype.hasOwnProperty.call(slugs, uniq)) {
      uniq = slug + "-" + i;
      i += 1;
    }
  }
  slugs[uniq] = true;
  return uniq;
}
var isLevelSelectedNumber = function isLevelSelectedNumber(selection) {
  return function (level) {
    return level >= selection;
  };
};
var isLevelSelectedArray = function isLevelSelectedArray(selection) {
  return function (level) {
    return selection.includes(level);
  };
};
function anchor(md, opts) {
  opts = Object.assign({}, anchor.defaults, opts);
  md.core.ruler.push('anchor', function (state) {
    var slugs = {};
    var tokens = state.tokens;
    var isLevelSelected = Array.isArray(opts.level) ? isLevelSelectedArray(opts.level) : isLevelSelectedNumber(opts.level);
    for (var idx = 0; idx < tokens.length; idx++) {
      var token = tokens[idx];
      if (token.type !== 'heading_open') {
        continue;
      }
      if (!isLevelSelected(Number(token.tag.substr(1)))) {
        continue;
      }

      // Aggregate the next token children text.
      var title = opts.getTokensText(tokens[idx + 1].children);
      var slug = token.attrGet('id');
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
        token.attrSet('tabindex', "" + opts.tabIndex);
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
          slug: slug,
          title: title
        });
      }
    }
  });
}
anchor.permalink = permalink;
anchor.defaults = {
  level: 1,
  slugify: slugify,
  uniqueSlugStartIndex: 1,
  tabIndex: '-1',
  getTokensText: getTokensText,
  // Legacy options.
  permalink: false,
  renderPermalink: legacy,
  permalinkClass: ariaHidden.defaults["class"],
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
anchor["default"] = anchor;

module.exports = anchor;
//# sourceMappingURL=markdownItAnchor.js.map
