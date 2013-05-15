var QuickViewInit = function() {
    $(document).on(QV_EVENTS.DOC_READY, function() {
        // build html
        buildMenuBar();
        buildTabs();
        buildTabSkeletons();
        buildPrefSkeleton();

        // start to load all the data we need first
        loadQuickLaunchButtonOptions(); // these seem to take a while so load first
        loadAgentOnlineStatus();
        loadMachineInfo();

        setTimeout(pollAgentOnlineStatus, 15000);

        $(document).on(QV_EVENTS.LOCAL_NAV_CHANGED, function(event) {
            var bigList = getIsBigWindow();

            switch (event.qvEventTarget) {
            case "audit-logs": // hardware local nav click...
            case "audit-logs-agent":
                getData("/json/getagentlog.json", {agentGuid: agentGuid}, function (data) {
                    $("#audit-logs-agentData").empty();
                    $.each(data["Data"], function (index) {
                        var log = data["Data"][index];
                        $("#audit-logs-agentData").append(
                            '<tr><td><time>' + log.Time +
                            '</time></td><td>' + log.Descr +
                            '</td></tr>');
                    });
                });
                break;

            case "audit-logs-configuration":
                getData("/vjson/getagentconfiglog.json", {agentGuid: agentGuid}, function (data) {
                    $("#audit-logs-configurationData").empty();
                    $.each(data["Data"], function (index) {
                        var log = data["Data"][index];
                        $("#audit-logs-configurationData").append(
                            '<tr><td><time>' + log.Time +
                            '</time></td><td>' + log.Descr +
                            '</td></tr>');
                    });
                });
                break;

            case "audit-logs-monitor-action":
                getData("/json/getmonitoractionlog.json", { agentGuid: agentGuid }, function (data) {
                    $("#audit-logs-monitor-actionData").empty();
                    $.each(data["Data"], function (index) {
                        var log = data["Data"][index];
                        var logDescription = String(log.Descr).replace(/(\r\n|\n|\r)/gm, "<br/>");
                        $("#audit-logs-monitor-actionData").append(
                            '<tr><td><time>' + log.Time +
                            '</time></td><td>' + log.Type +
                            '</td><td>' + log.DeviceName +
                            '</td><td>' + logDescription +
                            '</td></tr>');
                    });
                });
                break;

            case "audit-logs-remote-control":
                getData("/json/getremotecontrollog.json", { agentGuid: agentGuid }, function (data) {
                    $("#audit-logs-remote-controlData").empty();
                    $.each(data["Data"], function (index) {
                        var remoteControlEvent = data["Data"][index];
                        var displayDuration = (remoteControlEvent.FormattedDuration == '00:00:00' ? '--' : remoteControlEvent.FormattedDuration);
                        $("#audit-logs-remote-controlData").append(
                            String.format('<tr><td><time>{0}</time></td><td>{1}</td><td>{2}</td><td>{3}</td></tr>',
                                remoteControlEvent.EventTime, getRemoteControlDescription(remoteControlEvent),
                                displayDuration, remoteControlEvent.AdminName));
                    });
                });
                break;

            case "alarmlog":
                getData("json/getagentalarmlog.json", { agentGuid: agentGuid, bigList: bigList }, function (data) {
                    //setup table header
                    if (!bigList) {
                        $('#alarmlogHeader').empty().append('<tr><th>Time</th><th>Type</th><th>Description</th></tr>');
                    } else {
                        $('#alarmlogHeader').empty().append('<tr><th>Alarm ID</th><th>Time</th><th>State</th><th>Type</th><th>Ticket</th><th>Description</th></tr>');
                    }

                    $("#alarmlogData").empty();
                    $.each(data["Data"], function (index) {
                        var log = data["Data"][index];
                        var logDescription = String(log.Descr).replace(/(\r\n|\n|\r)/gm, "<br/>");

                        if (!bigList) {
                            $("#alarmlogData").append(
                                '<tr><td><time>' + log.Time +
                                    '</time></td><td>' + log.Type +
                                    '</td><td>' + logDescription +
                                    '</td></tr>');
                        } else {
                            $("#alarmlogData").append(
                                '<tr><td>' + log.AlarmId +
                                    '</td><td><time>' + log.Time +
                                    '</time></td><td>' + log.Status +
                                    '</td><td>' + log.Type +
                                    '</td><td>' + log.TicketId +
                                    '</td><td>' + logDescription +
                                    '</td></tr>');
                        }
                    });
                });
                break;

            case "ticketlog":
                getData("/json/getticketlist.json", {agentGuid: agentGuid}, function (data) {
                    $("#ticketlogData").empty();
                    $.each(data["Data"], function (index) {
                        var log = data["Data"][index];
                        var ticSummary = String(log.Summary).replace(/(\r\n|\n|\r)/gm, "<br/>");
                        $("#ticketlogData").append(
                            '<tr><td>' + log.TicketRef +
                            '</td><td>' + log.Assignee +
                            '</td><td>' + log.Status +
                            '</td><td><time>' + log.LastModified +
                            '</time></td><td>' + ticSummary +
                            '</td></tr>');
                    });
                });
                break;

            case "pending":
                getData("/json/getpendingprocedureslist.json", {agentGuid: agentGuid}, function (data) {
                    $("#pendingData").empty();
                    $.each(data["Data"], function (index) {
                        var proc = data["Data"][index];
                        var procName = (proc.Name.length > 30) ? proc.Name.substr(0, 26) + '...' : proc.Name;
                        $("#pendingData").append(
                            '<tr><td>' + procName +
                            '</td><td><time>' + proc.ScheduledExecution + /* handle run now */
                            '</time></td><td>' + proc.RecurringInterval +
                            '</td><td>' + proc.Admin +
                            '</td></tr>');
                    });
                });
                break;

            case "history":
                getData("/json/getprocedurehistorylist.json", {agentGuid: agentGuid}, function (data) {
                    $("#historyData").empty();
                    $.each(data["Data"], function (index) {
                        var proc = data["Data"][index];
                        var procName = (proc.Name.length > 30) ? proc.Name.substr(0, 26) + '...' : proc.Name;
                        $("#historyData").append(
                            '<tr><td>' + procName +
                            '</td><td><time>' + proc.LastExecution +
                            '</time></td><td>' + proc.Status +
                            '</td><td>' + proc.Admin +
                            '</td></tr>');
                    });
                });
                break;

            case "log":
                getData("/json/getprocedurehistorylist.json", {agentGuid: agentGuid}, function (data) {
                    $("#logData").empty();
                    $.each(data["Data"], function (index) {
                        var proc = data["Data"][index];
                        var procName = (proc.Name.length > 30) ? proc.Name.substr(0, 26) + '...' : proc.Name;
                        $("#logData").append(
                            '<tr><td><time>' + proc.LastExecution +
                            '</time></td><td>' + procName +
                            '</td><td>' + proc.Description +
                            '</td></tr>');
                    });
                });
                break;

            case "execute":
                // some helper functions
                var getExecuteProcTableRow = function(scriptId, scriptName, scriptHasPrompts) {
                    var tr =
                        '<tr id="' + scriptId + '" scriptHasPrompts="'+(scriptHasPrompts == null ? '-1': scriptHasPrompts)+'">' +
                        '    <td><a class="action" title="@~Execute procedure~@">' + scriptName + '</a></td>' +
                        '    <td class="icon">' +
                        '       <a title="@~Delete~@"><i class="icon-close"></i></a>' +
                        '    </td>' +
                        '    <td class="icon">' +
                        '        <a class="reorder-handle" title="@~Drag to reorder~@"><i class="icon-menu"></i></a>' +
                        '    </td>' +
                        '</tr>';
                    return tr;
                };

                var bindClickEvents = function() {
                    // set up the click delete click handler
                    $("#adminRunNowCollection td.icon > a").undelegate("i.icon-close", "click");
                    $("#adminRunNowCollection td.icon > a").delegate("i.icon-close", "click", function (e) {
                        var eventTarget = $(e.target).parent().parent().parent();
                        // update the ui
                        $(eventTarget[0]).remove();

                        // persist the data - NOTE: the next 4 lines could be moved to the event handler
                        var newAdminRunNowScriptOrder = [];
                        $.map($("#adminRunNowCollection").children(), function(script) {
                            newAdminRunNowScriptOrder.push(script.id);
                        });

                        $.event.trigger({
                            type: QV_EVENTS.DATA_CHANGED,
                            qvEventTarget: 'adminRunNowScripts',
                            newAdminRunNowScriptOrder: newAdminRunNowScriptOrder.join(',')
                        });
                    });

                    // set up the execute click handler
                    $("#adminRunNowCollection td").undelegate("a.action", "click");
                    $("#adminRunNowCollection td").delegate("a.action", "click", function(e) {
                        debugger;
                        alert(String.format('TODO: run {0}', ($(e.target).text())));

                    });
                };

                getData("/json/GetAvailableScriptCollection.json", {agentGuid: agentGuid}, function(data) {
                    $("#availableScripts").empty();

                    // add option groups
                    var currentSearchTypeId = -1;
                    $.each(data["Data"], function(index) {
                        var script = data["Data"][index];
                        if (script.SearchTypeId != currentSearchTypeId) {
                            // insert optgroup
                            $("#availableScripts").append($('<optgroup label="' + script.SearchType + '"></optgroup>'));
                            currentSearchTypeId = script.SearchTypeId;
                        }

                        var cssSelector = 'optgroup[label="' + script.SearchType + '"]';
                        $("#availableScripts")
                            .find(cssSelector)
                            .append($('<option value="'+script.Id+"|"+script.ItemName+'">'+script.ItemName+'</option>'));
                    });

                    $("#availableScripts").select2({
                        placeholder: "Start typing to see the available agent procedures",
                        allowClear: true
                    });

                    $("#addRunNowProcs").click(function(e) {
                        // select2 stashes the selected values as a csv
                        var scriptsToAdd = $("#availableScripts").val();
                        if (scriptsToAdd != null) {
                            $.each(scriptsToAdd, function(index) {
                                var script = scriptsToAdd[index].split('|');
                                // add them to the table and persist the data if not already present
                                // build the css selector for the script to add
                                var scriptIsDuplicate = $("#adminRunNowCollection tr[id*="+script[0]+"]").length > 0;
                                if (scriptIsDuplicate) {
                                    // probably want to display a message indicating that this script is already in the list
                                    // or just ignore it...
                                } else {
                                    $("#adminRunNowCollection").append(
                                        getExecuteProcTableRow(script[0], script[1], null) // TODO: get the scriptHasPrompts value
                                    );

                                    // persist the data - NOTE: the next 4 lines could be moved to the event handler
                                    var newAdminRunNowScriptOrder = [];
                                    $.map($("#adminRunNowCollection").children(), function(proc) {
                                        newAdminRunNowScriptOrder.push(proc.id);
                                    });

                                    $.event.trigger({
                                        type: QV_EVENTS.DATA_CHANGED,
                                        qvEventTarget: 'adminRunNowScripts',
                                        newAdminRunNowScriptOrder: newAdminRunNowScriptOrder.join(',')
                                    });
                                }
                            });

                            // remove the selected values from the select box
                            $("#availableScripts").val("").trigger("change");

                            bindClickEvents();
                        }
                    });
                });
                getData("/json/GetAdminsRunNowScriptCollection.json", {agentGuid: agentGuid}, function(data) {
                    $("#adminRunNowCollection").empty();
                    $.each(data["Data"], function(index) {
                        var script = data["Data"][index];
                        $("#adminRunNowCollection").append(
                            getExecuteProcTableRow(script.ScriptId, script.ScriptName, script.ScriptHasPrompts)
                        );
                    });
                    bindClickEvents();
                });
                break;

            case "audit-hardware": // hardware local nav click...
            case "audit-hardware-disk-volumes":
                getData("/json/getdisklist.json", {agentGuid: agentGuid}, function(data) {
                    $("#audit-hardware-disk-volumesData").empty();
                    $.each(data["Data"], function (index) {
                        var drive = data["Data"][index];
                        $("#audit-hardware-disk-volumesData").append(
                            '<tr>'+
                            '	<td>'+drive.DriveLetter+'</td>'+
                            '	<td>'+drive.Type+'</td>'+
                            '	<td>'+drive.FormatType+'</td>'+
                            '	<td>'+drive.FreeBytesLabel+' </td>'+
                            '	<td>'+drive.UsedBytesLabel+'</td>'+
                            '	<td class="pieChart">'+getDiskGraphicalRepresentation(drive.FreeMBytes, drive.UsedMBytes)+'</td>'+
                            '	<td>'+drive.TotalBytesLabel+'</td>'+
                            '	<td>'+drive.VolumeName+'</td>'+
                            '</tr>');
                    });

                    // let sparkline do its thing
                    if (data.Total > 0) {
                        $(".sparklines").sparkline('html', {
                            enableTagOptions: true,
                            width: '25px',
                            height: '25px',
                            sliceColors: ['blue','green']
                        });
                    }
                });
                break;

            case "audit-hardware-disk-partitions":
                getData("/json/getdiskPartitionlist.json", {agentGuid: agentGuid}, function(data) {
                    $("#audit-hardware-disk-partitionsData").empty();
                    $.each(data["Data"], function (index) {
                        var drivePartition = data["Data"][index];
                        $("#audit-hardware-disk-partitionsData").append(
                            '<tr>'+
                            '	<td>'+drivePartition.PartitionName+'</td>'+
                            '	<td>'+drivePartition.DiskIndex+'</td>'+
                            '	<td>'+drivePartition.Type+'</td>'+
                            '	<td>'+$.number(drivePartition.Size)+'</td>'+
                            '	<td>'+drivePartition.FragmentationLevel+'%</td>'+
                            '	<td>'+getCheckMark(drivePartition.IsPrimaryPartition)+'</td>'+
                            '	<td>'+getCheckMark(drivePartition.IsBootable)+'</td>'+
                            '	<td>'+getCheckMark(drivePartition.IsActiveBootPartition)+'</td>'+
                            //'	<td>'+drivePartition.Health+'</td>'+
                            '</tr>');
                    });
                });
                break;

            case "audit-hardware-disk-shares":
                getData("/json/getSharelist.json", {agentGuid: agentGuid}, function(data) {
                    $("#audit-hardware-disk-sharesData").empty();
                    $.each(data["Data"], function (index) {
                        var share = data["Data"][index];
                        $("#audit-hardware-disk-sharesData").append(
                            '<tr>'+
                            '	<td>'+share.ShareName+'</td>'+
                            '	<td>'+share.Path+'</td>'+
                            '	<td>'+share.Type+'</td>'+
                            '	<td>'+share.Description+'</td>'+
                            '</tr>');
                    });
                });
                break;

            case "audit-hardware-pci-and-disk-hardware":
                getData("/json/getPciAndDiskHardwareData.json", { agentGuid: agentGuid }, function (data) {
                    $("#audit-hardware-pci-and-disk-hardwareData").empty();
                    $.each(data["Data"], function (index) {
                        var pciAndDiskHardware = data["Data"][index];
                        $("#audit-hardware-pci-and-disk-hardwareData").append(
                            '<tr>' +
                            '	<td>' + pciAndDiskHardware.ProductClass + '</td>' +
                            '	<td>' + pciAndDiskHardware.VendorName + '</td>' +
                            '	<td>' + pciAndDiskHardware.ProductName + '</td>' +
                            '</tr>');
                    });
                });
                break;

            case "audit-hardware-printers":
                getData("/json/GetPrintersData.json", { agentGuid: agentGuid }, function (data) {
                    $("#audit-hardware-printersData").empty();
                    $.each(data["Data"], function (index) {
                        var printer = data["Data"][index];
                        $("#audit-hardware-printersData").append(
                            '<tr>' +
                            '	<td>' + printer.PrinterName + '</td>' +
                            '	<td>' + printer.PortName + '</td>' +
                            '	<td>' + printer.Model + '</td>' +
                            '</tr>');
                    });
                });
                break;

            case "audit-software":
            case "audit-software-licenses":
                getData("/json/GetSoftwareLicenseData.json", { agentGuid: agentGuid }, function (data) {
                    $("#audit-software-licensesData").empty();
                    $.each(data["Data"], function(index) {
                        var licenseInfo = data["Data"][index];
                        $("#audit-software-licensesData").append(
                            String.format(
                                "<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td><time>{5}</time></td></tr>",
                                licenseInfo.Publisher, licenseInfo.ProductName, licenseInfo.LicenseCode,
                                licenseInfo.ProductKey, licenseInfo.Version, licenseInfo.InstallDate)
                        );
                    });
                });
                break;

            case "audit-software-addremove":
                getData("/json/GetAddRemovePrograms.json", { agentGuid: agentGuid }, function (data) {
                    $("#audit-software-addremoveData").empty();
                    $.each(data["Data"], function (index) {
                        var program = data["Data"][index];
                        $("#audit-software-addremoveData").append(
                            String.format(
                                "<tr><td>{0}</td><td class='hidden'>{1}</td></tr>",
                                program.DisplayName, program.UninstallStr)
                        );
                    });
                });
                break;

            case "audit-software-startup-applications":
                getData("/json/GetStartupApps.json", { agentGuid: agentGuid }, function (data) {
                    $("#audit-software-startup-applicationsData").empty();
                    $.each(data["Data"], function (index) {
                        var startupApp = data["Data"][index];
                        $("#audit-software-startup-applicationsData").append(
                            String.format(
                                "<tr><td class='hidden'>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td></tr>",
                                startupApp.id, startupApp.AppName, startupApp.AppCommand, startupApp.UserName)
                        );
                    });
                });
                break;

            case "audit-users-and-groups":
            case "audit-users-and-groups-user-accounts":
                getData("/json/GetUserAccounts.json", { agentGuid: agentGuid }, function (data) {
                    $("#audit-users-and-groups-user-accountsData").empty();
                    $.each(data["Data"], function (index) {
                        var user = data["Data"][index];
                        $("#audit-users-and-groups-user-accountsData").append(
                            String.format(
                                "<tr><td class='hidden'>{0}</td>" +
                                    "<td>{1}</td><td>{2}</td><td>{3}</td>" +
                                    "<td>{4}</td><td>{5}</td><td class='hidden'>{6}</td>" +
                                    "<td>{7}</td><td>{8}</td><td class='hidden'>{9}</td></tr>",
                                user.Id,
                                user.LogonName, user.FullName, user.Description,
                                getCheckMark(!user.IsDisabled), getCheckMark(user.IsLockedOut), getCheckMark(user.IsPasswordRequired),
                                getCheckMark(user.IsPasswordExpired), getCheckMark(user.IsPasswordChangeable), user.HomeDir)
                        );
                    });
                });
                break;

            case "audit-users-and-groups-groups":
                getData("/json/GetGroups.json", { agentGuid: agentGuid }, function (data) {
                    $("#audit-users-and-groups-groupsData").empty();
                    $.each(data["Data"], function (index) {
                        var group = data["Data"][index];
                        $("#audit-users-and-groups-groupsData").append(
                            String.format(
                                "<tr><td>{0}</td><td>{1}</td></tr>",
                                group.UserGroupName, group.Description)
                        );
                    });
                });
                break;

            case "audit-users-and-groups-members":
                getData("/json/GetGroupUsers.json", { agentGuid: agentGuid }, function (data) {
                    $("#audit-users-and-groups-membersData").empty();
                    $.each(data["Data"], function (index) {
                        var group = data["Data"][index];
                        $("#audit-users-and-groups-membersData").append(
                            String.format(
                                "<tr><td>{0}</td><td>{1}</td></tr>",
                                group.UserGroupName, group.LogonName)
                        );
                    });
                });
                break;

            case "tools-agent-checkin":
                getData("/json/getagentcheckincontrol.json", {agentGuid: agentGuid}, function (data) {
                    var agentData = data.Data;

                    //$("#agent-checkin-bandwidththrottle").val(agentData.BandwidthThrottle);
                    $("#agent-checkin-primarykserver").val(agentData.PrimaryKserver);
                    $("#agent-checkin-primaryport").val(agentData.PrimaryPort);
                    $("#agent-checkin-secondarykserver").val(agentData.SecondaryKserver);
                    $("#agent-checkin-secondaryport").val(agentData.SecondaryPort);
                    $("#agent-checkin-period").val(agentData.CheckinPeriod);
                    //$("#agent-checkin-chkbindtokserver").selected(agentData.BindToKserver);

                });
                break;

            case "tools-agent-workingdir":
                getData("/json/getagentworkingdirectory.json", {agentGuid: agentGuid}, function (data) {
                    $("#agent-workingdir").val(data.WorkingDir);
                });
                break;

            case "tools-agent-suspend":
                getData("/json/getagentsuspendstatus.json", {agentGuid: agentGuid}, function (record) {
                    var data = record.Data;
                    if (data != null && data.StatusLabel.length > 0) {
                        $("#agent-suspend-status").text(data.StatusLabel);
                    }

                });
                break;

            case "tools-agent-credential":
                //no ajax call needed this is strictly a post of new values
                break;

            case "tools-admin-notes":
                $("#adminnote-datepicker").datepicker();
                $("#adminnote-timepicker").timepicker();

                loadAgentAdminNotes(0);

                $('.local-body').scroll(function () {
                    if (this.scrollTop >= this.scrollTopMax) {
                        //if the user scrolling is slow make sure you don't page again before new data is loaded
                        if (!g_loadingAgentNotesData) {
                            loadAgentAdminNotes(g_agentAdminNotesPage++);
                        }
                    }
                });
                break;

            case "tools-reset-password":
                break;

            case "tools-wake-machine":
                $('.wake-machine').click(function() {
                    if(!$(this).hasClass('animated')) {
                        $(this).removeClass('primary').addClass('disabled animated').html('<i class="icon-loop-2"></i> Processing...');
                        return false;
                    } else {
                        $(this).removeClass('disabled animated').addClass('primary').html('<i class="icon-switch"></i> Wake Machine');
                        return false;
                    }
                });
                break;

            case "tools-record-desktop":
                $('.record-desktop').click(function() {
                    if(!$(this).hasClass('animated')) {
                        $(this).removeClass('primary').addClass('danger animated').html('<i class="icon-loop-2"></i> Stop Recording');
                        return false;
                    } else {
                        $(this).removeClass('danger animated').addClass('primary').html('<i class="icon-play-2"></i> Record Desktop');
                        return false;
                    }
                });
                break;

            default:
                throw ("Unhandled LOCAL_NAV_CHANGED event [" + event.qvEventTarget + "]");
            }
        });

        $(document).on(QV_EVENTS.TAB_CHANGED, function(event) {
            switch (event.qvEventTarget) {
            case QV_TABS.DASHBOARD:
                break;

            case QV_TABS.TICKETS:
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "ticketlog");
                break;

            case QV_TABS.ALARMS:
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "alarmlog");
                break;

            case QV_TABS.PROCEDURES:
                // simulate a click on the execute local nav such that execute procs are displayed by default
                // need to refactor this such that it selects the first sub-nav instead of having to know the sub-nav name
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "execute");
                sortableActionTables();
                break;

            case QV_TABS.AUDIT:
            case QV_TABS.AUDIT_HARDWARE_DISK_VOLUMES:
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "audit-hardware-disk-volumes");
                break;

            case QV_TABS.AUDIT_HARDWARE_DISK_PARTITIONS:
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "audit-hardware-disk-partitions");
                break;

            case QV_TABS.AUDIT_HARDWARE_DISK_SHARES:
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "audit-hardware-disk-shares");
                break;

            case QV_TABS.AUDIT_HARDWARE_PCI_AND_DISK_HARDWARE:
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "audit-hardware-pci-and-disk-hardware");
                break;

            case QV_TABS.AUDIT_HARDWARE_PRINTERS:
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "audit-hardware-printers");
                break;

            case QV_TABS.AUDIT_SOFTWARE:
            case QV_TABS.AUDIT_SOFTWARE_LICENSES:
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "audit-software-licenses");
                break;

            case QV_TABS.AUDIT_SOFTWARE_ADD_REMOVE:
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "audit-software-addremove");
                break;

            case QV_TABS.AUDIT_USERS_AND_GROUPS:
            case QV_TABS.AUDIT_USERS_AND_GROUPS_USER_ACCOUNTS:
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "audit-users-and-groups-user-accounts");
                break;

            case QV_TABS.AUDIT_USERS_AND_GROUPS_GROUPS:
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "audit-users-and-groups-groups");
                break;

            case QV_TABS.AUDIT_USERS_AND_GROUPS_MEMBERS:
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "audit-users-and-groups-members");
                break;

            case QV_TABS.AUDIT_SOFTWARE_STARTUP_APPLICATIONS:
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "audit-software-startup-applications");
                break;

            case QV_TABS.TOOLS:
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "tools-agent-checkin");
                break;

            case QV_TABS.AUDIT_LOGS:
            case QV_TABS.AUDIT_LOGS_AGENT:
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "audit-logs-agent");
                break;

            case QV_TABS.AUDIT_LOGS_CONFIGURATION:
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "audit-logs-configuration");
                break;

            case QV_TABS.AUDIT_LOGS_MONITOR_ACTION:
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "audit-logs-monitor-action");
                break;

            case QV_TABS.AUDIT_LOGS_REMOTE_CONTROL:
                triggerEvent(QV_EVENTS.LOCAL_NAV_CHANGED, "audit-logs-remote-control");
                break;

            case QV_TABS.PREF_QUICKLAUNCH:
                // noop, quick launch prefs are loaded automatically
                break;

            case QV_TABS.PREF_DASHBOARD:
                // noop, dashboard prefs are loaded automatically
                break;

            case QV_TABS.PREF_GENERAL:
                // noop for now
                break;

            default:
                throw ("Unhandled TAB_CHANGED event [" + event.qvEventTarget + "]");
            }
        });

        $(document).on(QV_EVENTS.DATA_CHANGED, function(event) {
            switch (event.qvEventTarget) {
                case "agentDashActions":
                    var newAgentDashActionItems = event.newAgentDashActionItems;
                    $.ajax({
                        url: '/vsapres/quickview/main/UpdateQuickLaunchButtonsOrder',
                        data: { newAgentDashActionsOrder: event.newAgentDashActionsOrder.join(",") },
                        type: 'POST',
                        cache: false
                    }).done(function(data) {
                        if (data.Success) {
                            // update the green button text, this should fire an event to reload all the quick launch options
                            var btnDetails = newAgentDashActionItems[0];
                            var newBtnLabel = btnDetails.Label;
                            var qlBtn = $('.quicklaunch.menu-item.div span');
                            if (qlBtn.text() != newBtnLabel) {
                                qlBtn.text(newBtnLabel);
                                $(qlBtn.siblings()[0]).attr('class', 'icon-'+btnDetails.Label.replace(/\s*/g, ''));
                            }

                            // reload the options -- this should fire an event with the newAgentDashItems
                            buttonOptions = buildQuickLaunchActionUnorderedListItems(newAgentDashActionItems);
                            quickLaunchPreferences = buildQuickLaunchPreferences(newAgentDashActionItems);
                            $("#quickLaunchItems-pref").html(quickLaunchPreferences);
                            //$(".popover #quickLaunchItems-pref").sortable( "refreshPositions" );
                        } else {
                            // throw an error???
                        }
                    });
                    break;
                case "machineInfo":
                    $.ajax({
                        url: '/vsapres/quickview/main/updatemachauditorder',
                        data: {
                            adminId: event.adminId,
                            startIndex: event.startIndex,
                            endIndex: event.endIndex
                        },
                        type: 'POST',
                        cache: false
                    }).done(function(data) {
                        if (data.Success) {
                            //console.log('complete');
                        } else {
                            // throw an error???
                        }
                    });

                    // TODO: this should be an event too or just loadQuickLaunchButton load event
                    machineInfoDirty = true;
                    break;

                case "adminRunNowScripts":
                    var newAdminRunNowScriptOrder = event.newAdminRunNowScriptOrder;
                    $.ajax({
                        url: '/json/UpdateAdminsRunNowScripts.json',
                        data: { newAdminRunNowScriptOrder: newAdminRunNowScriptOrder },
                        type: 'POST',
                        cache: false
                    }).done(function(data) {
                        if (data.Success) {
                            //console.log('complete')
                        } else {
                            // throw an error???
                        }
                    });

                    break;

                default:
                    throw String.format("unhandled QV_EVENTS.DATA_CHANGED[{0}]", event.qvEventTarget);
            }
        });

        // title bar icon click events
        // toggle 'pin window' icon
        $('a.pin-window').click(function() {
            $(this).toggleClass('active');
            window.top.setDashPinned($(this).hasClass('active'));
        });

        $('#popNewWindow').click(function() {
            //pop win
            window.open('/vsapres/quickview/main/quickview?agentGuid=' + agentGuid + '&full-screen=1&' + Math.random(), 'agentDash' + agentGuid);
        });

        $('#closeQuickView').click(function(event) {
            if (window.top.location.href != window.location.href) {
                window.top.setDashPinned(false);
                window.top.hideAgentDash();
            } else {
                window.close();
            }
            event.preventDefault();
        });

        // create preferences popover
        $('.menu-item.preferences').click(function(event) {
            if (popoverTarget != this) {
                createPopover('popover-preferences', this, 'right', 'top', 'right', 'bottom', $('.preferences-form').html());
                event.stopPropagation();
                $(this).addClass('active');

                // preference popover tabs
                tabBehavior($('.popover-preferences .tabs'));

                $(".popover #quickLaunchItems-pref").sortable({
                    axis: 'y',
                    placeholder: 'sortable-placeholder',
                    handle: '.group-control-reorder',
                    revert: 100,
                    start: function(e, ui) {
                        $(this).css('pointer-events', 'none');
                        startIndex = ui.item.index();
                    },
                    update: function(e, ui) {
                        $(this).css('pointer-events', 'auto');
                        // highlight dropped element
                        $(ui.item).css('background-color', '#ffffcb').animate({ 'background-color': '#ffffff' }, 500);

                        if (startIndex > -1) {
                            // TODO: remove duplicate logic
                            fireAgentDashActionChangeEvent($(e.target));
                        }
                    }
                });
            }
        });

        // toolbox update section
        //*************************************************************
        $('#update-workingdir').click(function() {
            var workingDir = $('#agent-workingDir').val();
            $.ajax({
                url: '/vsapres/quickview/main/updateagentworkingdir',
                data: {
                    agentGuid: agentGuid,
                    workingDir: workingDir
                },
                type: 'POST',
                success: function() {
                    $('#update-message').val("Working directory saved successfully!");
                },
                error: function(request, status, error) {
                    $('#update-message').val("Error saving changes, " + error);
                }
            });
        });

        $('#update-checkin').click(function() {
            $.ajax({
                url: '/vsapres/quickview/main/updateagentcheckincontrol',
                data: { agentGuid: agentGuid },
                type: 'POST',
                cache: false
            }).done(function(data) {
                //console.log('complete');
            });
        });
    });
};

var triggerEvent = function(type, target) {
    $.event.trigger({ type: type,qvEventTarget: target });
};

var fireAgentDashActionChangeEvent = function(targetElement) {
    var newAgentDashActionsOrder = [];
    var newAgentDashActionItems = [];
    var currentAgentDashActions = targetElement.children();
    var actionsLength = currentAgentDashActions.length;
    var selectorTagName = ($(targetElement)[0].id == "agentDashActions" ? 'a' : 'input');

    for (var i = 0; i < actionsLength; i++) {
        var agentDashAction = JSON.parse($(currentAgentDashActions[i]).find(selectorTagName).attr('qlBtnDetails'));
        newAgentDashActionItems.push(agentDashAction);
        newAgentDashActionsOrder.push(agentDashAction.ItemNumber + "-1"); // the 1 is the enabled flag... TODO allow for disabling
    }

    $.event.trigger({
        type: QV_EVENTS.DATA_CHANGED,
        qvEventTarget: 'agentDashActions',
        newAgentDashActionsOrder: newAgentDashActionsOrder,
        newAgentDashActionItems: newAgentDashActionItems
    });
};

var alertCloseButton = function() {
    $('.alert .close').click(function() {
        removePopovers();
        popoverTarget = undefined;
    });
};

var getData = function(url, params, callback) {
    // default to cached results, if you don't want cached data use getData2
    getData2(url, params, 'json', true, callback);
};

var getData2 = function(url, params, dataType, cache, doneCallback) {
    $.ajax({
        'url': url,
        'data': params,
        'dataType': dataType,
        'cache': cache
    }).done(doneCallback);
};

var getIsBigWindow = function () {
    return ($(window).width() > 1200);
};

var getCheckMark = function(val) {
    return (val ? '<i class="icon-checkmark-circle">' : '');
};
var getRemoteControlTimeSpan = function (startTime, endTime) {
    // only display the time
    var start = startTime.split(' ')[1];
    var end = endTime.split(' ')[1];
    return String.format('@~Start~@: {0} @~End~@: {1}', start, end);
};

var getRemoteControlDescription = function(rcEvent) {
    var desc = '&nbsp;';
    if (rcEvent.Description != null && rcEvent.Description.length > 0) {
        desc = rcEvent.Description;
    } else if (rcEvent.Duration > 0) {
        desc = getRemoteControlTimeSpan(rcEvent.StartTime, rcEvent.EventTime);
        var imageOrText = '';
        switch (rcEvent.Type) {
        case 101:
            imageOrText = "FTP";
            break;
        case 201:
        default:
            imageOrText = "<img src='/images/vncIcon.gif'>";
            break;
        case 202:
            imageOrText = "<img src='/images/radminIcon.gif'> ";
            break;
        case 203:
            imageOrText = "<img src='/images/mstscIcon.gif'>";
            break;
        case 204:
            imageOrText = "<img src='/images/pcanywhereIcon.gif'>";
            break;
        case 205:
            imageOrText = "<img src='/images/kVncIcon.gif'>";
            break;
        case 206:
            imageOrText = "<img src='/images/krcIcon.gif'>";
            break;
        }
        desc = String.format("{0} {1}", imageOrText, desc);
    }

    return desc;
};

var getDiskGraphicalRepresentation = function(free, used) {
    var retVal = '';
    if (free >= 0 && used > 0) {
        retVal = '<span class="sparklines" sparkType="pie">' + used + ',' + free + '</span>';
    }
    return retVal;
};

var loadAgentAdminNotes = function(page) {
    getData("/json/getAgentAdminNotes.json",
    {
        agentGuid: agentGuid,
        page: g_agentAdminNotesPage,
        pageSize: 100
    },
    function(data) {
        if (g_agentAdminNotesPage == 0) {
            $("#tools-admin-notesData").empty();
            $(".local-body").scrollTop(0);
        }

        $.each(data["Data"], function(index) {
            var note = data["Data"][index];
            $("#tools-admin-notesData").append(
                String.format('<tr><td><time>{0}</time></td><td>{1}</td></tr>', note.Time, note.Note)
            );
        });
    });
};

var pollAgentOnlineStatus = function() {
    getData('/json/getagentonlinestatus.json', { agentGuid: agentGuid }, function(data) {
        try {
            agentOnline = (data.Online == 1 || data.Online == 2);
        } catch(e) {
            // ignore this error
        } finally {
            setTimeout(pollAgentOnlineStatus, 15000);
        }
    });
};

var loadAgentOnlineStatus = function () {
    getData('/json/getagentonlinestatus.json', { agentGuid: agentGuid }, function (data) {
        try {
            $("#agent-online-status").attr("title", data.OnLineStatus).tipper({
                direction: 'right'
            });
            $("#agent-icon").attr("src", data.IconSrc);
            if (data.BadgeId >= 2) {
                //$("#agent-badge").attr("src", "/images/badges/" + data.BadgeId + ".gif");
                adminMessage = data.ContactNotes.length == 0
                    ? "@~This machine has been flagged but no special instructions have been entered.~@"
                    : data.ContactNotes.replace(/(\r\n|\n|\r|&nbsp;)/gm, "<br/>");
                $('#agent-online-status').click(function (event) {
                    createPopover('alert alert-warning', this, 'left', 'top', 'left', 'bottom', adminMessage);
                    event.stopPropagation();
                    alertCloseButton();
                });
                $('#agent-online-status').trigger("click");
            }
        } catch(e) {
            // eat this
        }
    });
};

var loadMachineInfo = function() {
    // load machine audit data and popover
    //*************************************************************
    getData('/json/getmachineinfo.json', { agentGuid: agentGuid, columns: '' }, function(data) {
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
                var auditMarkup =
                    '<li>'+
                        '<span class="label">' + label + '</span>'+
                        '<span class="value" title="' + value + '">' + value + '</span>'+
                        '<span class="popover-controls">'+
                            '<a class="popover-control-reorder" title="@~Drag to reorder~@">'+
                                '<i class="icon-menu"></i>'+
                            '</a>'+
                        '</span>'+
                    '</li>';

                newItem += auditMarkup;
            } else {
                if (this.Label == "req_displayName") {
                    document.title = 'QV ' + this.Value;

                    var dispName = this.Value;
                    // will handle trimming strings with css
                    $('#machineName').html(dispName).attr("title", this.Value);
                    $('#machineName').tipper({
                        direction: 'right'
                    });
                }
            }
        });

        newItem = '<ul id="machineInfo" class="action-list">' + newItem + '</ul>';

        // inject list into container
        machineAuditContainer.prepend(newItem);
        machineInfoDirty = false;

        // audit overflow arrow popover
        $('.popover-arrow').unbind().click(function(event) {
            createPopover('popover-machine-audit', this, 'right', 'top', 'right', 'bottom', newItem, true);
            event.stopPropagation();
        });
    });
};

var launchLiveConnect = function (agentGuid, forceLimited, module) {
    if ('OpenLiveConnectWindow' in window.top) {
        window.top.OpenLiveConnectWindow(agentGuid, forceLimited, module);
        return;
    } else {
        // try window.opener
        if ('opener' in window.top) {
            if ('top' in window.top.opener) {
                if ('OpenLiveConnectWindow' in window.top.opener.top) {
                    window.top.opener.top.OpenLiveConnectWindow(agentGuid, forceLimited, module);
                    return;
                }
            }
        }
        // you made it this far so try something else
        // out of luck... TODO: could try to load showIcon.js and set a timer
        // might want to move this into quickview.cshtml so it is already available
        $.body.append('<script type="text/javascript" src="/inc/showIcon.js"></script>');
        setTimeout(waitForShowIcon, 300);
    }
};

var waitForShowIcon = function(agentGuid, forceLimited, module) {
    window.top.OpenLiveConnectWindow(agentGuid, forceLimited, module);
};

var loadQuickLaunchButtonOptions = function() {
    // load quick launch button data and popover
    //*************************************************************
    getData('/json/GetQuickLaunchButtons.json', {}, function(data) {
        // rename quick launch to the first item in the returned data
        var quickLaunchLabel = $('.quicklaunch a span');
        quickLaunchLabel.text(data[0].LabelLstr);
        quickLaunchLabel.before('<i class="icon-' + data[0].Label.replace(/\s*/g, '') + '"></i>');

        // next the button options
        buttonOptions = buildQuickLaunchActionUnorderedListItems(data);

        $('.quicklaunch a').mouseenter(function(event) { // hover start
            createPopover('popover-quick-launch', $(this), 'left', 'top', 'left', 'top', buttonOptions, true);
            $(".qlButton").click(function(e) {
                var btnDetails = JSON.parse($(e.target).attr('qlBtnDetails'));
                var module = btnDetails.Label.replace(/\s*/g, '');
                launchLiveConnect(agentGuid, false, module);
                e.preventDefault();
                e.stopPropagation();
            }).find('.popover-controls').click(function(e) {
                return false;
            });
        });

        // preferences
        quickLaunchPreferences = buildQuickLaunchPreferences(data);
        $("#quickLaunchItems-pref").html(quickLaunchPreferences);
    });
};

var buildQuickLaunchActionUnorderedListItems = function(data) {
    var listItems = '';
    $.each(data, function(item) {
        listItems +=
            "<li>"+
                "<a class='qlButton' qlBtnDetails='" + JSON.stringify(data[item]) + "' title='" + data[item].LabelLstr + "'>" +
                    "<i class='icon-"+data[item].Label.replace(/\s*/g, '')+"'></i>"+
                    data[item].LabelLstr +
                    "<span class='popover-controls'>"+
                        "<span class='popover-control-reorder' title='@~Drag to reorder~@'>" +
                            "<i class='icon-menu'></i>"+
                        "</span>"+
                    "</span>"+
                "</a>"+
            "</li>";
    });
    return '<ul id="agentDashActions" class="action-list">' + listItems + '</ul>';
};

var buildQuickLaunchPreferences = function(data) {
    var listItems = '';
    $.each(data, function(item) {
        listItems +=
            "<li>" +
                "<label class='checkbox'>" +
                    "<input type='checkbox' qlBtnDetails='" + JSON.stringify(data[item]) + "' " +
                        "checked='"+(data[item].Enabled ? "checked" : "") + "' /> " +
                    data[item].LabelLstr +
                "</label>" +
                "<span class='group-controls'>" +
                    "<a class='group-control-reorder' title='@~Drag to reorder~@'>" +
                        "<i class='icon-menu'></i>" +
                    "</a>" +
                "</span>" +
            "</li>";
    });
    return listItems;
};

var buildMenuBar = function() {
    $(".menu-bar").append(
        '<div class="quicklaunch menu-item div">'+
            '<a class="btn primary"><span>&nbsp;</span> <i class="icon-menu-2"></i></a>'+
        '</div>'+
        '<a id="agent-online-status" class="machine-status menu-item" title="@~User online and active~@">'+
            //'<img id="agent-icon" src="/vsaPres/App_Themes/0/images/SIZE16/General/stop_offline.gif" alt="" />'+
            //'<img id="agent-badge" src="/images/badges/0.gif" class="icon" alt=""/>'+
        '</a>'+
        '<div class="machine-name" id="machineName"></div>'+
        '<div class="window-controls">'+
            '<!--<span class="menu-item search div"><input type="search" placeholder="Search" /></span>-->'+
            '<a class="menu-item pin-window div" title="@~Pin window~@"><i class="icon-pushpin"></i></a>'+
            '<a class="menu-item new-window div" title="@~Open in new window~@" id="popNewWindow"><i class="icon-new-tab"></i></a>'+
            '<a class="menu-item preferences div" title="@~Window preferences~@"><i class="icon-cog"></i></a>'+
            '<a class="menu-item close-window" title="@~Close window~@" id="closeQuickView"><i class="icon-close"></i></a>'+
        '</div>'
    );
};

var buildTabs = function() {
    var tabs = {
        "Dashboard": "@~Dashboard~@",
        "Tickets": "@~Tickets~@",
        "Alarms": "@~Alarms~@",
        "Procedures": "@~Procedures~@",
        "Audit": "@~Audit~@",
        "Tools": "@~Tools~@"
    };
    for (var tabName in tabs) {
        var tabLstr = tabs[tabName];
        var active = tabName == 'Dashboard' ? 'active' : '';
        $('.section-tabs ul').append(
            String.format(
                '<li class="{0}">'+
                    '<a title="{1}">'+
                        '<i class="icon-{2}"></i>'+
                        '<span>{1}</span>'+
                    '</a>'+
                '</li>', active, tabLstr, tabName.toLowerCase()));
    }
};

var buildLocalNavItem = function(item, localItem) {
    return String.format('<li class="{0}"><a>{1}</a></li>',
        item + (localItem.active ? ' active' : ''), localItem.title);
};

var buildLocalBodyTabGroup = function(tabs) {
    // add the tab strip
    var tabGroup = '<div class="tabs"><ul class="horizontal">';

    for (var index in tabs) {
        var tab = tabs[index];
        tabGroup += String.format('<li class="{0}"><a class="btn btn-group {1}small">{2}</a></li>',
            index + (tab.active ? ' active' : ''), ('additionalClass' in tab ? tab.additionalClass + ' ' : ''), tab.title);
    }

    tabGroup += '</ul><hr></div>'; // close tabs

    // and coresponding tab bodies
    tabGroup += '<div class="tab-content">';
    for (var i in tabs) {
        var localItem = tabs[i];
        tabGroup += String.format('<div class="{0} container {1}"><table><thead><tr>', i, (localItem.active ? ' active' : ''));
        for (var j in localItem.columns) {
            tabGroup += String.format('<th>{0}</th>', localItem.columns[j]);
        }
        tabGroup += String.format('</tr></thead><tbody id="{0}"></tbody></table></div>', i + 'Data');
    }
    tabGroup += '</div>'; // close tab-content
    return tabGroup;
};

var buildLocalBody = function(name, localItem) {
    var localBody = String.format('<div class="{0}">',
        name + (localItem.active ? ' active' : ''));

    if (localItem.columns.length == 0) {
        // is there a markup function
        if (typeof localItem.markup == "function") {
            localBody += localItem.markup.call();
        } else if (typeof localItem["tabs"] == "object") {
            localBody += buildLocalBodyTabGroup(localItem.tabs);
        } else {
            // someone else will fill in the header
            localBody += String.format('<table><thead id="{0}Header"></thead><tbody id="{1}"></tbody></table>',
                name, name + 'Data');
        }
    } else {
        localBody += '<table><thead><tr>';
        for (var index in localItem.columns) {
            localBody += String.format('<th>{0}</th>', localItem.columns[index]);
        }
        localBody += String.format('</tr></thead><tbody id="{0}"></tbody></table>', name + 'Data');
    }

    return localBody + '</div>';
};

var buildTabSkeletons = function() {
    for (var tab in tabMarkupConfig) {
        var localNavItems = '';
        var localBodies = '';

        for (var item in tabMarkupConfig[tab].localItems) {
            var localItem = tabMarkupConfig[tab].localItems[item];
            localNavItems += buildLocalNavItem(item, localItem);
            localBodies += buildLocalBody(item, localItem);
        }

        var cssSelector = String.format(".{0}", tab);
        $(cssSelector).append(String.format('<div class="local-nav-items"><ul>{0}</ul></div>', localNavItems));
        $(cssSelector).append(String.format('<div class="local-body">{0}</div>', localBodies));
    }
};

var buildPrefSkeleton = function() {
    $(".preferences-form").append('<div class="form">' +
        '<div class="tabs">' +
            '<ul class="horizontal">' +
                '<li class="active"><a class="btn btn-group first small">@~QuickLaunch~@</a></li>' +
                '<li><a class="btn btn-group small group">@~Dashboard~@</a></li>' +
                '<li><a class="btn btn-group last small">@~General~@</a></li>' +
            '</ul>' +
        '</div>' +
        '<div class="tab-content">' +
            '<div class="pref-quicklaunch container active">' +
                '<div class="control-group">' +
                    '<label>@~QuickLaunch Items~@</label>' +
                    '<ul class="group-stacked ui-sortable" id="quickLaunchItems-pref"></ul>' +
                '</div>' +
            '</div>' +
            '<div class="pref-dashboard container">' +
                '<div class="control-group">' +
                    '<label>@~Dashboard Items~@</label>' +
                    '<ul class="group-stacked ui-sortable">' +
                        '<li><label class="checkbox"><input type="checkbox"> @~Screenshot~@</label><span class="group-controls"><a class="group-control-reorder" title="@~Drag to reorder~@"><i class="icon-menu"></i></a></span></li>' +
                        '<li><label class="checkbox"><input type="checkbox"> @~Missing Patches~@</label><span class="group-controls"><a class="group-control-reorder" title="@~Drag to reorder~@"><i class="icon-menu"></i></a></span></li>' +
                        '<li><label class="checkbox"><input type="checkbox"> @~Hard Drives~@</label><span class="group-controls"><a class="group-control-reorder" title="@~Drag to reorder~@"><i class="icon-menu"></i></a></span></li>' +
                        '<li><label class="checkbox"><input type="checkbox"> @~Memory~@</label><span class="group-controls"><a class="group-control-reorder" title="@~Drag to reorder~@"><i class="icon-menu"></i></a></span></li>' +
                        '<li><label class="checkbox"><input type="checkbox"> @~Policy Compliance~@</label><span class="group-controls"><a class="group-control-reorder" title="@~Drag to reorder~@"><i class="icon-menu"></i></a></span></li>' +
                        '<li><label class="checkbox"><input type="checkbox"> @~Check-in Status~@</label><span class="group-controls"><a class="group-control-reorder" title="@~Drag to reorder~@"><i class="icon-menu"></i></a></span></li>' +
                        '<li><label class="checkbox"><input type="checkbox"> @~Open Tickets~@</label><span class="group-controls"><a class="group-control-reorder" title="@~Drag to reorder~@"><i class="icon-menu"></i></a></span></li>' +
                        '<li><label class="checkbox"><input type="checkbox"> @~Open Alarms~@</label><span class="group-controls"><a class="group-control-reorder" title="@~Drag to reorder~@"><i class="icon-menu"></i></a></span></li>' +
                        '<li><label class="checkbox"><input type="checkbox"> @~Open Service Desk Tickets~@</label><span class="group-controls"><a class="group-control-reorder" title="@~Drag to reorder~@"><i class="icon-menu"></i></a></span></li>' +
                    '</ul>' +
                '</div>' +
            '</div>' +
            '<div class="pref-general container">' +
                '<div class="control-group">' +
                    '<label>@~Defaults~@</label>' +
                    '<div class="button-group-stacked">' +
                        '<a class="btn" id="pref_ResetToPlanDefault">@~Reset to plan default~@</a>' +
                        '<a class="btn" id="pref_ResetToFactoryDefault">@~Reset to factory default~@</a>' +
                        '<a class="btn" id="pref_SetAsSystemDefault">@~Set as system default~@</a>' +
                        '<a class="btn" id="pref_ForceAllUsersToSystemDefault">@~Force all users to system default~@</a>' +
                    '</div>' +
                '</div>' +
                '<div class="control-group">' +
                    '<label class="control-label">@~QuickView Theme~@</label>' +
                    '<div class="controls">' +
                        '<label class="checkbox"><input type="checkbox"> @~Use previous theme~@</label>' +
                    '</div>' +
                '</div>' +
                '<div class="control-group">' +
                    '<label class="control-label">@~Hover Delay~@</label>' +
                    '<div class="controls">' +
                        '<input type="text" value="500" size="3"> @~ms~@<br>' +
                        '<div class="description">@~Delay before displaying detail information when hovering over agent/asset icons~@</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>');
};