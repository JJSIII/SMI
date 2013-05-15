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

// TODO: move this into a separate file
if (!("format" in String)) {
    String.format = function(/*format, arg1, arg2,...argN*/) {
        var argumentsRaw = $.makeArray(arguments);
        var format = argumentsRaw.shift(); // shift off the format string
        var args = argumentsRaw; // what's left are the replacements
        return format.replace(/\{(\d+)\}/g, function(m, i) {
            return args[i];
        });
    };
}

// globals :(
var machineInfoDirty = false;
var buttonOptions = '';
var quickLaunchPreferences = '';
var agentOnline = false;

//load defaults for admin
var adminDefaults = null;

//agent admin notes paging
var g_agentAdminNotesPage = 0;
var g_loadingAgentNotesData = false;

// admin alert popover
var adminMessage = "";

// popovers
//*************************************************************
var popoverTarget = undefined;

window.popoverTimer = '';

var createPopover = function(popoverClass, target, targetHPos, targetVPos, popoverHPos, popoverVPos, popoverContent, sortable) {
    removePopovers();

    if(popoverTarget != target) {
        var closeButtonMarkup = '<a title="@~Close~@" class="close"><i class="icon-close"></i></a>';
        var popoverTemplate = '<div class="popover ' + popoverClass + '"><div class="popover-content"></div></div>';

        // inject popover markup to body
        $('.smi-modal').append(popoverTemplate);

        var popover = $('.popover');

        // inject content into popover
        if(popoverClass.indexOf('alert') != -1) {
            popover.find('.popover-content').html(closeButtonMarkup + popoverContent);
        } else {
            popover.find('.popover-content').html(popoverContent);
        }

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

        $('.popover').mouseleave(function() {
            if(!$(this).hasClass('alert')) {
                window.popoverTimer = setTimeout( function() {
                    //removePopovers();
                    popoverTarget = undefined;
                }, 2000);
            }
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

                    // ignore if the startIndex did not change
                    if (startIndex > -1) {
                        var targetElement = $(event.target);
                        if (targetElement.attr('id') == 'agentDashActions') {
                            fireAgentDashActionChangeEvent(targetElement);
                        } else if (targetElement.attr('id') == 'machineInfo') {
                            //update new spot
                            $.event.trigger({
                                type: QV_EVENTS.DATA_CHANGED,
                                qvEventTarget: 'machineInfo',
                                adminId: adminId,
                                startIndex: startIndex,
                                endIndex: ui.item.index()
                            });
                        } else {
                            throw String.foramt("unhandled sortable update event for []", targetElement.attr('id'));
                        }
                    }

                    // reset startIndex to non-drag state
                    startIndex = -1;
                }
            });
        }

        popoverTarget = target;
    }
    else {
        removePopovers();
        popoverTarget = undefined;
    }
};

var removePopovers = function () {
    window.clearTimeout(popoverTimer);
    $('.popover').remove();

    // reset rotated preferences icons
    $('.menu-item.preferences').removeClass('active');

    //reload machine info if changes
    if (machineInfoDirty) {
        loadMachineInfo();
    }
};

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
        $('.popover-local-nav .popover-content ul').addClass('action-list');
        event.stopPropagation();

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
            popoverTarget = undefined;

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

var sortableActionTables = function() {
    $('.action-table.sortable > tbody').sortable({
        axis: 'y',
        placeholder: 'sortable-placeholder',
        handle: '.reorder-handle',
        revert: 100,
        start: function(event, ui) {
            $(this).css('pointer-events', 'none');
            startIndex = ui.item.index();
        },
        update: function(event, ui) {
            $(this).css('pointer-events','auto');
            $(ui.item).css('background-color', '#ffffcb').animate({ 'background-color': '#f0f3f5' }, 500);

            if (startIndex > -1) {
                var scripts = $(event.target).children();
                var newAdminRunNowScriptOrder = [];
                $.map(scripts, function(script) {
                    newAdminRunNowScriptOrder.push(script.id);
                });
                // send to server
                $.event.trigger({
                    type: QV_EVENTS.DATA_CHANGED,
                    qvEventTarget: 'adminRunNowScripts',
                    newAdminRunNowScriptOrder: newAdminRunNowScriptOrder.join(',')
                });
            }

            // reset startIndex to non-drag state
            startIndex = -1;
        },
        helper: function(e, tr) {
            var $originals = tr.children();
            var $helper = tr.clone();
            $helper.children().each(function(index) {
                // Set helper cell sizes to match the original sizes
                $(this).width($originals.eq(index).width());
            });
            return $helper;
        }
    });
};

// when the document is ready do something
//*************************************************************

$(document).ready(function () {
    QuickViewInit();
    $.event.trigger(QV_EVENTS.DOC_READY);

    if (window.top.location.search.toLowerCase().indexOf('full-screen') >= 0) {
        $('body').addClass('full-screen');
    }

    // remove popover when someone clicks outside of it
    $('html').click(function () {
        removePopovers();
        popoverTarget = undefined;
    });

    // remove popover when window is resized
    $(window).resize(function () {
        removePopovers();
        popoverTarget = undefined;
    });

    // action table icons
    //*************************************************************
    $('a.icon').click(function() {
        $(this).toggleClass('active');
    });

    tabBehavior($('.section-tabs'));

    // local nav
    //*************************************************************
    if (Modernizr.mq('(min-width: 600px)')) {
        tabBehavior($('.local-nav-items'));
    } else {
        selectBehavior($('.local-nav-items'));
    }

    // panel tabs
    tabBehavior($('.local-body .tabs'));
});