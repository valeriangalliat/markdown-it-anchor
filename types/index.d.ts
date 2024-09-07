import MarkdownIt, {StateCore, Token} from 'markdown-it';

declare namespace anchor {
  export type RenderHref = (slug: string, state: StateCore) => string;
  export type RenderAttrs = (slug: string, state: StateCore) => Record<string, string | number>;

  export interface PermalinkOptions {
    class?: string,
    symbol?: string,
    renderHref?: RenderHref,
    renderAttrs?: RenderAttrs
  }

  export interface HeaderLinkPermalinkOptions extends PermalinkOptions {
    safariReaderFix?: boolean;
  }

  export interface LinkAfterHeaderPermalinkOptions extends PermalinkOptions {
    style?: 'visually-hidden' | 'aria-label' | 'aria-describedby' | 'aria-labelledby',
    assistiveText?: (title: string) => string,
    visuallyHiddenClass?: string,
    space?: boolean | string,
    placement?: 'before' | 'after'
    wrapper?: [string, string] | null
  }

  export interface LinkInsideHeaderPermalinkOptions extends PermalinkOptions {
    space?: boolean | string,
    placement?: 'before' | 'after',
    ariaHidden?: boolean
  }

  export interface AriaHiddenPermalinkOptions extends PermalinkOptions {
    space?: boolean | string,
    placement?: 'before' | 'after'
  }

  export type PermalinkGenerator = (slug: string, opts: PermalinkOptions, state: StateCore, index: number) => void;

  export interface AnchorInfo {
    slug: string;
    title: string;
  }

  export interface AnchorOptions {
    level?: number | number[];

    slugify?(str: string): string;
    slugifyWithStateCore?(str: string, state: StateCore): string;
    getTokensText?(tokens: Token[]): string;

    uniqueSlugStartIndex?: number;
    permalink?: PermalinkGenerator;

    callback?(token: Token, anchor_info: AnchorInfo): void;

    tabIndex?: number | false;
  }

  export const permalink: {
    headerLink: (opts?: HeaderLinkPermalinkOptions) => PermalinkGenerator
    linkAfterHeader: (opts?: LinkAfterHeaderPermalinkOptions) => PermalinkGenerator
    linkInsideHeader: (opts?: LinkInsideHeaderPermalinkOptions) => PermalinkGenerator
    ariaHidden: (opts?: AriaHiddenPermalinkOptions) => PermalinkGenerator
  };
}

declare function anchor(md: MarkdownIt, opts?: anchor.AnchorOptions): void;

export default anchor;
