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


$(document).ready(function() {

	// icon font

	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-pushpin' : '&#x21;',
			'icon-windows8' : '&#x22;',
			'icon-windows' : '&#x23;',
			'icon-dashboard' : '&#x24;',
			'icon-flag' : '&#x25;',
			'icon-star' : '&#x26;',
			'icon-warning' : '&#x27;',
			'icon-info' : '&#x28;',
			'icon-checkmark-circle' : '&#x29;',
			'icon-cancel-circle' : '&#x2a;',
			'icon-close' : '&#x2b;',
			'icon-plus' : '&#x2c;',
			'icon-ticket' : '&#x2d;',
			'icon-cog' : '&#x2e;',
			'icon-cogs' : '&#x2f;',
			'icon-alarm' : '&#x30;',
			'icon-list' : '&#x31;',
			'icon-wrench' : '&#x32;',
			'icon-user' : '&#x33;',
			'icon-calendar' : '&#x34;',
			'icon-arrow-down' : '&#x35;',
			'icon-arrow-left' : '&#x36;',
			'icon-arrow-right' : '&#x37;',
			'icon-arrow-up' : '&#x38;',
			'icon-checkmark' : '&#x39;',
			'icon-minus' : '&#x3a;',
			'icon-tags' : '&#x3b;',
			'icon-new-tab' : '&#x3c;',
			'icon-search' : '&#x3d;',
			'icon-power' : '&#x3e;',
			'icon-envelop' : '&#x3f;',
			'icon-phone' : '&#x40;',
			'icon-tools' : '&#x41;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, c, el;
	for (i = 0; i < els.length; i += 1) {
		el = els[i];
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}

	// menu-bar tooltips
	$(".menu-bar a").tipper({
		direction: "bottom"
	});

});