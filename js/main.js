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
	
	if (window.top.location.search.indexOf('full-screen') >= 0) {
		$('body').addClass('full-screen');
	}
	
	var machineInfoDirty = false;
	
	$('#popNewWindow').click(function () {
		//pop win
		window.open('/vsapres/quickview/main/quickview?agentGuid=' + agentGuid + '&full-screen=1&selectScriptId=0&' + Math.random(), 'agentDash' + agentGuid);
	});
	
	$('#closeQuickView').click(function(event) {
		if (window.top.location.href != window.location.href) {
			window.top.hideAgentDash();
		} else {
			window.close();
		}
	});
	
	// toggle 'pin window' icon
	$('a.pin-window').click(function() {
		$(this).toggleClass('active');
	});

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

	var createPopover = function(target, position, popoverContent, sortable) {
	
		if(popoverOpen == false) {
			
			var popoverTemplate = '<div class="popover"><div class="popover-content overthrow"></div></div>';
	
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
				
			if(sortable) {
				var startIndex = -1;
				popover.find('ul').sortable({
					axis: 'y',
					placeholder: 'sortable-placeholder',
					handle: '.popover-control-reorder',
					revert: 100,
					start: function(event, ui) {
						startIndex = ui.item.index();	
					},
					update: function(event, ui) {
						if (startIndex > -1) {
							// highlight dropped item
							$(ui.item).css('background-color','#ffff99').animate({'background-color': '#f0f3f5'}, 800);
							
							//update new spot
	//						$.ajax({
	//							url: '/vsapres/quickview/main/updatemachauditorder',
	//							data: { adminId: adminId, startIndex: startIndex, endIndex: ui.item.index() },
	//							type: 'POST'
	//						}).done(function (data) {
							    //console.log('complete');
	//						});
						}
					}
				});
			}
			
			popoverOpen = true;
		}
		else {
			removePopovers();
		}
	};

	var removePopovers = function() {
		$('.popover').remove();
		popoverOpen = false;
	};

	// remove popover when someone clicks outside of it
	$('html').click(function() {
		removePopovers();
	});

	// remove popover when window is resized
	$(window).resize(function() {
		removePopovers();
	});

	// action table icons
	//*************************************************************
	$('a.icon').click(function() {
		$(this).toggleClass('active');
	});
	
	// tabs
    //*************************************************************
    // when (not active) tab is clicked, get its index, hide all tab bodies, find tab body with the same index and show it
    var tabBehavior = function (tabs) {
        var tabItems = $(tabs).children('ul').find('li');
        var tabsClass = tabs.attr('class');
        
        tabItems.find('a').click(function() {
        	var thisTabs = $(this).closest('.' + tabsClass);
        	var thisTabItems = thisTabs.find('li');
        	var tabBodyItems = thisTabs.next().children('div');
        	var activeTab = $(this).parent();
        	
        	if(!$(activeTab).hasClass('active')) { //if this tab is not active
        		var index = thisTabItems.index(activeTab);
        		
        		thisTabItems.removeClass('active');
        		activeTab.addClass('active');
        		tabBodyItems.removeClass('active');
        		tabBodyItems.eq(index).addClass('active');
        		
        		// custom events
//                var eventName = QuickViewEvents.QV_TAB_CHANGED; // default event
//                if (activeTab.parent().parent().attr('class').toLowerCase().indexOf('local') >= 0) {
//                    eventName = QuickViewEvents.QV_LOCAL_NAV_CHANGED;
//                }
//                var qv_eventTarget = tabBodyItems.eq(index).attr("class").replace(" active", "");
//
                // fire an event for this tab
//                $.event.trigger({
//                    type: eventName,
//                    qv_eventTarget: qv_eventTarget
//                });
            }
        });
    };
	
    // select menu
    //*************************************************************
    var selectBehavior = function(options) {
    	// when active option is clicked, show popover appended with list of options, then on click of option, change active option and optionBody
    	var optionItems = $(options).children('ul').find('li');
    	var optionsClass = options.attr('class');

    	optionItems.find('a').click(function(event) {
    		var thisOptions = $(this).closest('.' + optionsClass);
    		var thisOptionItems = thisOptions.find('li');
    		var optionBodyItems = thisOptions.next().children('div');

    		createPopover(this,'left',thisOptions.html());

    		// find anchor in popover and add click event
    		var popoverItems = $('.popover li');
    		popoverItems.find('a').click(function() {
    			// get index of clicked anchor
    			var index = popoverItems.index($(this).parent());
    			thisOptionItems.removeClass('active');
    			thisOptionItems.eq(index).addClass('active');
    			optionBodyItems.removeClass('active');
    			optionBodyItems.eq(index).addClass('active');
    			removePopovers();

                // custom events
//                var eventName = QuickViewEvents.QV_TAB_CHANGED; // default event
//
//                if (optionBodyItems.parent().attr('class').toLowerCase().indexOf('local') >= 0) {
//                    eventName = QuickViewEvents.QV_LOCAL_NAV_CHANGED;
//                }
//                var qv_eventTarget = optionBodyItems.eq(index).attr("class").replace(" active", "");
//
                // fire an event for this tab
//                $.event.trigger({
//                    type: eventName,
//                    qv_eventTarget: qv_eventTarget
//                });

            });
            event.stopPropagation();
        });
    };

	// section tabs
	//*************************************************************
	tabBehavior($('.section-tabs'));
	
	// local nav
	//*************************************************************
	if(Modernizr.mq('(min-width: 600px) and (min-height: 500px)')) {
		tabBehavior($('.local-nav-items'));
	}
	else {
		selectBehavior($('.local-nav-items'));
	}
	
	var loadMachineInfo = function() {
		// load machine audit data and popover
		//*************************************************************
		$.ajax({
			url: '/json/getMachineInfo.json', ///vsapres/quickview/main/getmachineinfo
			data: { agentGuid: agentGuid, columns: '' },
			dataType: 'json'
		}).done(function(data) {

			var newItem = '';
			var machineName = $('.machine-audit h1');
			machineName.empty();

			//check if exists
			if ($('#machineInfo').length > 0) {
				$('#machineInfo').remove();
			}

			$.each(data.Data, function() {
				var label = this.Label;
				var value = this.Value;
				var auditMarkup = '<span class="label">' + label + '</span><span class="value">' + value + '</span><span class="popover-controls"><a class="popover-control-reorder"><i class="icon-menu"></i></a></span></li>';
				
				if (label.indexOf("req_") != -1) {
					if (label == "req_displayName") {
						machineName.html(value);
					}
				} else {
					if(label == 'Operating System') {

						// check os type and display proper icon
						switch (value) {
							case '2003':
							case '2008':
							case 'XP':
							case 'Vista':
							case '7':
								osIcon = '<li class="os"><i class="os-icon icon-windows"></i>';
								break;
							case '2012':
							case '8':
								osIcon = '<li class="os"><i class="os-icon icon-windows8"></i>';
								break;
							case 'Mac OS X':
								osIcon = '<li class="os"><i class="os-icon icon-apple"></i>';
								break;
							case 'Linux':
								osIcon = '<li class="os"><i class="os-icon icon-tux"></i>';
								break;
							default:
								osIcon = '<li>';
						}
						
						newItem += osIcon + auditMarkup;
					} else {
						newItem += '<li>' + auditMarkup;
					}
				}
			});

			newItem = '<ul id="machineInfo">' + newItem + '</ul>';

			// inject list after machine name h1
			machineName.after(newItem);
			machineInfoDirty = false;

			// audit overflow arrow popover
			$('.popover-arrow').click(function(event) {
				createPopover($(this), 'left', newItem, true);
				event.stopPropagation();
			});
		});
	};
	
	var loadLcButtonOptions = function() {
	
			function translateFuncIdToDisplayName(functionId) {
				// this should/could be done and available in the json...
				var retVal = '';
				switch (functionId) {
					case 170100: // could make a hash to remove magic numbers
						retVal = "Desktop Access";
						break;
	
					case 170600: // could make a hash to remove magic numbers
						retVal = "Command Shell"; // TODO: handle terminal if OSX
						break;
	
					case 170300: // could make a hash to remove magic numbers
						retVal = "Registry Editor";
						break;
	
					case 170700:
						retVal = "Task Manager";
						break;
	
					case 170900:
						retVal = "Event Viewer";
						break;
	
					case 171200:
						retVal = "Ticketing";
						break;
	
					case 170400:
						retVal = "Chat";
						break;
	
					case 170200:
						retVal = "File Manager";
						break;
	
					default:
						//throw ("unexpected functionId [" + functionId + "]");
						retVal = functionId;
				}
				return retVal;
			}
	
			// load LIVE CONNECT button data and popover
	        //*************************************************************
//			$.ajax({
//				url: '/vsapres/quickview/main/getliveconnectbuttonfunctionlist',
//				data: {},
//				dataType: 'json'
//			}).done(function(data) {
//				var buttonOptions = '';
//				$.each(data, function(item) {
//					buttonOptions += '<li><a class="lcButton" lcBtnName="'+data[item].Label+'">'+data[item].LabelLstr+'</a></li>';
//				});
//	
//				buttonOptions = '<ul id="lcOptions">'+buttonOptions+'</ul>';
//				$('.machine-actions .btn.primary .icon-arrow-down').click(function(event) {
//					createPopover($(this), 'left', buttonOptions, true);
//					$(".lcButton").click(function(e) {
						// TODO: this VVVV will not work when quick view is popped in a separate window
//						window.top.OpenLiveConnectWindow(agentGuid, false, $(this).attr('lcBtnName'));
//						e.preventDefault();
//					});
//					event.stopPropagation();
//				});
//			});
		};
		
		// dashlets are sortable
		$('.dashlets').sortable({
			placeholder: 'dashlet-sortable-placeholder',
			handle: '.header',
			revert: 100
		});
	
		loadMachineInfo();
		//loadLcButtonOptions();

});