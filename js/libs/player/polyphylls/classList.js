;!function(){function c(a){this.element=a}var a=function(a){return new RegExp("(^| )"+a+"( |$)")},b=function(a,b,c){for(var d=0;d<a.length;d++)b.call(c,a[d])};c.prototype={add:function(){b(arguments,function(a){this.contains(a)||(this.element.className+=" "+a)},this)},remove:function(){b(arguments,function(b){this.element.className=this.element.className.replace(a(b),"")},this)},toggle:function(a){return this.contains(a)?(this.remove(a),!1):(this.add(a),!0)},contains:function(b){return a(b).test(this.element.className)},replace:function(a,b){this.remove(a),this.add(b)}},"classList"in Element.prototype||Object.defineProperty(Element.prototype,"classList",{get:function(){return new c(this)}}),window.DOMTokenList&&null==DOMTokenList.prototype.replace&&(DOMTokenList.prototype.replace=c.prototype.replace)}();