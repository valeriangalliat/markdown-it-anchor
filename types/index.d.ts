export default anchor;
declare function anchor(md: any, opts: any): void;
declare namespace anchor {
    export { permalink };
    export namespace defaults {
        export const level: number;
        export { slugify };
        export const uniqueSlugStartIndex: number;
        export const tabIndex: string;
        export { getTokensText };
        const permalink_1: boolean;
        export { permalink_1 as permalink };
        export const renderPermalink: typeof import("./permalink").legacy;
        export const permalinkClass: string;
        export const permalinkSpace: any;
        export const permalinkSymbol: string;
        export const permalinkBefore: boolean;
        export const permalinkHref: typeof import("./permalink").renderHref;
        export const permalinkAttrs: typeof import("./permalink").renderAttrs;
    }
    export { anchor as default };
}
import * as permalink from "./permalink";
declare function slugify(s: any): string;
declare function getTokensText(tokens: any): any;
