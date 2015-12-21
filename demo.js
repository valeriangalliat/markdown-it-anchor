const md = require('markdown-it')();
const anchor = require('markdown-it-anchor');

md.use(anchor, {
  // options, here defaults
	level: 1,
//  slugify: customSlugify,
  permalink: false,
//  renderPermalink: customPermalinkRender,
  permalinkClass: 'header-anchor',
  permalinkSymbol: '¶',
  permalinkBefore: false
});

const src = `# first header
lorem ipsum

## next section!
this is totaly awesome`;

// render
md.render(src);
