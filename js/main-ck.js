/*global Modernizr */// hide address bar
//*************************************************************
(function(e){var t=e.document;if(!location.hash&&e.addEventListener){window.scrollTo(0,1);var n=1,r=function(){return e.pageYOffset||t.compatMode==="CSS1Compat"&&t.documentElement.scrollTop||t.body.scrollTop||0},i=setInterval(function(){if(t.body){clearInterval(i);n=r();e.scrollTo(0,n===1?0:1)}},15);e.addEventListener("load",function(){setTimeout(function(){r()<20&&e.scrollTo(0,n===1?0:1)},0)})}})(this);$(document).ready(function(){Modernizr.mq("(min-width: 768px)")&&$(".menu-bar a").tipper({direction:"bottom"});var e=$(".machine-audit .popover-arrow").attr("data-load");$.ajaxSetup({cache:!1});$.get(e,function(e){$(".machine-audit > h1").after(e)});var t=!1,n=function(e,n){if(t===!1){var i='<div class="popover"><div class="popover-content"></div></div>';$(".smi-modal").append(i);var s=$(".popover");$.get($(e).attr("data-load"),function(r){s.find(".popover-content").html(r);s.position({my:n+" top",at:n+" bottom",of:$(e),collision:"flipfit"});$(".popover").click(function(e){e.stopPropagation()});s.fadeIn(100);t=!0})}else r()},r=function(){$(".popover").remove();t=!1};$(".popover-arrow").click(function(e){n(this,"left");e.stopPropagation()});$("html").click(function(){r()});$(window).resize(function(){r()});var i=$(".section-tabs"),s=$(".tab-body > div");$(i).find("a").not(".active").click(function(){var e=$(this).parent(),t=$(i).find("li").index(e);$(i).find("li").removeClass("active");e.addClass("active");s.removeClass("active");s.eq(t).addClass("active")})});(function(e,t){function n(e,t,n){return[parseFloat(e[0])*(p.test(e[0])?t/100:1),parseFloat(e[1])*(p.test(e[1])?n/100:1)]}function r(t,n){return parseInt(e.css(t,n),10)||0}function i(t){var n=t[0];return n.nodeType===9?{width:t.width(),height:t.height(),offset:{top:0,left:0}}:e.isWindow(n)?{width:t.width(),height:t.height(),offset:{top:t.scrollTop(),left:t.scrollLeft()}}:n.preventDefault?{width:0,height:0,offset:{top:n.pageY,left:n.pageX}}:{width:t.outerWidth(),height:t.outerHeight(),offset:t.offset()}}e.ui=e.ui||{};var s,o=Math.max,u=Math.abs,a=Math.round,f=/left|center|right/,l=/top|center|bottom/,c=/[\+\-]\d+(\.[\d]+)?%?/,h=/^\w+/,p=/%$/,d=e.fn.position;e.position={scrollbarWidth:function(){if(s!==t)return s;var n,r,i=e("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),o=i.children()[0];return e("body").append(i),n=o.offsetWidth,i.css("overflow","scroll"),r=o.offsetWidth,n===r&&(r=i[0].clientWidth),i.remove(),s=n-r},getScrollInfo:function(t){var n=t.isWindow?"":t.element.css("overflow-x"),r=t.isWindow?"":t.element.css("overflow-y"),i=n==="scroll"||n==="auto"&&t.width<t.element[0].scrollWidth,s=r==="scroll"||r==="auto"&&t.height<t.element[0].scrollHeight;return{width:i?e.position.scrollbarWidth():0,height:s?e.position.scrollbarWidth():0}},getWithinInfo:function(t){var n=e(t||window),r=e.isWindow(n[0]);return{element:n,isWindow:r,offset:n.offset()||{left:0,top:0},scrollLeft:n.scrollLeft(),scrollTop:n.scrollTop(),width:r?n.width():n.outerWidth(),height:r?n.height():n.outerHeight()}}},e.fn.position=function(t){if(!t||!t.of)return d.apply(this,arguments);t=e.extend({},t);var s,p,v,m,g,y,b=e(t.of),w=e.position.getWithinInfo(t.within),E=e.position.getScrollInfo(w),S=(t.collision||"flip").split(" "),x={};return y=i(b),b[0].preventDefault&&(t.at="left top"),p=y.width,v=y.height,m=y.offset,g=e.extend({},m),e.each(["my","at"],function(){var e=(t[this]||"").split(" "),n,r;e.length===1&&(e=f.test(e[0])?e.concat(["center"]):l.test(e[0])?["center"].concat(e):["center","center"]),e[0]=f.test(e[0])?e[0]:"center",e[1]=l.test(e[1])?e[1]:"center",n=c.exec(e[0]),r=c.exec(e[1]),x[this]=[n?n[0]:0,r?r[0]:0],t[this]=[h.exec(e[0])[0],h.exec(e[1])[0]]}),S.length===1&&(S[1]=S[0]),t.at[0]==="right"?g.left+=p:t.at[0]==="center"&&(g.left+=p/2),t.at[1]==="bottom"?g.top+=v:t.at[1]==="center"&&(g.top+=v/2),s=n(x.at,p,v),g.left+=s[0],g.top+=s[1],this.each(function(){var i,f,l=e(this),c=l.outerWidth(),h=l.outerHeight(),d=r(this,"marginLeft"),y=r(this,"marginTop"),T=c+d+r(this,"marginRight")+E.width,N=h+y+r(this,"marginBottom")+E.height,C=e.extend({},g),k=n(x.my,l.outerWidth(),l.outerHeight());t.my[0]==="right"?C.left-=c:t.my[0]==="center"&&(C.left-=c/2),t.my[1]==="bottom"?C.top-=h:t.my[1]==="center"&&(C.top-=h/2),C.left+=k[0],C.top+=k[1],e.support.offsetFractions||(C.left=a(C.left),C.top=a(C.top)),i={marginLeft:d,marginTop:y},e.each(["left","top"],function(n,r){e.ui.position[S[n]]&&e.ui.position[S[n]][r](C,{targetWidth:p,targetHeight:v,elemWidth:c,elemHeight:h,collisionPosition:i,collisionWidth:T,collisionHeight:N,offset:[s[0]+k[0],s[1]+k[1]],my:t.my,at:t.at,within:w,elem:l})}),t.using&&(f=function(e){var n=m.left-C.left,r=n+p-c,i=m.top-C.top,s=i+v-h,a={target:{element:b,left:m.left,top:m.top,width:p,height:v},element:{element:l,left:C.left,top:C.top,width:c,height:h},horizontal:r<0?"left":n>0?"right":"center",vertical:s<0?"top":i>0?"bottom":"middle"};p<c&&u(n+r)<p&&(a.horizontal="center"),v<h&&u(i+s)<v&&(a.vertical="middle"),o(u(n),u(r))>o(u(i),u(s))?a.important="horizontal":a.important="vertical",t.using.call(this,e,a)}),l.offset(e.extend(C,{using:f}))})},e.ui.position={fit:{left:function(e,t){var n=t.within,r=n.isWindow?n.scrollLeft:n.offset.left,i=n.width,s=e.left-t.collisionPosition.marginLeft,u=r-s,a=s+t.collisionWidth-i-r,f;t.collisionWidth>i?u>0&&a<=0?(f=e.left+u+t.collisionWidth-i-r,e.left+=u-f):a>0&&u<=0?e.left=r:u>a?e.left=r+i-t.collisionWidth:e.left=r:u>0?e.left+=u:a>0?e.left-=a:e.left=o(e.left-s,e.left)},top:function(e,t){var n=t.within,r=n.isWindow?n.scrollTop:n.offset.top,i=t.within.height,s=e.top-t.collisionPosition.marginTop,u=r-s,a=s+t.collisionHeight-i-r,f;t.collisionHeight>i?u>0&&a<=0?(f=e.top+u+t.collisionHeight-i-r,e.top+=u-f):a>0&&u<=0?e.top=r:u>a?e.top=r+i-t.collisionHeight:e.top=r:u>0?e.top+=u:a>0?e.top-=a:e.top=o(e.top-s,e.top)}},flip:{left:function(e,t){var n=t.within,r=n.offset.left+n.scrollLeft,i=n.width,s=n.isWindow?n.scrollLeft:n.offset.left,o=e.left-t.collisionPosition.marginLeft,a=o-s,f=o+t.collisionWidth-i-s,l=t.my[0]==="left"?-t.elemWidth:t.my[0]==="right"?t.elemWidth:0,c=t.at[0]==="left"?t.targetWidth:t.at[0]==="right"?-t.targetWidth:0,h=-2*t.offset[0],p,d;if(a<0){p=e.left+l+c+h+t.collisionWidth-i-r;if(p<0||p<u(a))e.left+=l+c+h}else if(f>0){d=e.left-t.collisionPosition.marginLeft+l+c+h-s;if(d>0||u(d)<f)e.left+=l+c+h}},top:function(e,t){var n=t.within,r=n.offset.top+n.scrollTop,i=n.height,s=n.isWindow?n.scrollTop:n.offset.top,o=e.top-t.collisionPosition.marginTop,a=o-s,f=o+t.collisionHeight-i-s,l=t.my[1]==="top",c=l?-t.elemHeight:t.my[1]==="bottom"?t.elemHeight:0,h=t.at[1]==="top"?t.targetHeight:t.at[1]==="bottom"?-t.targetHeight:0,p=-2*t.offset[1],d,v;a<0?(v=e.top+c+h+p+t.collisionHeight-i-r,e.top+c+h+p>a&&(v<0||v<u(a))&&(e.top+=c+h+p)):f>0&&(d=e.top-t.collisionPosition.marginTop+c+h+p-s,e.top+c+h+p>f&&(d>0||u(d)<f)&&(e.top+=c+h+p))}},flipfit:{left:function(){e.ui.position.flip.left.apply(this,arguments),e.ui.position.fit.left.apply(this,arguments)},top:function(){e.ui.position.flip.top.apply(this,arguments),e.ui.position.fit.top.apply(this,arguments)}}},function(){var t,n,r,i,s,o=document.getElementsByTagName("body")[0],u=document.createElement("div");t=document.createElement(o?"div":"body"),r={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},o&&e.extend(r,{position:"absolute",left:"-1000px",top:"-1000px"});for(s in r)t.style[s]=r[s];t.appendChild(u),n=o||document.documentElement,n.insertBefore(t,n.firstChild),u.style.cssText="position: absolute; left: 10.7432222px;",i=e(u).offset().left,e.support.offsetFractions=i>10&&i<11,t.innerHTML="",n.removeChild(t)}()})(jQuery);jQuery&&function(e){function r(n){t.formatter=s;return e(this).on("mouseenter.tipper",i).data("tipper",e.extend({},t,n||{}))}function i(t){var n=e(this),r=n.data("tipper"),i='<div class="tipper-wrapper"><div class="tipper-content">';i+=r.formatter.apply(e("body"),[n]);i+='</div><span class="tipper-caret"></span></div>';n.data("tipper-text",n.attr("title")).attr("title",null);var s=e('<div class="tipper-positioner '+r.direction+'" />');s.append(i).appendTo("body");var u=s.find(".tipper-caret"),a=n.offset(),f=n.outerWidth(),l=n.outerHeight(),c=s.outerWidth(!0),h=s.outerHeight(!0),p={},d={};if(r.direction=="right"||r.direction=="left"){p.top=a.top-(h-l)/2;d.top=(h-u.outerHeight(!0))/2;r.direction=="right"?p.left=a.left+f+r.margin:r.direction=="left"&&(p.left=a.left-c-r.margin)}else{p.left=a.left-(c-f)/2;d.left=(c-u.outerWidth(!0))/2;r.direction=="bottom"?p.top=a.top+l+r.margin:r.direction=="top"&&(p.top=a.top-h-r.margin)}s.css(p);u.css(d);n.one("mouseleave.tipper",{$tipper:s,$target:n},o)}function s(e){return e.attr("title")}function o(e){var t=e.data;t.$target.attr("title",t.$target.data("tipper-text")).data("tipper-text",null);t.$tipper.remove()}var t={direction:"right",follow:!1,formatter:function(){},margin:15},n={defaults:function(n){t=e.extend(t,n||{});return e(this)},destroy:function(){e(".tipper-wrapper").remove();return e(this).off(".tipper").data("tipper",null)}};e.fn.tipper=function(e){return n[e]?n[e].apply(this,Array.prototype.slice.call(arguments,1)):typeof e=="object"||!e?r.apply(this,arguments):this}}(jQuery);