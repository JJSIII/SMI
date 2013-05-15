var QV_TABS = {
    'DASHBOARD': 'Dashboard',
    'TICKETS': 'Tickets',
    'ALARMS': 'Alarms',
    'PROCEDURES': 'Procedures',
    'AUDIT': 'Audit',
    'AUDIT_HARDWARE': 'audit-hardware',
    'AUDIT_HARDWARE_DISK_VOLUMES': 'audit-hardware-disk-volumes container',
    'AUDIT_HARDWARE_DISK_PARTITIONS': 'audit-hardware-disk-partitions container',
    'AUDIT_HARDWARE_DISK_SHARES': 'audit-hardware-disk-shares container',
    'AUDIT_HARDWARE_PCI_AND_DISK_HARDWARE': 'audit-hardware-pci-and-disk-hardware container',
    'AUDIT_HARDWARE_PRINTERS': 'audit-hardware-printers container',
    'AUDIT_SOFTWARE': 'audit-software',
    'AUDIT_SOFTWARE_LICENSES': 'audit-software-licenses container',
    'AUDIT_SOFTWARE_ADD_REMOVE': 'audit-software-addremove container',
    'AUDIT_SOFTWARE_STARTUP_APPLICATIONS': 'audit-software-startup-applications container',
    'AUDIT_USERS_AND_GROUPS': 'audit-users-and-groups',
    'AUDIT_USERS_AND_GROUPS_USER_ACCOUNTS': 'audit-users-and-groups-user-accounts container',
    'AUDIT_USERS_AND_GROUPS_GROUPS': 'audit-users-and-groups-groups container',
    'AUDIT_USERS_AND_GROUPS_MEMBERS': 'audit-users-and-groups-members container',
    'AUDIT_LOGS': 'audit-logs',
    'AUDIT_LOGS_AGENT': 'audit-logs-agent container',
    'AUDIT_LOGS_CONFIGURATION': 'audit-logs-configuration container',
    'AUDIT_LOGS_MONITOR_ACTION': 'audit-logs-monitor-action container',
    'AUDIT_LOGS_REMOTE_CONTROL': 'audit-logs-remote-control container',
    'TOOLS': 'Tools',
    'PREF_QUICKLAUNCH': 'pref-quicklaunch container',
    'PREF_DASHBOARD': 'pref-dashboard container',
    'PREF_GENERAL': 'pref-general container'
};

var QV_EVENTS = {
    'DOC_READY': 'DOC_READY',
    'TAB_CHANGED': 'TAB_CHANGED',
    'LOCAL_NAV_CHANGED': 'LOCAL_NAV_CHANGED',
    'DATA_CHANGED': 'DATA_CHANGED'
};

var tabMarkupConfig = {
    "Tickets": {
        localItems: {
            "ticketlog": {
                active: true,
                title: "@~Tickets~@",
                columns: ["@~ID~@", "@~Assignee~@", "@~Status~@", "@~Last Modified~@", "@~Summary~@"]
            }
        }
    },
    "Alarms": {
        localItems: {
            "alarmlog": {
                active: true,
                title: "@~Alarms~@",
                columns: []
            }
        }
    },
    "Procedures": {
        localItems: {
            "execute": {
                active: true,
                title: "@~Execute Procedures~@",
                columns: [],
                markup: function() {
                    return '<div class="form">'+
                        '<p class="instructions">@~Add an agent procedure to the run now list below~@</p>' +
                        '<div class="row">'+
                            '<div class="nine columns">'+
                                '<select id="availableScripts" multiple></select>'+
                            '</div>'+
                            '<div class="three columns">'+
                                '<a id="addRunNowProcs" class="btn primary small" title="@~Click to add an agent procedure to the run now list below~@"><i class="icon-plus"></i> Add</a>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<hr />' +
                    '<table class="action-table sortable">' +
                        '<thead>' +
                            '<tr>' +
                                '<th>@~Click Agent Procedure name to Run Now~@</th>' +
                                '<th class="icon">@~Delete~@</th>' +
                                '<th class="icon">@~Sort~@</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody id="adminRunNowCollection"></tbody>' +
                    '</table>';
                }
            },
            "pending": {
                title: "@~Pending Procedures~@",
                columns: ["@~Pending Procedures~@","@~Scheduled Execution~@","@~Recurring Interval~@","@~Admin~@"]
            },
            "history": {
                title: "@~Procedure History~@",
                columns: ["@~Procedure History~@","@~Last Execution~@","@~Status~@","@~Admin~@"]
            },
            "log": {
                title: "@~Procedure Log~@",
                columns: ["@~Time~@","@~Procedure~@","@~Description~@"]
            }
        }
    },
    "Audit": {
        localItems: {
            "audit-logs": {
                active: true,
                title: "@~Logs~@",
                columns: [],
                tabs: {
                    "audit-logs-agent": {
                        active: true,
                        additionalClass: 'first',
                        title: "@~Agent~@",
                        columns: ["@~Time~@", "@~Description~@"]
                    },
                    "audit-logs-configuration": {
                        title: "@~Configuration~@",
                        columns: ["@~Time~@", "@~Description~@"]
                    },
                    "audit-logs-monitor-action": {
                        title: "@~Monitor Action~@",
                        columns: ["@~Time~@", "@~Type~@", "@~SNMP~@", "@~Message~@"]
                    },
                    "audit-logs-remote-control": {
                        additionalClass: 'last',
                        title: "@~Remote Control~@",
                        columns: ["@~Time~@", "@~Type~@", "@~Duration~@", "@~Admin~@"]
                    }
                }
            },
            "audit-hardware": {
                title: "@~Hardware~@",
                columns: [],
                tabs: {
                    "audit-hardware-disk-volumes": {
                        active: true,
                        additionalClass: 'first',
                        title: "@~Disk Volumes~@",
                        columns: ["@~Drive~@", "@~Type~@", "@~Format~@", "@~Free Space~@", "@~Used Space~@", "&nbsp;", "@~Total Size~@", "@~Label~@"]
                    },
                    "audit-hardware-disk-partitions": {
                        title: "@~Disk Partitions~@",
                        columns: ["@~Partition Name~@", "@~Disk~@", "@~Type~@", "@~Size~@", "@~Frag~@", "@~Primary~@", "@~Bootable~@", "@~Active Boot~@"]
                    },
                    "audit-hardware-disk-shares": {
                        title: "@~Disk Shares~@",
                        columns: ["@~Share Name~@", "@~Path~@", "@~Type~@", "@~Description~@"]
                    },
                    "audit-hardware-pci-and-disk-hardware": {
                        title: "@~PCI and Disk Hardware~@",
                        columns: ["@~Product Class~@", "@~Vendor~@", "@~Product~@"]
                    },
                    "audit-hardware-printers": {
                        additionalClass: 'last',
                        title: "@~Printers~@",
                        columns: ["@~Printer Name~@", "@~Port~@", "@~Model~@"]
                    }
                }
            },
            "audit-software": {
                title: "@~Software~@",
                columns: [],
                tabs: {
                    "audit-software-licenses": {
                        active: true,
                        additionalClass: 'first',
                        title: "@~Licenses~@",
                        columns: ["@~Publisher~@", "@~Title~@", "@~Product Key~@", "@~License~@", "@~Version~@", "@~Installed~@"]
                    },
                    "audit-software-addremove": {
                        title: "@~Add/Remove~@",
                        columns: ["@~Application Name~@"]
                    },
                    "audit-software-startup-applications": {
                        additionalClass: 'last',
                        title: "@~Startup Applications~@",
                        columns: ["@~Application~@,@~Command~@,@~User~@"]
                    }
                }
            },
            "audit-users-and-groups": {
                title: "@~Users and Groups~@",
                columns: [],
                tabs: {
                    "audit-users-and-groups-user-accounts": {
                        active: true,
                        additionalClass: 'first',
                        title: "@~User Accounts~@",
                        columns: ["@~Logon Name~@", "@~Full Name~@", "@~Description~@", "@~Enabled~@", "@~Locked~@", "@~Expired~@", "@~Changeable~@"]
                    },
                    "audit-users-and-groups-groups": {
                        title: "@~Groups~@",
                        columns: ["@~Group Name~@", "@~Description~@"]
                    },
                    "audit-users-and-groups-members": {
                        additionalClass: 'last',
                        title: "@~Members~@",
                        columns: ["@~Group Name~@", "@~Member~@"]
                    }
                }
            }
        }
    },
    "Tools": {
        localItems: {
            "tools-agent-checkin active": {
                active: true,
                title: "@~Agent Check-in Control Settings~@",
                columns: [],
                markup: function() {
                    return '<div class="form">' +
                        '<p class="instructions">@~Specify address where each desktop should check into the KServer.~@</p>' +
                        '<div class="row control-group">' +
                            '<div class="three columns">' +
                                '<label>@~Primary KServer~@</label>' +
                                '<input type="text" size="20" id="agent-checkin-primarykserver">' +
                            '</div>' +
                            '<div class="three columns">' +
                                '<label>@~Primary Port~@</label>' +
                                '<input type="text" size="8" id="agent-checkin-primaryport">' +
                            '</div>' +
                            '<div class="six columns">' +
                                '<label>@~Check-in Period~@</label>' +
                                '<input type="text" size="8" id="agent-checkin-period"> <select><option>@~Sec~@</option><option>@~Min~@</option><option>@~Hr~@</option></select>' +
                            '</div>' +
                        '</div>' +
                        '<div class="row control-group">' +
                            '<div class="three columns">' +
                                '<label>@~Secondary KServer~@</label>' +
                                '<input type="text" size="20" id="agent-checkin-secondarykserver">' +
                            '</div>' +
                            '<div class="three columns">' +
                                '<label>@~Secondary Port~@</label>' +
                                '<input type="text" size="8" id="agent-checkin-secondaryport">' +
                            '</div>' +
                            '<div class="six columns">' +
                                '<label>@~Bandwidth Throttle~@</label>' +
                                '<input type="text" size="8" id="agent-checkin-bandwidththrottle">' +
                                '<span class="description">@~0 to disable~@</span>' +
                            '</div>' +
                        '</div>' +
                        '<p>' +
                            '<label>Options</label>' +
                            '<label class="checkbox" id="agent-checkin-chkbindtokserver"> <input type="checkbox"> @~Bind to KServer~@</label><br>' +
                        '</p>' +
                        '<hr>' +
                        '<p><input type="button" class="btn primary" value="@~Update~@" id="update-checkin"></p>' +
                    '</div>';
                }
            },
            "tools-agent-workingdir": {
                title: "@~Agent Working Directory~@",
                columns: [],
                markup: function() {
                    return '<div class="form">' +
                        '<p class="instructions">@~Set a path to a directory used by the agent to store working files~@</p>' +
                        '<div class="row control-group">' +
                            '<div class="twelve columns">' +
                                '<label>@~Working Directory~@</label>' +
                                '<input type="text" size="80" id="agent-workingdir">' +
                            '</div>' +
                        '</div>' +
                        '<hr>' +
                        '<p><input type="button" class="btn primary" value="@~Update~@" id="update-workingdir"> <label id="update-message"></label></p>' +
                    '</div>';
                }
            },
            "tools-agent-suspend": {
                title: "@~Suspend Agent~@",
                columns: [],
                markup: function() {
                    return '<div class="form">' +
                        '<p class="instructions" id="agent-suspend-status"></p>' +
                        '<div class="row control-group">' +
                            '<div class="twelve columns">' +
                                '<p>' +
                                    '<label id="agent-suspend-label">@~Suspend all agent operations~@</label>' +
                                    '<span class="description">@~Agent procedures, monitoring, patching, etc. without changing the agent settings~@</span>' +
                                    '<p><input type="button" class="btn danger" value="@~Suspend~@" id="suspend-agent"></p>' +
                                '</p>' +
                                '<hr>' +
                                '<p>' +
                                    '<label id="agent-resume-label">@~Resume full agent operations~@</label>' +
                                    '<p><input type="button" class="btn primary" value="@~Resume~@" id="resume-agent"></p>' +
                                '</p>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
                }
            },
            "tools-agent-credential": {
                title: "@~Set Agent Credentials~@",
                columns: [],
                markup: function() {
                    return '<div class="form">' +
                        '<p class="instructions">@~Set a login credential for the agent to use in Patch Management and the Use Credential script command~@</p>' +
                        '<div class="row control-group">' +
                            '<div class="twelve columns">' +
                                '<label>@~Username~@</label>' +
                                '<input type="text" size="40" id="agent-cred-username">' +
                                '<label>@~Password~@</label>' +
                                '<input type="password" size="40" id="agent-cred-password">' +
                                '<label>@~Confirm Password~@</label>' +
                                '<input type="password" size="40" id="agent-cred-confirm">' +
                                '<p>' +
                                    '<label class="radio"><input type="radio" id="agent-cred-rdoaccounttype" name="agent-cred-rdoaccounttype"> @~Local user account~@</label><br/>' +
                                    '<label class="radio"><input type="radio" id="agent-cred-rdoaccounttype" name="agent-cred-rdoaccounttype"> @~Use machines\'s current domain~@</label><br/>' +
                                    '<label class="radio"><input type="radio" id="agent-cred-rdoaccounttype" name="agent-cred-rdoaccounttype"> @~Specify Domain~@</label>' +
                                    '<p><input type="text" size="60" id="agent-cred-domain"></p>' +
                                '</p>' +
                            '</div>' +
                        '</div>' +
                        '<hr>' +
                        '<p>' +
                            '<input type="button" class="btn primary" value="@~Update~@" id="update-setcredential">' +
                            '<input type="button" class="btn" value="@~Test~@" id="test-setcredential">' +
                        '</p>' +
                    '</div>';
                }
            },
            "tools-admin-notes": {
                title: "@~Set Admin Notes~@",
                columns: [],
                markup: function() {
                    return '<div class="form">' +
                            '<p class="instructions">@~Notes for~@&nbsp;</p>' +
                            '<div class="row control-group">' +
                                '<div class="twelve columns">' +
                                '<input id="adminnote-datepicker" type="text" />' +
                                '<input id="adminnote-timepicker" type="text" />' +
                                '<br/><textarea rows=4 style="width: 100%" id="adminNotes"></textarea>' +
                                '</div>' +
                            '</div>' +
                            '<p>' +
                                '<input type="button" class="btn primary" value="@~Apply~@" id="adminnotes-apply">' +
                                '<input type="button" class="btn" value="@~Cancel~@" id="adminnotes-cancel">' +
                            '</p>' +
                            '</div>' +
                            '<hr>' +
                            '<div>' +
                                '<span id="admin-notes-pageinfo"></span>' +
                                '<table>' +
                                    '<thead id="tools-adminNotesHeader">' +
                                        '<th>@~Time~@</th><th>@~Notes~@</th>' +
                                    '</thead>' +
                                    '<tbody id="tools-admin-notesData"></tbody>' +
                                '</table>' +
                            '</div>';
                }
            },
            "tools-reset-password": {
                title: "@~Reset Password~@",
                columns: [],
                markup: function() {
                    return '<div class="form">' +

                        '<p class="instructions">Reset the password for the specified local user account</p>' +

                        '<div class="row control-group">' +

                            '<div class="twelve columns">' +

                                '<label>Username</label><input size="40" type="text">' +

                                '<label>Password</label><input size="40" type="password">' +

                                '<label>Confirm Password</label><input size="40" type="password">' +

                                '<p>' +
                                    '<label class="checkbox"><input type="checkbox"> Create new account</label><br>' +
                                    '<label class="checkbox"><input type="checkbox" checked> As administrator</label>' +
                                '</p>' +

                                '<hr>' +

                                '<p><input class="btn primary" type="button" value="Reset Password"></p>' +

                            '</div>' +

                        '</div>' +

                    '</div>';
                }
            },
            "tools-wake-machine": {
                title: "@~Wake Machine~@",
                columns: [],
                markup: function() {
                    return  '<div class="form">' +

                            '<p class="instructions">Wake the user\'s machine from sleep</p>' +

                            '<div class="row control-group">' +

                                '<div class="twelve columns">' +

                                    '<p><a class="btn primary wake-machine"><i class="icon-switch"></i> Wake Machine</a></p>' +

                                    '<div class="alert">' +
                                        '<p>Attempting to wake machine</p>' +
                                    '</div>' +

                                '</div>' +

                            '</div>' +

                        '</div>';
                }
            },
            "tools-record-desktop": {
                title: "@~Record Desktop~@",
                columns: [],
                markup: function() {
                    return  '<div class="form">' +
                                '<p class="instructions">Record video capture of the user\'s desktop</p>' +
                                '<div class="row control-group">' +
                                    '<div class="twelve columns">' +
                                        '<p><a class="btn primary record-desktop"><i class="icon-play-2"></i> Record Desktop</a></p>' +
                                        '<div class="alert alert-warning">' +
                                            '<ul>' +
                                                '<li>2m:22s of video was recorded as <a href="#">machine.name.recording1.avi</a></li>' +
                                                '<li>2m:11s of video was recorded as <a href="#">machine.name.recording2.avi</a></li>' +
                                                '<li>0m:53s of video was recorded as <a href="#">machine.name.recording3.avi</a></li>' +
                                            '</ul>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';
                }
            }
        }
    }
};