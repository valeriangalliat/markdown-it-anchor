import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'

new MarkdownIt().use(anchor, {
  slugifyWithState: (title, state) => {
    const tokens: anchor.Token[] = state.tokens
    return `${title}-${tokens.length}`
  }
})
