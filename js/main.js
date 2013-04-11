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

$(document).ready(function () {
	if (window.top.location.search.indexOf('full-screen') >= 0) {
		$('body').addClass('full-screen');
	}
    
    var machineInfoDirty = false;
    var buttonOptions = '';

    //disk volume data
    var diskVolumeData = null;
    var diskVolumeIndex = 0;
    
    //load defaults for admin
	var adminDefaults = null;
	$.ajax({
	    url: '/json/getadmindashdefaults.json', //vsapres/quickview/main/getadmindashdefaults
	    //data: { adminId: adminId },
	    dataType: 'json',
	    cache: false
	}).done(function (data) {
	    adminDefaults = data.Data;

	    var list = [];
	    $('.dashlet').each(function () {
	        list.push(this);
	        $(this).detach();
	    });

	    listOrder = adminDefaults.AgentDashDashboardCol.split(",");

	    for (var i = 0; i < listOrder.length; i++) {
	        for (var j = 0; j < list.length; j++) {

	            if (list[j].id == listOrder[i]) {
	                $('.dashlets').append(list[j]);//where parent_el is the place you want to reinsert the divs in the DOM  
	                $(list[j]).css('display','inline-block').toggle().fadeIn(400);
	            }
	        }

	    }

	});

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
	var popoverOpen = false;
	
	window.popoverTimer = '';

	var createPopover = function(event, popoverClass, target, targetHPos, targetVPos, popoverHPos, popoverVPos, popoverContent, sortable) {

		if(popoverOpen == false) {

			var popoverTemplate = '<div class="popover ' + popoverClass + '"><div class="popover-content"></div></div>';

			// inject popover markup to body
			$('.smi-modal').append(popoverTemplate);

			var popover = $('.popover');

			// inject content into popover
			popover.find('.popover-content').html(popoverContent);

			// position popover relative to target and depending on left or right
			popover.position({
				of: target,
				my: targetHPos + ' ' + targetVPos,
				at: popoverHPos + ' ' + popoverVPos,
				collision: 'flipfit'
			});

			// prevent popover from closing when itself is clicked on
			$('.popover').click(function(event) {
				event.stopPropagation();
			});
			
			// remove popover when hovered outside
			$('.popover').mouseleave(function() {
				// call timeout function to close popover
				window.popoverTimer = setTimeout( function() {
					removePopovers();
				}, 2000);
			});
			
			$('.popover').mouseenter(function() {
				window.clearTimeout(popoverTimer);
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
						$(this).css('pointer-events','none');
						startIndex = ui.item.index();
					},
					update: function(event, ui) {
						$(this).css('pointer-events','auto');
						// highlight dropped element
						$(ui.item).css('background-color', '#ffffcb').animate({ 'background-color': '#f0f3f5' }, 500);
						var targetElement = $(event.target);
						if (targetElement.attr('id') == 'lcOptions') {
							if (startIndex > -1) {
								var btnDetails = JSON.parse($(targetElement.find('a')[0]).attr('qlBtnDetails'));
								var newBtnLabel = btnDetails.Label;
								var qlBtn = $('.quicklaunch.menu-item.div span');
								if (qlBtn.text() != newBtnLabel) {
									qlBtn.text(newBtnLabel);
									$(qlBtn.siblings()[0]).attr('class', 'icon-'+btnDetails.Label.replace(/\s*/g, ''));
								}
	
								var newAgentDashOrder = [];
								var newAgentDashItems = [];
								var currentAgentDashActions = targetElement.children();
								var actionsLength = currentAgentDashActions.length;
								for (var i = 0; i < actionsLength; i++) {
									var agentDashAction = JSON.parse($(currentAgentDashActions[i]).find('a').attr('qlBtnDetails'));
									newAgentDashItems.push(agentDashAction);
									newAgentDashOrder.push(agentDashAction.ItemNumber+"-1"); // the 1 is the enabled flag... TODO allow for disabling
								}
	
								$.ajax({
//									url: '/vsapres/quickview/main/UpdateQuickLaunchButtonsOrder',
//									data: { newAgentDashOrder: newAgentDashOrder.join(",") },
//									type: 'POST',
//									cache: false
								}).done(function(data) {
									// reload the options
									buttonOptions = buildQuickLaunchActionUnorderedListItems(newAgentDashItems);
								});
	
							}
						} else if (targetElement.attr('id') == 'machineInfo') {
							if (startIndex > -1) {
								// highlight dropped item
								

								//update new spot
//								$.ajax({
//									url: '/vsapres/quickview/main/updatemachauditorder',
//									data: { adminId: adminId, startIndex: startIndex, endIndex: ui.item.index() },
//									type: 'POST',
//									cache: false
//								}).done(function(data) {
									//console.log('complete');
//								});

								machineInfoDirty = true;
							}
						}
					}
				});
			}

			popoverOpen = true;
			event.stopPropagation();
		}
		else {
			removePopovers();
		}
	};

	var removePopovers = function () {
		window.clearTimeout(popoverTimer);
		$('.popover').remove();
		popoverOpen = false;
		
		// reset rotated preferences icons
		$('.dashboard-preferences.active').removeClass('active');

		//reload machine info if changes
		if (machineInfoDirty) {
			loadMachineInfo();
		}
	};

	// remove popover when someone clicks outside of it
	$('html').click(function () {
		removePopovers();
	});

	// remove popover when window is resized
	$(window).resize(function () {
		removePopovers();
	});
	
	var QV_TABS = {
		'DASHBOARD': 'dashboard',
		'TICKETS': 'tickets',
		'ALARMS': 'alarms',
		'PROCEDURES': 'procedures',
		'AUDIT': 'audit',
		'TOOLS': 'tools'
	};

	var QV_EVENTS = {
		'TAB_CHANGED': 'TAB_CHANGED',
		'LOCAL_NAV_CHANGED': 'LOCAL_NAV_CHANGED'
	};

	var getData = function(url, agentGuid, callback) {
		$.get(url, { agentGuid: agentGuid }).done(callback);
	};
	var getCheckMark = function(val) {
		return (val ? '<i class="icon-checkmark-circle">' : '');
	};
	var getDiskGraphicalRepresentation = function(free, used) {
		var retVal = '';
		if (free >= 0 && used > 0) {
			retVal = '<span class="sparklines" sparkType="pie">' + used + ',' + free + '</span>';
		}
		return retVal;
	};

//	$(document).on(QV_EVENTS.LOCAL_NAV_CHANGED, function (event) {
//		switch (event.qvEventTarget) {
//
//			case "agentlog":
//				getData("/vsapres/quickview/main/getagentlog", agentGuid, function (data) {
//					$("#agentLogData").empty();
//					$.each(data["Data"], function (index) {
//						var log = data["Data"][index];
//						$("#agentLogData").append(
//							'<tr><td><time>' + log.Time +
//							'</time></td><td>' + log.Descr +
//							'</td></tr>');
//					});
//				});
//				break;
//
//			case "alarmlog":
//				getData("/vsapres/quickview/main/getagentalarmlog", agentGuid, function (data) {
//					$("#alarmLogData").empty();
//					$.each(data["Data"], function (index) {
//						var log = data["Data"][index];
//						var logDescription = String(log.Descr).replace(/(\r\n|\n|\r)/gm, "<br/>");
//						$("#alarmLogData").append(
//							'<tr><td><time>' + log.Time +
//							'</time></td><td>' + log.Type +
//							'</td><td>' + logDescription +
//							'</td></tr>');
//					});
//				});
//                break;
//
//            case "ticketlog":
//                getData("/vsapres/quickview/main/getticketlist", agentGuid, function (data) {
//                    $("#ticketLogData").empty();
//                    $.each(data["Data"], function (index) {
//                        var log = data["Data"][index];
//                        var ticSummary = String(log.Summary).replace(/(\r\n|\n|\r)/gm, "<br/>");
//                        $("#ticketLogData").append(
//                            '<tr><td>' + log.TicketRef +
//                            '</td><td>' + log.Assignee +
//                            '</td><td>' + log.Status +  
//							'</td><td><time>' + log.LastModified +
//							'</time></td><td>' + ticSummary +
//							'</td></tr>');
//                    });
//                });
//                break;
//
//			case "monitoractionlog":
//				getData("/vsapres/quickview/main/getmonitoractionlog", agentGuid, function (data) {
//					$("#monitorActionLogData").empty();
//					$.each(data["Data"], function (index) {
//						var log = data["Data"][index];
//						var logDescription = String(log.Descr).replace(/(\r\n|\n|\r)/gm, "<br/>");
//						$("#monitorActionLogData").append(
//							'<tr><td><time>' + log.Time +
//							'</time></td><td>' + log.Type +
//							'</td><td>' + log.DeviceName +
//							'</td><td>' + logDescription +
//							'</td></tr>');
//					});
//				});
//				break;
//
//			case "pending":
//				getData("/vsapres/quickview/main/getpendingprocedureslist", agentGuid, function (data) {
//					$("#pendingAgentProcedures").empty();
//					$.each(data["Data"], function (index) {
//						var proc = data["Data"][index];
//						var procName = (proc.Name.length > 30) ? proc.Name.substr(0, 26) + '...' : proc.Name;
//						$("#pendingAgentProcedures").append(
//							'<tr><td>' + procName +
//							'</td><td><time>' + proc.ScheduledExecution + /* handle run now */
//							'</time></td><td>' + proc.RecurringInterval +
//							'</td><td>' + proc.Admin +
//							'</td></tr>');
//					});
//				});
//				break;
//
//			case "history":
//				getData("/vsapres/quickview/main/getprocedurehistorylist", agentGuid, function (data) {
//					$("#agentProcedureHistory").empty();
//					$.each(data["Data"], function (index) {
//						var proc = data["Data"][index];
//						var procName = (proc.Name.length > 30) ? proc.Name.substr(0, 26) + '...' : proc.Name;
//						$("#agentProcedureHistory").append(
//							'<tr><td>' + procName +
//							'</td><td><time>' + proc.LastExecution +
//							'</time></td><td>' + proc.Status +
//							'</td><td>' + proc.Admin +
//							'</td></tr>');
//					});
//				});
//				break;
//
//			case "log":
//				getData("/vsapres/quickview/main/getprocedurehistorylist", agentGuid, function (data) {
//					$("#agentProcedureLog").empty();
//					$.each(data["Data"], function (index) {
//						var proc = data["Data"][index];
//						var procName = (proc.Name.length > 30) ? proc.Name.substr(0, 26) + '...' : proc.Name;
//						$("#agentProcedureLog").append(
//							'<tr><td><time>' + proc.LastExecution +
//							'</time></td><td>' + procName +
//							'</td><td>' + proc.Description +
//							'</td></tr>');
//					});
//				});
//				break;
//
//			case "execute":
//				break;
//
//			case "diskVolumes":
//				getData("/vsapres/quickview/main/getdisklist", agentGuid, function(data) {
//					$("#diskVolumesData").empty();
//					$.each(data["Data"], function (index) {
//						var drive = data["Data"][index];
//						$("#diskVolumesData").append(
//							'<tr>'+
//							'	<td>'+drive.DriveLetter+'</td>'+
//							'	<td>'+drive.Type+'</td>'+
//							'	<td>'+drive.FormatType+'</td>'+
//							'	<td>'+drive.FreeBytesLabel+' </td>'+
//							'	<td>'+drive.UsedBytesLabel+'</td>'+
//							'	<td class="pieChart">'+getDiskGraphicalRepresentation(drive.FreeMBytes, drive.UsedMBytes)+'</td>'+
//							'	<td>'+drive.TotalBytesLabel+'</td>'+
//							'	<td>'+drive.VolumeName+'</td>'+
//							'</tr>');
//					});
//
					// let sparkline do its thing
//					if (data.Total > 0) {
//						$(".sparklines").sparkline('html', {
//							enableTagOptions: true,
//							width: '25px',
//							height: '25px',
//							sliceColors: ['blue','green']
//						});
//					}
//				});
//				break;
//
//			case "diskPartitions":
//				getData("/vsapres/quickview/main/getdiskPartitionlist", agentGuid, function(data) {
//					$("#diskPartitionsData").empty();
//					$.each(data["Data"], function (index) {
//						var drivePartition = data["Data"][index];
//						$("#diskPartitionsData").append(
//							'<tr>'+
//							'	<td>'+drivePartition.PartitionName+'</td>'+
//							'	<td>'+drivePartition.DiskIndex+'</td>'+
//							'	<td>'+drivePartition.Type+'</td>'+
//							'	<td>'+$.number(drivePartition.Size)+'</td>'+
//							'	<td>'+drivePartition.FragmentationLevel+'%</td>'+
//							'	<td>'+getCheckMark(drivePartition.IsPrimaryPartition)+'</td>'+
//							'	<td>'+getCheckMark(drivePartition.IsBootable)+'</td>'+
//							'	<td>'+getCheckMark(drivePartition.IsActiveBootPartition)+'</td>'+
							//'	<td>'+drivePartition.Health+'</td>'+
//							'</tr>');
//					});
//				});
//				break;
//
//			case "diskShares":
//				getData("/vsapres/quickview/main/getSharelist", agentGuid, function(data) {
//					$("#diskSharesData").empty();
//					$.each(data["Data"], function (index) {
//						var share = data["Data"][index];
//						$("#diskSharesData").append(
//							'<tr>'+
//							'	<td>'+share.ShareName+'</td>'+
//							'	<td>'+share.Path+'</td>'+
//							'	<td>'+share.Type+'</td>'+
//							'	<td>'+share.Description+'</td>'+
//							'</tr>');
//					});
//				});
//				break;
//
//			default:
//				throw ("Unhandled LOCAL_NAV_CHANGED event [" + event.qvEventTarget + "]");
//		}
//	});
//
//	$(document).on(QV_EVENTS.TAB_CHANGED, function (event) {
//		switch (event.qvEventTarget) {
//			case "dashboard":
//				break;
//
//            case "tickets":
//                $.event.trigger({
//                    type: QV_EVENTS.LOCAL_NAV_CHANGED,
//                    qvEventTarget: "ticketlog" // TODO: make this a hash
//                });
//                break;
//
//			case "alarms":
//				$.event.trigger({
//					type: QV_EVENTS.LOCAL_NAV_CHANGED,
//					qvEventTarget: "alarmlog" // TODO: make this a hash
//				});
//				break;
//
//			case "procedures":
				// simulate a click on the pending local nav such that pending procs are displayed by default
				// need to refactor this such that it selects the first sub-nav instead of having to know the sub-nav name
//				$.event.trigger({
//					type: QV_EVENTS.LOCAL_NAV_CHANGED,
//					qvEventTarget: "pending" // TODO: make this a hash
//				});
//				break;
//
//			case "audit":
//				$.event.trigger({
//					type: QV_EVENTS.LOCAL_NAV_CHANGED,
//					qvEventTarget: "agentlog" // TODO: make this a hash
//				});
//				break;
//
//			case "tools":
//				break;
//
//			default:
//				throw ("Unhandled TAB_CHANGED event [" + event.qvEventTarget + "]");
//		}
//	});
	
	
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

		tabItems.find('a').click(function () {
			var thisTabs = $(this).closest('.' + tabsClass);
			var thisTabItems = thisTabs.find('li');
			var tabBodyItems = thisTabs.next().children('div');
			var activeTab = $(this).parent();

			if (!$(activeTab).hasClass('active')) { //if this tab is not active
				var index = thisTabItems.index(activeTab);

				thisTabItems.removeClass('active');
				activeTab.addClass('active');
				tabBodyItems.removeClass('active');
				tabBodyItems.eq(index).addClass('active');

				// custom events
				var eventName = QV_EVENTS.TAB_CHANGED; // default event
				if (tabBodyItems.parent().attr('class').toLowerCase().indexOf('local') >= 0) {
					eventName = QV_EVENTS.LOCAL_NAV_CHANGED;
				}
				var qvEventTarget = tabBodyItems.eq(index).attr("class").replace(" active", "");

				// fire an event for this tab
				$.event.trigger({
					type: eventName,
					qvEventTarget: qvEventTarget
				});
			}
		});
	};

	// select menu
	//*************************************************************
	var selectBehavior = function (options) {
		// when active option is clicked, show popover appended with list of options, then on click of option, change active option and optionBody
		var optionItems = $(options).children('ul').find('li');
		var optionsClass = options.attr('class');

		optionItems.find('a').click(function (event) {
			var thisOptions = $(this).closest('.' + optionsClass);
			var thisOptionItems = thisOptions.find('li');
			var optionBodyItems = thisOptions.next().children('div');

			createPopover('popover-local-nav', this, 'left', 'top', 'left', 'bottom', thisOptions.html());

			// find anchor in popover and add click event
			var popoverItems = $('.popover li');
			popoverItems.find('a').click(function () {
				// get index of clicked anchor
				var index = popoverItems.index($(this).parent());
				thisOptionItems.removeClass('active');
				thisOptionItems.eq(index).addClass('active');
				optionBodyItems.removeClass('active');
				optionBodyItems.eq(index).addClass('active');
				removePopovers();

				// custom events
				var eventName = QV_EVENTS.TAB_CHANGED; // default event

				if (optionBodyItems.parent().attr('class').toLowerCase().indexOf('local') >= 0) {
					eventName = QV_EVENTS.LOCAL_NAV_CHANGED;
				}
				var qvEventTarget = optionBodyItems.eq(index).attr("class").replace(" active", "");

				// fire an event for this tab
				$.event.trigger({
					type: eventName,
					qvEventTarget: qvEventTarget
				});

			});
		});
	};

	// section tabs
	//*************************************************************
	tabBehavior($('.section-tabs'));

	// local nav
	//*************************************************************
	if(Modernizr.mq('(min-width: 600px) and (min-height: 580px)')) {
		tabBehavior($('.local-nav-items'));
	} else {
		selectBehavior($('.local-nav-items'));
	}

	var loadMachineInfo = function() {
		// load machine audit data and popover
		//*************************************************************
		$.ajax({
			url: '/json/getmachineinfo.json', ///vsapres/quickview/main/getmachineinfo
			data: { agentGuid: agentGuid, columns: '' },
			dataType: 'json',
			cache: false
		}).done(function(data) {
			var newItem = '';
			var machineAuditContainer = $('.machine-audit');
	
			//check if exists
			if ($('#machineInfo').length > 0) {
				$('#machineInfo').remove();
			}
	
			$.each(data.Data, function () {
						    
			    if (this.Label.indexOf("req_") == -1) {
			        var label = this.Label;
			        var value = this.Value;
			        var auditMarkup = '<li><span class="label">' + label + '</span><span class="value">' + value + '</span><span class="popover-controls"><a class="popover-control-reorder" title="Drag to reorder"><i class="icon-menu"></i></a></span></li>';

			        newItem += auditMarkup;
			    } else {
			        if (this.Label == "req_displayName") {
			            document.title = this.Value;
			            
			            var dispName = this.Value;
						// will handle with css
			            $('#machineName').html(dispName).attr("title", this.Value);
			        }
			    }
			});
	
			newItem = '<ul id="machineInfo">' + newItem + '</ul>';
	
			// inject list into container
			machineAuditContainer.prepend(newItem);
			machineInfoDirty = false;

			// audit overflow arrow popover
			$('.popover-arrow').click(function(event) {
				createPopover(event, 'popover-machine-audit', $(this), 'right', 'top', 'right', 'bottom', newItem, true);
			});
			
		});
	};

//	var launchLiveConnect = function (agentGuid, forceLimited, module) {
//		if ('OpenLiveConnectWindow' in window.top) {
//			window.top.OpenLiveConnectWindow(agentGuid, forceLimited, module);
//			return;
//		} else {
			// try window.opener
//			if ('opener' in window.top) {
//				if ('top' in window.top.opener) {
//					if ('OpenLiveConnectWindow' in window.top.opener.top) {
//						window.top.opener.top.OpenLiveConnectWindow(agentGuid, forceLimited, module);
//						return;
//					}
//				}
//			}
			// you made it this far so try something else
			// out of luck... TODO: could try to load showIcon.js and set a timer
			// might want to move this into quickview.cshtml so it is already available
//			$.body.append('<script type="text/javascript" src="/inc/showIcon.js"></script>');
//			setTimeout(waitForShowIcon, 300);
//		}
//	};
//
//	var waitForShowIcon = function(agentGuid, forceLimited, module) {
//		window.top.OpenLiveConnectWindow(agentGuid, forceLimited, module);
//	};

	var buildQuickLaunchActionUnorderedListItems = function(data) {
		var listItems = '';
		$.each(data, function(item) {
			listItems +=
				"<li>"+
					"<a class='qlButton' qlBtnDetails='" + JSON.stringify(data[item]) + "'>" +
						"<i class='icon-"+data[item].Label.replace(/\s*/g, '')+"'></i>"+
						data[item].LabelLstr +
						"<span class='popover-controls'>"+
							"<span class='popover-control-reorder' title='Drag to reorder'>" +
								"<i class='icon-menu'></i>"+
							"</span>"+
						"</span>"+
					"</a>"+
				"</li>";
		});
		return '<ul id="lcOptions">' + listItems + '</ul>';
	};

	var loadQuickLaunchButtonOptions = function() {
		// load quick launch button data and popover
		//*************************************************************
		$.ajax({
			url: '/json/GetQuickLaunchButtons.json', ///vsapres/quickview/main/GetQuickLaunchButtons
			data: {},
			dataType: 'json',
			cache: false
		}).done(function (data) {
			// rename quick launch to the first item in the returned data
			var quickLaunchLabel = $('.quicklaunch a span');
			quickLaunchLabel.text(data[0].LabelLstr);
			quickLaunchLabel.before('<i class="icon-'+data[0].Label.replace(/\s*/g, '')+'"></i>');

			// next the button options
			buttonOptions = buildQuickLaunchActionUnorderedListItems(data);

			$('.quicklaunch a').mouseenter(
				function (event) { // hover start
					createPopover(event, 'popover-quick-launch', $(this), 'left', 'top', 'left', 'top', buttonOptions, true);
					$(".qlButton").click(function (e) {
						var btnDetails = JSON.parse($(e.target).attr('qlBtnDetails'));
						var module = btnDetails.Label.replace(/\s*/g, '');
						//launchLiveConnect(agentGuid, false, module);
						e.preventDefault();
					}).find('.popover-controls').click(function(e) {
						return false;
					});
				});
		});
	};

	// dashlets are sortable
	var startIndex = -1;
	$('.dashlets').sortable({
		placeholder: 'dashlet-sortable-placeholder',
		handle: '.header',
		revert: 100,
		start: function(event, ui) {
		    startIndex = ui.item.index();
		},
		update: function(event, ui) {
		    // highlight dropped element
		    $(ui.item).css('background-color', '#ffffcb').animate({ 'background-color': '#f7fafc' }, 500);
		    var targetElement = $(event.target);
		    if (startIndex > -1) {
		        //update new spot
//		        $.ajax({
//		            url: '/vsapres/quickview/main/updateadmindashletorder',
//		            data: { adminId: adminId, startIndex: startIndex, endIndex: ui.item.index() },
//		            type: 'POST',
//		            cache: false
//		        }).done(function (data) {
		            //console.log('complete');
//		        });
		    }
		}
	});
	
	// dashboard preferences
	$.ajax({
	    url: '/json/dashboardPreferences.json',
	    dataType: 'json',
	    cache: false
	}).done(function (data) {
		var dashboardPreferencesMarkup = '';
		var checked = '';
		$.each(data, function(i) {
			if (this.Active == true) {
				checked = ' checked';
			}
			else {
				checked = '';
			}
			dashboardPreferencesMarkup += '<li><label><input type="checkbox" ' + checked + '> ' + this.Title + '</label></li>';		
		});
		dashboardPreferencesMarkup = '<h3>Select Dashboard Items</h3><ul>' + dashboardPreferencesMarkup + '</ul>';
		
		$('.dashboard-preferences').click(function(event) {
			createPopover(event, 'popover-dashboard-preferences', this, 'right', 'bottom', 'left', 'top', dashboardPreferencesMarkup);
			$(this).addClass('active');
		});
	});

    var loadDashboards = function () {
        $.ajax({
            url: '/json/GetMachineAlarmsPerDay.json', ///vsapres/quickview/main/GetMachineAlarmsPerDay
            data: { agentGuid: agentGuid, duration: 7 },
            dataType: 'json'
        }).done(function (data) {

            var lineChartData = {
                labels: data.Labels,
                datasets: [
                        {
                            fillColor: "#dde1e5",
                            strokeColor: "#8ac640",
                            pointColor: "#8ac640",
                            pointStrokeColor: "#fff",
                            data: data.Data
                        }
                    ]
            };
            
            var stepWidth = 1;
            if (data.Max > 4) {
                stepWidth = data.Max / 4;
            }
            var myLine = new Chart($("#alarmChart")[0].getContext("2d")).Line(lineChartData, { scaleOverride: true, scaleSteps: 4, scaleStepWidth: stepWidth, scaleStartValue: 0, scaleFontSize: 11 });

        });

        if (diskVolumeData == null) {
            var disks = $.ajax({
                url: '/json/getdisklistbytype.json', ///vsapres/quickview/main/getdisklistbytype
                data: { agentGuid: agentGuid, type: 'Fixed' },
                dataType: 'json'
            }).done(function (data) {
                diskVolumeData = data.Data;
                $('#driveCount').html('hard drives (' + data.Total + ')');
                diskVolumeIndex = 0;
                loadDiskVolumeInfo(diskVolumeIndex);
            });
        }
    };

	loadMachineInfo();
	loadQuickLaunchButtonOptions();
	loadDashboards();

	$("#nextDrive").click(function () {
	    if (diskVolumeData[diskVolumeIndex + 1] != null) {
	        diskVolumeIndex++;
	        loadDiskVolumeInfo(diskVolumeIndex);
	    }
	});

	$("#prevDrive").click(function () {

	    if (diskVolumeData[diskVolumeIndex - 1] != null) {
	        diskVolumeIndex--;
	        loadDiskVolumeInfo(diskVolumeIndex);
	    }

	});

	var loadDiskVolumeInfo = function (index) {
	    if (diskVolumeData != null) {
	        try {

	            var chartData = [{ value: diskVolumeData[index].FreeMBytes, color: "#8ac640" }, { value: diskVolumeData[index].UsedMBytes, color: "#cbd2d9"}];
	            var myChart = new Chart($("#diskChart")[0].getContext("2d")).Pie(chartData);

	            $('#diskDashData').empty();
	            $('#diskDashData').append('<li><span class="label">Free:</span><span class="value">' + diskVolumeData[index].FreeBytesLabel + '</span></li>' +
                        '<li><span class="label">Used:</span><span class="value">' + diskVolumeData[index].UsedBytesLabel + '</span></li>' +
                        '<li><span class="label">Total:</span><span class="value">' + diskVolumeData[index].TotalBytesLabel + '</span></li>');

	            $('#diskPagerDots').empty();
	            var idx = 0;
	            for (var item in diskVolumeData) {
	                if (idx == index) {
	                    $('#diskPagerDots').append('<li class="active"><a class="dotPagerRef" id="dotPager-' + idx + '"><span>' + diskVolumeData[item].DriveLetter + '</span></a></li>');
	                } else {
	                    $('#diskPagerDots').append('<li><a class="dotPagerRef" id="dotPager-' + idx + '"><span>' + diskVolumeData[item].DriveLetter + '</span></a></li>');
	                }
	                idx++;
	            }


	            $(".dotPagerRef").click(function () {
	                var ary = this.id.split("-");
	                if (!isNaN(ary[1])) {
	                    loadDiskVolumeInfo(Number(ary[1]));
	                }
	            });

	            var volumeName = diskVolumeData[index].VolumeName;
	            if (volumeName == '') {
	                volumeName = 'Drive';
	            }
	            $('#volumeLabel').html(diskVolumeData[index].DriveLetter + ' ' + diskVolumeData[index].VolumeName);

	            diskVolumeIndex = index;
	        } catch (e) {
	            //do nothing eat the error
	            console.log(e);
	        }

	    }
	};
	
});