/*global Modernizr */

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


// when the document is loaded be fucking fantastic
//*************************************************************

$(document).ready(function() {

	// menu-bar tooltips
	if(Modernizr.mq('(min-width: 768px)')) {
		$('.menu-bar a').tipper({
			direction: 'bottom'
		});
	}
	// build audit list
	var auditMarkup = $('.machine-audit .popover-arrow').attr('data-load');
	
	// prevent async caching issues
	$.ajaxSetup({ cache: false });
	
	$.get(auditMarkup, function(data){
		$('.machine-audit > h1').after(data);
	});
		
	// popovers
	var popoverOpen = false;
	var createPopover = function(target, position) {
	
		// if popover is not open create a new popover
		if(popoverOpen === false) {
			var popoverTemplate = '<div class="popover"><div class="popover-content"></div></div>';
			
			// inject popover markup to body
			$('.smi-modal').append(popoverTemplate);
			
			var popover = $('.popover');
			
			// grab html from snippet residing in target's data-load attribute and inject into popover
			$.get($(target).attr('data-load'), function(data){
				popover.find('.popover-content').html(data);
				// position popover relative to target and depending on left or right
				popover.position({
					my: position + ' top',
					at: position + ' bottom',
					of: $(target),
					collision: 'flipfit'
				});
				$('.popover').click(function(event) {
					event.stopPropagation();
				});
				// show popover
				popover.fadeIn(100);
				popoverOpen = true;
			});
		}
		
		else {
			removePopovers();
		}
	};
	
	var removePopovers = function() {
		$('.popover').remove();
		popoverOpen = false;
	};
	
	// create popover
	$('.popover-arrow').click(function(event) {
		createPopover(this, 'left');
		event.stopPropagation();
	});
	
	// remove popover when someone clicks outside of it
	$('html').click(function() {
		removePopovers();
	});
	
	// remove popover when window is resized
	$(window).resize(function() {
		removePopovers();
	});
	
	// tabs
	// when (not active) tab is clicked, get its index, hide all tab bodies, find tab body with the same index and show it
	var sectionTabs = $('.section-tabs');
	var sectionTabBodies = $('.tab-body > div');
	
	$(sectionTabs).find('a').not('.active').click(function() {
		var activeTab = $(this).parent();
		var index = $(sectionTabs).find('li').index(activeTab);
		$(sectionTabs).find('li').removeClass('active');
		activeTab.addClass('active');
		sectionTabBodies.removeClass('active');
		sectionTabBodies.eq(index).addClass('active');
	});
	
});