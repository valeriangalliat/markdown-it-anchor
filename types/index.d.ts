import MarkdownIt = require('markdown-it');
import Core = require('markdown-it/lib/parser_core');
import Token = require('markdown-it/lib/token');

declare namespace anchor {
    interface AnchorInfo {
        slug: string;
        title: string;
    }

    interface AnchorOptions {
        level?: number;
        slugify?(str: string): string;
        uniqueSlugStartIndex?: number;
        permalink?: boolean;
        renderPermalink?(slug: string, opts: AnchorOptions, state: Core, idx: number): void;
        permalinkClass?: string;
        permalinkSpace?: boolean;
        permalinkSymbol?: string;
        permalinkBefore?: boolean;
        permalinkHref?(slug: string, state: Core): string;
        permalinkAttrs?(slug: string, state: Core): Record<string, string>;
        callback?(token: Token, anchor_info: AnchorInfo): void;
    }
}

declare function anchor(md: MarkdownIt, opts?: anchor.AnchorOptions): void;

export = anchor;
