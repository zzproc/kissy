/*
Copyright 2012, KISSY UI Library v1.30dev
MIT Licensed
build time: Jun 18 22:02
*/
KISSY.add("editor/core/enterKey",function(j,h){function n(a){var b;b=a.getSelection().getRanges();for(var g=b.length-1;0<g;g--)b[g].deleteContents();b=b[0];g=b.document;if(b.checkStartOfBlock()&&b.checkEndOfBlock()){var c=(new o(b.startContainer)).block;if(c&&("li"==c.nodeName()||"li"==c.parent().nodeName()))return a.hasCommand("outdent")?(a.execCommand("save"),a.execCommand("outdent"),a.execCommand("save"),!0):!1}var f=b.splitBlock("p");if(!f)return!0;var a=f.previousBlock,c=f.nextBlock,h=f.wasStartOfBlock,
k=f.wasEndOfBlock,e;if(c)e=c.parent(),"li"==e.nodeName()&&(c._4e_breakParent(e),c._4e_move(c.next(),!0));else if(a&&(e=a.parent())&&"li"==e.nodeName())a._4e_breakParent(e),b.moveToElementEditablePosition(a.next()),a._4e_move(a.prev());if(!h&&!k){if("li"==c.nodeName()&&(e=c.first(p.invisible(!0)))&&j.inArray(e.nodeName(),["ul","ol"]))(l.ie?new m(g.createTextNode(" ")):new m(g.createElement("br"))).insertBefore(e);c&&b.moveToElementEditablePosition(c)}else{var d;if(a){if("li"==a.nodeName()||!q.test(a.nodeName()))d=
a.clone()}else c&&(d=c.clone());d||(d=new m("<p>",null,g));if(e=f.elementPath)for(var f=0,n=e.elements.length;f<n;f++){var i=e.elements[f];if(i.equals(e.block)||i.equals(e.blockLimit))break;r.$removeEmpty[i.nodeName()]&&(i=i.clone(),d._4e_moveChildren(i),d.append(i))}l.ie||d._4e_appendBogus();b.insertNode(d);if(l.ie&&h&&(!k||!a[0].childNodes.length))b.moveToElementEditablePosition(k?a:d),b.select();b.moveToElementEditablePosition(h&&!k?c:d)}l.ie||(c?(d=new m(g.createElement("span")),d.html("&nbsp;"),
b.insertNode(d),d.scrollIntoView(void 0,!1),b.deleteContents()):d.scrollIntoView(void 0,!1));b.select();return!0}function s(a){var b=a.get("document")[0];t.on(b,"keydown",function(b){if(13===b.keyCode&&!b.shiftKey&&!b.ctrlKey&&!b.metaKey){a.execCommand("save");var c=a.execCommand("enterBlock");a.execCommand("save");!1!==c&&b.preventDefault()}})}var l=j.UA,q=/^h[1-6]$/,r=h.XHTML_DTD,m=j.Node,t=j.Event,p=h.Walker,o=h.ElementPath;return{init:function(a){a.addCommand("enterBlock",{exec:n});a.docReady(function(){s(a)})}}},
{requires:["./base"]});