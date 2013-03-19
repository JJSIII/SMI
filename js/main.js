// dependencies
//*************************************************************

// jquery ui position()
(function(e,t){function h(e,t,n){return[parseFloat(e[0])*(l.test(e[0])?t/100:1),parseFloat(e[1])*(l.test(e[1])?n/100:1)]}function p(t,n){return parseInt(e.css(t,n),10)||0}function d(t){var n=t[0];return n.nodeType===9?{width:t.width(),height:t.height(),offset:{top:0,left:0}}:e.isWindow(n)?{width:t.width(),height:t.height(),offset:{top:t.scrollTop(),left:t.scrollLeft()}}:n.preventDefault?{width:0,height:0,offset:{top:n.pageY,left:n.pageX}}:{width:t.outerWidth(),height:t.outerHeight(),offset:t.offset()}}e.ui=e.ui||{};var n,r=Math.max,i=Math.abs,s=Math.round,o=/left|center|right/,u=/top|center|bottom/,a=/[\+\-]\d+(\.[\d]+)?%?/,f=/^\w+/,l=/%$/,c=e.fn.position;e.position={scrollbarWidth:function(){if(n!==t)return n;var r,i,s=e("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),o=s.children()[0];return e("body").append(s),r=o.offsetWidth,s.css("overflow","scroll"),i=o.offsetWidth,r===i&&(i=s[0].clientWidth),s.remove(),n=r-i},getScrollInfo:function(t){var n=t.isWindow?"":t.element.css("overflow-x"),r=t.isWindow?"":t.element.css("overflow-y"),i=n==="scroll"||n==="auto"&&t.width<t.element[0].scrollWidth,s=r==="scroll"||r==="auto"&&t.height<t.element[0].scrollHeight;return{width:i?e.position.scrollbarWidth():0,height:s?e.position.scrollbarWidth():0}},getWithinInfo:function(t){var n=e(t||window),r=e.isWindow(n[0]);return{element:n,isWindow:r,offset:n.offset()||{left:0,top:0},scrollLeft:n.scrollLeft(),scrollTop:n.scrollTop(),width:r?n.width():n.outerWidth(),height:r?n.height():n.outerHeight()}}},e.fn.position=function(t){if(!t||!t.of)return c.apply(this,arguments);t=e.extend({},t);var n,l,v,m,g,y,b=e(t.of),w=e.position.getWithinInfo(t.within),E=e.position.getScrollInfo(w),S=(t.collision||"flip").split(" "),x={};return y=d(b),b[0].preventDefault&&(t.at="left top"),l=y.width,v=y.height,m=y.offset,g=e.extend({},m),e.each(["my","at"],function(){var e=(t[this]||"").split(" "),n,r;e.length===1&&(e=o.test(e[0])?e.concat(["center"]):u.test(e[0])?["center"].concat(e):["center","center"]),e[0]=o.test(e[0])?e[0]:"center",e[1]=u.test(e[1])?e[1]:"center",n=a.exec(e[0]),r=a.exec(e[1]),x[this]=[n?n[0]:0,r?r[0]:0],t[this]=[f.exec(e[0])[0],f.exec(e[1])[0]]}),S.length===1&&(S[1]=S[0]),t.at[0]==="right"?g.left+=l:t.at[0]==="center"&&(g.left+=l/2),t.at[1]==="bottom"?g.top+=v:t.at[1]==="center"&&(g.top+=v/2),n=h(x.at,l,v),g.left+=n[0],g.top+=n[1],this.each(function(){var o,u,a=e(this),f=a.outerWidth(),c=a.outerHeight(),d=p(this,"marginLeft"),y=p(this,"marginTop"),T=f+d+p(this,"marginRight")+E.width,N=c+y+p(this,"marginBottom")+E.height,C=e.extend({},g),k=h(x.my,a.outerWidth(),a.outerHeight());t.my[0]==="right"?C.left-=f:t.my[0]==="center"&&(C.left-=f/2),t.my[1]==="bottom"?C.top-=c:t.my[1]==="center"&&(C.top-=c/2),C.left+=k[0],C.top+=k[1],e.support.offsetFractions||(C.left=s(C.left),C.top=s(C.top)),o={marginLeft:d,marginTop:y},e.each(["left","top"],function(r,i){e.ui.position[S[r]]&&e.ui.position[S[r]][i](C,{targetWidth:l,targetHeight:v,elemWidth:f,elemHeight:c,collisionPosition:o,collisionWidth:T,collisionHeight:N,offset:[n[0]+k[0],n[1]+k[1]],my:t.my,at:t.at,within:w,elem:a})}),t.using&&(u=function(e){var n=m.left-C.left,s=n+l-f,o=m.top-C.top,u=o+v-c,h={target:{element:b,left:m.left,top:m.top,width:l,height:v},element:{element:a,left:C.left,top:C.top,width:f,height:c},horizontal:s<0?"left":n>0?"right":"center",vertical:u<0?"top":o>0?"bottom":"middle"};l<f&&i(n+s)<l&&(h.horizontal="center"),v<c&&i(o+u)<v&&(h.vertical="middle"),r(i(n),i(s))>r(i(o),i(u))?h.important="horizontal":h.important="vertical",t.using.call(this,e,h)}),a.offset(e.extend(C,{using:u}))})},e.ui.position={fit:{left:function(e,t){var n=t.within,i=n.isWindow?n.scrollLeft:n.offset.left,s=n.width,o=e.left-t.collisionPosition.marginLeft,u=i-o,a=o+t.collisionWidth-s-i,f;t.collisionWidth>s?u>0&&a<=0?(f=e.left+u+t.collisionWidth-s-i,e.left+=u-f):a>0&&u<=0?e.left=i:u>a?e.left=i+s-t.collisionWidth:e.left=i:u>0?e.left+=u:a>0?e.left-=a:e.left=r(e.left-o,e.left)},top:function(e,t){var n=t.within,i=n.isWindow?n.scrollTop:n.offset.top,s=t.within.height,o=e.top-t.collisionPosition.marginTop,u=i-o,a=o+t.collisionHeight-s-i,f;t.collisionHeight>s?u>0&&a<=0?(f=e.top+u+t.collisionHeight-s-i,e.top+=u-f):a>0&&u<=0?e.top=i:u>a?e.top=i+s-t.collisionHeight:e.top=i:u>0?e.top+=u:a>0?e.top-=a:e.top=r(e.top-o,e.top)}},flip:{left:function(e,t){var n=t.within,r=n.offset.left+n.scrollLeft,s=n.width,o=n.isWindow?n.scrollLeft:n.offset.left,u=e.left-t.collisionPosition.marginLeft,a=u-o,f=u+t.collisionWidth-s-o,l=t.my[0]==="left"?-t.elemWidth:t.my[0]==="right"?t.elemWidth:0,c=t.at[0]==="left"?t.targetWidth:t.at[0]==="right"?-t.targetWidth:0,h=-2*t.offset[0],p,d;if(a<0){p=e.left+l+c+h+t.collisionWidth-s-r;if(p<0||p<i(a))e.left+=l+c+h}else if(f>0){d=e.left-t.collisionPosition.marginLeft+l+c+h-o;if(d>0||i(d)<f)e.left+=l+c+h}},top:function(e,t){var n=t.within,r=n.offset.top+n.scrollTop,s=n.height,o=n.isWindow?n.scrollTop:n.offset.top,u=e.top-t.collisionPosition.marginTop,a=u-o,f=u+t.collisionHeight-s-o,l=t.my[1]==="top",c=l?-t.elemHeight:t.my[1]==="bottom"?t.elemHeight:0,h=t.at[1]==="top"?t.targetHeight:t.at[1]==="bottom"?-t.targetHeight:0,p=-2*t.offset[1],d,v;a<0?(v=e.top+c+h+p+t.collisionHeight-s-r,e.top+c+h+p>a&&(v<0||v<i(a))&&(e.top+=c+h+p)):f>0&&(d=e.top-t.collisionPosition.marginTop+c+h+p-o,e.top+c+h+p>f&&(d>0||i(d)<f)&&(e.top+=c+h+p))}},flipfit:{left:function(){e.ui.position.flip.left.apply(this,arguments),e.ui.position.fit.left.apply(this,arguments)},top:function(){e.ui.position.flip.top.apply(this,arguments),e.ui.position.fit.top.apply(this,arguments)}}},function(){var t,n,r,i,s,o=document.getElementsByTagName("body")[0],u=document.createElement("div");t=document.createElement(o?"div":"body"),r={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},o&&e.extend(r,{position:"absolute",left:"-1000px",top:"-1000px"});for(s in r)t.style[s]=r[s];t.appendChild(u),n=o||document.documentElement,n.insertBefore(t,n.firstChild),u.style.cssText="position: absolute; left: 10.7432222px;",i=e(u).offset().left,e.support.offsetFractions=i>10&&i<11,t.innerHTML="",n.removeChild(t)}()})(jQuery);

// tipper (tooltip)

if(jQuery)(function(c){function n(a){e.formatter=p;return c(this).on("mouseenter.tipper",q).data("tipper",c.extend({},e,a||{}))}function q(){var a=c(this),b=a.data("tipper"),d;d='<div class="tipper-wrapper"><div class="tipper-content">'+b.formatter.apply(c("body"),[a]);d+='</div><span class="tipper-caret"></span></div>';a.data("tipper-text",a.attr("title")).attr("title",null);var g=c('<div class="tipper-positioner '+b.direction+'" />');g.append(d).appendTo("body");d=g.find(".tipper-caret");var h=a.offset(), e=a.outerWidth(),j=a.outerHeight(),k=g.outerWidth(!0),l=g.outerHeight(!0),f={},m={};"right"==b.direction||"left"==b.direction?(f.top=h.top-(l-j)/2,m.top=(l-d.outerHeight(!0))/2,"right"==b.direction?f.left=h.left+e+b.margin:"left"==b.direction&&(f.left=h.left-k-b.margin)):(f.left=h.left-(k-e)/2,m.left=(k-d.outerWidth(!0))/2,"bottom"==b.direction?f.top=h.top+j+b.margin:"top"==b.direction&&(f.top=h.top-l-b.margin));g.css(f);d.css(m);a.one("mouseleave.tipper",{$tipper:g,$target:a},r)}function p(a){return a.attr("title")} function r(a){a=a.data;a.$target.attr("title",a.$target.data("tipper-text")).data("tipper-text",null);a.$tipper.remove()}var e={direction:"right",follow:!1,formatter:function(){},margin:15},j={defaults:function(a){e=c.extend(e,a||{});return c(this)},destroy:function(){c(".tipper-wrapper").remove();return c(this).off(".tipper").data("tipper",null)}};c.fn.tipper=function(a){return j[a]?j[a].apply(this,Array.prototype.slice.call(arguments,1)):"object"===typeof a||!a?n.apply(this,arguments):this}})(jQuery);


// hide address bar
//*************************************************************
(function( win ){
	var doc = win.document;

	// If there's a hash, or addEventListener is undefined, stop here
	if( !location.hash && win.addEventListener ){

		//scroll to 1
		window.scrollTo( 0, 1 );
		var scrollTop = 1,
			getScrollTop = function(){
				return win.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
			},

			//reset to 0 on bodyready, if needed
			bodycheck = setInterval(function(){
				if( doc.body ){
					clearInterval( bodycheck );
					scrollTop = getScrollTop();
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}
			}, 15 );

		win.addEventListener( "load", function(){
			setTimeout(function(){
				//at load, if user hasn't scrolled more than 20 or so...
				if( getScrollTop() < 20 ){
					//reset to hide addr bar at onload
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}
			}, 0);
		} );
	}
})( this );



// when the document is ready do something
//*************************************************************

$(document).ready(function() {

	// menu bar tooltips
	//*************************************************************
	if(Modernizr.mq('(min-width: 768px)')) {
		$('.menu-bar a').tipper({
			direction: 'bottom'
		});
	}

	// popovers
	//*************************************************************
	// prevent async caching issues
	$.ajaxSetup({
		cache: false,
		error: function(xhr, status, error) {
			alert("An AJAX error occured: " + status + "\nError: " + error);
		}
	});

	var popoverOpen = false;

	var createPopover = function(target, position, popoverContent) {
		//clear UI of popovers
		removePopovers();
		
		// if popover is not open create a new popover
		var popoverTemplate = '<div class="popover"><div class="popover-content"></div></div>';

		// inject popover markup to body
		$('.smi-modal').append(popoverTemplate);

		var popover = $('.popover');

		// inject content into popover
		popover.find('.popover-content').html(popoverContent);
		
		// position popover relative to target and depending on left or right
		popover.position({
			of: target,
			my: position + ' top',
			at: position + ' bottom',
			collision: 'flipfit'
		});
		
		// prevent popover from closing when itself is clicked on
		$('.popover').click(function(event) {
			event.stopPropagation();
		});
		// show popover
		popover.fadeIn(100);
	};

	var removePopovers = function() {
		$('.popover').remove();
	};

	// remove popover when someone clicks outside of it
	$('html').click(function() {
		removePopovers();
	});

	// remove popover when window is resized
	$(window).resize(function() {
		removePopovers();
	});

	// tabs
	//*************************************************************
	// when (not active) tab is clicked, get its index, hide all tab bodies, find tab body with the same index and show it
	var tabBehavior = function(tabs, tabBodies) {
		var tabItems = $(tabs).children('ul').find('li');
		var tabBodyItems = $(tabBodies).children('div');
		tabItems.find('a').click(function() {
			var activeTab = $(this).parent();
			if(!$(activeTab).hasClass('active')) { //if this tab is not active
				var index = tabItems.index(activeTab);
				tabItems.removeClass('active');
				activeTab.addClass('active');
				tabBodyItems.removeClass('active');
				tabBodyItems.eq(index).addClass('active');
				
				// fire an event for this tab
				$.event.trigger({
					type: "QV_TAB_CHANGED", // this should not be a string... create a hash of events
					activeTab: tabBodyItems.eq(index).attr("class").replace(" active", "")
				});
			}
		});
	};
	
	// select menu
	//*************************************************************
	var selectBehavior = function(options, optionBodies, popoverContent) {
		// when active option is clicked, show popover appended with list of options, then on click of option, change active option and optionBody
		var optionItems = $(options).children('ul').find('li');
		var optionBodyItems = $(optionBodies).children('div');
		$(optionItems).filter('.active').find('a').click(function(event) {
			createPopover(this,'left',popoverContent);
			// find anchor in popover and add click event
			var popoverItems = $('.popover li');
			popoverItems.find('a').click(function() {
				// get index of clicked anchor
				var index = popoverItems.index($(this).parent());
				optionBodyItems.removeClass('active');
				optionBodyItems.eq(index).addClass('active');
				removePopovers();
			});
			event.stopPropagation();
		});
	};

	// section tabs
	//*************************************************************
	tabBehavior($('.section-tabs'),$('.section-tab-bodies'));
	
	// local nav
	//*************************************************************
	if(Modernizr.mq('(min-width: 600px)')) {
		tabBehavior($('.local-nav-items'),$('.local-body'));
	}
	else {
		selectBehavior($('.local-nav-items'),$('.local-body'),$('.local-nav-items').html());
	}
	
	// load machine audit data and popover
	//*************************************************************
	$.ajax({
	    url: '/json/getMachineInfo.json',
	    data: { agentGuid: agentGuid, columns: '' },
	    dataType: 'json'
	}).done(function (data) {
	
		var newItem = '';
		var machineName = $('.machine-audit h1');
		
		$.each(data.Data, function () {
			var label = this.Label;
			var value = this.Value;
			if (label.indexOf("req_") != -1) {
				if (label == "req_displayName") {
					machineName.html(value);
				}
			} else {
				newItem += '<li><span class="label">' + label + '</span><span class="value">' + value + '</span></li>';
			}
		});
		
		newItem = '<ul>' + newItem + '</ul>';
		
		// inject list after machine name h1
		machineName.after(newItem);
		
		// audit overflow arrow popover
		$('.popover-arrow').click(function(event) {
			createPopover($(this),'left',newItem);
			event.stopPropagation();
		});
		
	});

});