const e={false:"push",true:"unshift"},n=Object.prototype.hasOwnProperty,t=(e,t,r,i)=>{let l=e,a=i;if(r&&n.call(t,l))throw Error(`User defined id attribute '${e}' is NOT unique. Please fix it in your markdown to continue.`);for(;n.call(t,l);)l=`${e}-${a++}`;return t[l]=!0,l},r=(e,n)=>{n=Object.assign({},r.defaults,n),e.core.ruler.push("anchor",e=>{const r={},i=e.tokens,l=Array.isArray(n.level)?(a=n.level,e=>a.includes(e)):(e=>n=>n>=e)(n.level);var a;i.filter(e=>"heading_open"===e.type).filter(e=>l(Number(e.tag.substr(1)))).forEach(l=>{const a=i[i.indexOf(l)+1].children.filter(e=>"text"===e.type||"code_inline"===e.type).reduce((e,n)=>e+n.content,"");let o=l.attrGet("id");o=null==o?t(n.slugify(a),r,!1,n.uniqueSlugStartIndex):t(o,r,!0,n.uniqueSlugStartIndex),l.attrSet("id",o),n.permalink&&n.renderPermalink(o,n,e,i.indexOf(l)),n.callback&&n.callback(l,{slug:o,title:a})})})};r.defaults={level:1,slugify:e=>encodeURIComponent(String(e).trim().toLowerCase().replace(/\s+/g,"-")),uniqueSlugStartIndex:1,permalink:!1,renderPermalink:(n,t,r,i)=>{const l=[Object.assign(new r.Token("link_open","a",1),{attrs:[...t.permalinkClass?[["class",t.permalinkClass]]:[],["href",t.permalinkHref(n,r)],...Object.entries(t.permalinkAttrs(n,r))]}),Object.assign(new r.Token("html_block","",0),{content:t.permalinkSymbol}),new r.Token("link_close","a",-1)];t.permalinkSpace&&l[e[!t.permalinkBefore]](Object.assign(new r.Token("text","",0),{content:" "})),r.tokens[i+1].children[e[t.permalinkBefore]](...l)},permalinkClass:"header-anchor",permalinkSpace:!0,permalinkSymbol:"¶",permalinkBefore:!1,permalinkHref:e=>"#"+e,permalinkAttrs:e=>({})};export default r;
//# sourceMappingURL=markdownItAnchor.modern.js.map