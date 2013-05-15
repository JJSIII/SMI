
//disk volume data
var diskVolumeData = null;
var diskVolumeIndex = 0;

//initialize screenshot
var foundScreenShot = false;
var screenShotTimerId = 0;
var screenShotId = "";
var screenShotScriptId = "";
var doScreenShotCallBack = function () {
    if ($('#dashlet-1').css('visibility') == 'visible' && foundScreenShot == false) {
        getData('/json/getscreenshotimage.json', { agentGuid: agentGuid, scriptId: screenShotScriptId, screenShotId: screenShotId }, function (data) { ///vsapres/quickview/main/getscreenshotimage
            if (data.Success) {
                loadLastScreenShot();
                window.clearInterval(screenShotTimerId);
            }
        });
    }
};

var loadLastScreenShot = function () {
    if ($('#dashlet-1').css('visibility') == 'visible') {

        $('#dash-screenshot-title > span').html("@~Desktop~@");

        $('#screenshot-newwindow').attr("title", "@~Get new screen shot in new window~@");
        $('#screenshot-reload').attr("title", "@~Get new screen shot image~@");
        $.ajax({
            // url: '/images/chartImages/screenShot' + agentGuid + '.jpg?' + Math.random(),
            type: 'HEAD',
            error:
                function () {
                    executeScreenShotCapture();
                },
            success:
                function () {
                    // $('#dash-screenshot').empty().append('<img border=0 alt="no current image" id="screenshot-image" src="/images/chartImages/screenShot' + agentGuid + '.jpg?' + Math.random() + '" />');
                }
        });
    }
};

var executeScreenShotCapture = function () {
    screenShotId = agentGuid + '-' + new Date().getUTCMilliseconds();
    getData('/json/executescreenshotscript.json', { agentGuid: agentGuid, screenShotId: screenShotId }, function (data) { ///vsapres/quickview/main/executescreenshotscript
        foundScreenShot = false;
        screenShotScriptId = data.Message;

        //if machine is offline don't perform capture task
        if (Number(screenShotScriptId) > 0) {
            screenShotTimerId = window.setInterval(doScreenShotCallBack, 10000);
        }
    });
};

var loadCheckinInfoDashlet = function () {
    //load checkin info dashlet
    if ($('#dashlet-6').css('visibility') == 'visible') {

        $('#dash-checkin-title > span').html("@~Check-In Status~@");
        getData('/json/GetMachineConnectionInfo.json', { agentGuid: agentGuid }, function (data) { ///vsapres/quickview/main/GetMachineConnectionInfo
            var connInfo = data.Data;

            $('#checkin-info').empty().append('<li><span class="label">' + connInfo.LastCheckinLabel + '</span> <strong>' + connInfo.LastCheckin + '</strong></li>' +
                '<li><span class="label">' + connInfo.FirstCheckinLabel + '</span> <strong>' + connInfo.FirstCheckin + '</strong></li>' +
                '<li><span class="label">' + connInfo.LastRebootLabel + '</span> <strong>' + connInfo.LastReboot + '</strong></li>');
        });
    }
};

var loadAlarmsDashlet = function () {
    if ($('#dashlet-8').css('visibility') == 'visible') {

        $('#dash-alarms-title > span').html("@~Open Alarms~@");
        $.ajax({
            url: '/json/GetMachineAlarmsPerDay.json', ///vsapres/quickview/main/GetMachineAlarmsPerDay
            data: { agentGuid: agentGuid, duration: 7 },
            dataType: 'json'
        }).done(function (data) {
            if (data.Data.length > 0) {
                var lineChartData = {
                    labels: data.Labels,
                    datasets: [{
                        fillColor: "#dde1e5",
                        strokeColor: "#8ac640",
                        pointColor: "#8ac640",
                        pointStrokeColor: "#fff",
                        data: data.Data
                    }]
                };

                var stepWidth = 1;
                if (data.Max > 4) {
                    stepWidth = data.Max / 4;
                }
                var myLine = new Chart($("#alarmChart")[0].getContext("2d")).Line(lineChartData, { scaleOverride: true, scaleSteps: 4, scaleStepWidth: stepWidth, scaleStartValue: 0, scaleFontSize: 11 });

            } else {
                $("#alarmChart-body").prepend("<span class='text-label'>@~No alarms found~@</span>");
            }

        }).fail(function () {
            $("#alarmChart-body").prepend("<span class='text-label'>@~No alarms found~@</span>");
        });
    }
};

var loadMemoryDashlet = function () {
    //load memory dashlet
    if ($('#dashlet-4').css('visibility') == 'visible') {
        getData('/json/getmemorylist.json', { agentGuid: agentGuid }, function (data) { ///vsapres/quickview/main/getmemorylist
            var usedMem = 0;
            var slotsHtml = '';
            var slotsUsed = 0;
            var slotsTotal = 0;
            $.each(data.Data, function () {
                if (this.SizeMb > 0) {
                    var title = String.format("@~Size~@: {0} | @~Speed~@: {1}", this.SizeMb, this.Speed);
                    slotsHtml += '<div class="slot filled" title="' + title + '"></div>';
                    slotsUsed++;
                    usedMem += this.SizeMb;
                } else {
                    slotsHtml += '<div class="slot"></div>';
                }
                slotsTotal++;
            });

            $('#mem-slots').empty().append(slotsHtml);
            $('#mem-slotstitle').html(String.format("@~Slots used~@ ({0}/{1})", slotsUsed, slotsTotal));
            $('#mem-amount').html('<span class="primary">' + usedMem + '</span>/<span class="secondary">' + data.TotalMemory + '</span>');
            $('#dash-memory-title > span').html("@~Memory~@");
            // memory dashlet tooltips
            $('.slot').tipper({
                direction: 'top'
            });
        });
    }
};

var loadPatchDashlet = function () {
    if ($('#dashlet-2').css('visibility') == 'visible') {
        $('#dash-patch-title > span').html("@~Missing Patches~@");
    }
}

var loadTicketsDashlet = function () {
    if ($('#dashlet-7').css('visibility') == 'visible') {
        $('#dash-tickets-title > span').html("@~Open Tickets~@");
        $('#dash-tickets-viewbutton').html("@~View Open Tickets~@");
    }
}

var loadPolicyDashlet = function () {
    if ($('#dashlet-5').css('visibility') == 'visible') {
        $('#dash-policy-title > span').html("@~Policy Compliance~@");
        $('#dash-policy-healthlabel').html("@~Compliant~@");
    }
}

var loadServiceDeskDashlet = function () {
    if ($('#dashlet-9').css('visibility') == 'visible') {
        $('#dash-servicedesk-title > span').html("@~Open Service Desk Tickets~@");
        $('#dash-servicedesk-viewbutton').html("@~View Open Tickets~@");
    }
}



var loadHardDisksDashlet = function () {
    if ($('#dashlet-3').css('visibility') == 'visible') {
        if (diskVolumeData == null) {
            getData('/json/getdisklistbytype.json', { agentGuid: agentGuid, type: 'Fixed' }, function (data) { ///vsapres/quickview/main/getdisklistbytype
                diskVolumeData = data.Data;
                $('#dash-harddrive-title > span').html('@~hard drives~@ (' + data.Total + ')');
                diskVolumeIndex = 0;
                loadDiskVolumeInfo(diskVolumeIndex);
            });
        }
    }
};

var loadDashboardPrefs = function () {
    //load dashboards last
    getData('/json/getadmindashdefaults.json', { /*adminId: adminId*/ }, function (data) { ///vsapres/quickview/main/getadmindashdefaults
        adminDefaults = data.Data;

        var list = [];
        $('.dashlet').each(function () {
            list.push(this);
            $(this).detach();
        });

        var listOrder = adminDefaults.AgentDashDashboardCol.split(",");

        for (var i = 0; i < listOrder.length; i++) {
            for (var j = 0; j < list.length; j++) {

                //get dashletid
                var dashletId = list[j].id.split("-");
                if (dashletId[1] == listOrder[i]) {
                    $('.dashlets').append(list[j]); //where parent_el is the place you want to reinsert the divs in the DOM
                    $(list[j]).css('display', 'inline-block').toggle().fadeIn(600);
                }
            }

        }
    });
};

var loadDiskVolumeInfo = function (index) {
    if (diskVolumeData != null) {
        try {
            var chartData = [{ value: diskVolumeData[index].FreeMBytes, color: "#8ac640" }, { value: diskVolumeData[index].UsedMBytes, color: "#cbd2d9" }];
            var myChart = new Chart($("#diskChart")[0].getContext("2d")).Pie(chartData);

            $('#diskDashData').empty();
            $('#diskDashData').append('<li><span class="label">@~Free~@:</span><span class="value">' + diskVolumeData[index].FreeBytesLabel + '</span></li>' +
                    '<li><span class="label">@~Used~@:</span><span class="value">' + diskVolumeData[index].UsedBytesLabel + '</span></li>' +
                    '<li><span class="label">@~Total~@:</span><span class="value">' + diskVolumeData[index].TotalBytesLabel + '</span></li>');

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
                volumeName = '@~Drive~@';
            }
            $('#volumeLabel').html(diskVolumeData[index].DriveLetter + ' ' + volumeName);

            diskVolumeIndex = index;
        } catch (e) {
            //do nothing eat the error
            //console.log(e);
        }
    }
};

$(document).ready(function () {

    var loadDashboards = function () {

        $('.dash-reload').attr("title", "@~Reload~@");

        loadAlarmsDashlet();
        loadLastScreenShot();
        loadMemoryDashlet();
        loadHardDisksDashlet();
        loadCheckinInfoDashlet();
        loadPatchDashlet();
        loadServiceDeskDashlet();
        loadPolicyDashlet();
        loadTicketsDashlet();
    };

    loadDashboards();
    loadDashboardPrefs();

    // dashlets are sortable
    var startIndex = -1;
    $('.dashlets').sortable({
        placeholder: 'dashlet-sortable-placeholder',
        handle: '.header',
        revert: 100,
        start: function (event, ui) {
            startIndex = ui.item.index();
        },
        update: function (event, ui) {
            // highlight dropped element
            $(ui.item).css('background-color', '#ffffcb').animate({ 'background-color': '#f7fafc' }, 500);
            var targetElement = $(event.target);
            if (startIndex > -1) {
                //update new spot
                $.ajax({
                    url: '/vsapres/quickview/main/updateadmindashletorder',
                    data: { adminId: adminId, startIndex: startIndex, endIndex: ui.item.index() },
                    type: 'POST',
                    cache: false
                }).done(function (data) {
                    //console.log('complete');
                });
            }
        }
    });

    //handle reload of screen shot
    $('#screenshot-reload').click(function () {
        executeScreenShotCapture();
    });

    $('#screenshot-newwindow').click(function () {
        //window.open('/Toolbox/screenShot.asp?agentGuid=' + agentGuid + '&' + Math.random(), 'screenshot' + agentGuid);
    });

    $('#check-in-status-reload').click(function () {
        loadCheckinInfoDashlet();
    });

    $('#hard-drives-reload').click(function () {
        diskVolumeData = null;
        loadHardDisksDashlet();
    });

    $('#memory-reload').click(function () {
        loadMemoryDashlet();
    });

    $('#alarms-reload').click(function () {
        loadAlarmsDashlet();
    });

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

});
