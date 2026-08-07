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
function getTitle(state, idx) {
  var _state$tokens;
  const title = ((_state$tokens = state.tokens[idx + 1]) == null || (_state$tokens = _state$tokens.children) == null ? void 0 : _state$tokens.filter(token => ['text', 'code_inline'].includes(token.type)).reduce((acc, t) => acc + t.content, '').trim()) || '';
  return title;
}
const linkInsideHeader = makePermalink((slug, opts, anchorOpts, state, idx) => {
  const title = getTitle(state, idx);
  const linkTokens = [Object.assign(new state.Token('link_open', 'a', 1), {
    attrs: mergeDuplicateClassAttrs([...(opts.class ? [['class', opts.class]] : []), ['href', opts.renderHref(slug, state, anchorOpts, idx, title)], ...(opts.ariaHidden ? [['aria-hidden', 'true']] : []), ...Object.entries(opts.renderAttrs(slug, state, anchorOpts, idx, title))])
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
  const title = getTitle(state, idx);
  const linkTokens = [Object.assign(new state.Token('link_open', 'a', 1), {
    attrs: mergeDuplicateClassAttrs([...(opts.class ? [['class', opts.class]] : []), ['href', opts.renderHref(slug, state, anchorOpts, idx, title)], ...Object.entries(opts.renderAttrs(slug, state, anchorOpts, idx, title))])
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
  linkAttrs.push(['href', opts.renderHref(slug, state, anchorOpts, idx, title)]);
  linkAttrs.push(...Object.entries(opts.renderAttrs(slug, state, anchorOpts, idx, title)));
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

const slugify = str => str.toLowerCase().replaceAll(/(?:[!-\/:-@\[-`\{-~\xA1-\xA9\xAB\xAC\xAE-\xB1\xB4\xB6-\xB8\xBB\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u037E\u0384\u0385\u0387\u03F6\u0482\u055A-\u055F\u0589\u058A\u058D-\u058F\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0606-\u060F\u061B\u061D-\u061F\u066A-\u066D\u06D4\u06DE\u06E9\u06FD\u06FE\u0700-\u070D\u07F6-\u07F9\u07FE\u07FF\u0830-\u083E\u085E\u0888\u0964\u0965\u0970\u09F2\u09F3\u09FA\u09FB\u09FD\u0A76\u0AF0\u0AF1\u0B70\u0BF3-\u0BFA\u0C77\u0C7F\u0C84\u0D4F\u0D79\u0DF4\u0E3F\u0E4F\u0E5A\u0E5B\u0F01-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0F3A-\u0F3D\u0F85\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE-\u0FDA\u104A-\u104F\u109E\u109F\u10FB\u1360-\u1368\u1390-\u1399\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DB\u1800-\u180A\u1940\u1944\u1945\u19DE-\u19FF\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B6A\u1B74-\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2010-\u2027\u2030-\u205E\u207A-\u207E\u208A-\u208E\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2775\u2794-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E5D\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3001-\u3004\u3008-\u3020\u3030\u3036\u3037\u303D-\u303F\u309B\u309C\u30A0\u30FB\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAA77-\uAA79\uAADE\uAADF\uAAF0\uAAF1\uAB5B\uAB6A\uAB6B\uABEB\uFB29\uFBB2-\uFBC2\uFD3E-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD00-\uDD02\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDC77\uDC78\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEC8\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3F]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFD5-\uDFF1\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3F\uDF44\uDF45]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F[\uDC9C\uDC9F]|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85-\uDE8B]|\uD838[\uDD4F\uDEFF]|\uD83A[\uDD5E\uDD5F]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA])/g, " ").trim().replaceAll(/\s+/g, "-");
function getTokensText(tokens) {
  return tokens.filter(t => ['text', 'code_inline'].includes(t.type)).map(t => t.content).join('');
}
function uniqueSlug(slug, slugs, failOnNonUnique, startIndex) {
  let uniq = slug;
  let i = startIndex;
  if (failOnNonUnique && Object.prototype.hasOwnProperty.call(slugs, uniq)) {
    throw new Error(`User defined \`id\` attribute \`${slug}\` is not unique. Please fix it in your Markdown to continue.`);
  } else {
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
    var _opts$slugs;
    const slugs = (_opts$slugs = opts.slugs) != null ? _opts$slugs : {};
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
        slug = uniqueSlug(slug, slugs, opt.failOnNonUnique, opts.uniqueSlugStartIndex);
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
  failOnNonUnique: true,
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
