/*
 * Copyright (c) 2013-2014 Minkyu Lee. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains the
 * property of Minkyu Lee. The intellectual and technical concepts
 * contained herein are proprietary to Minkyu Lee and may be covered
 * by Republic of Korea and Foreign Patents, patents in process,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Minkyu Lee (niklaus.lee@gmail.com).
 *
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, regexp: true */
/*global define, app, $, _, window, appshell, staruml */

define(function (require, exports, module) {
    "use strict";

    var AppInit           = app.getModule("utils/AppInit"),
        Core              = app.getModule("core/Core"),
        PreferenceManager = app.getModule("core/PreferenceManager");

    var preferenceId = "ddl";

    var ddlPreferences = {
        "ddl.gen": {
            text: "DDL Generation",
            type: "Section"
        },
        "ddl.gen.fileExtension": {
            text: "DDL File Extension",
            description: "DDL File Extension",
            type: "Dropdown",
            options: [
                { value: ".sql", text: ".sql" },
                { value: ".ddl", text: ".ddl" }
            ],
            default: ".sql"
        },
        "ddl.gen.quoteIdentifiers": {
            text: "Quote Identifiers",
            description: "Quote identifiers",
            type: "Check",
            default: true
        },
        "ddl.gen.dropTable": {
            text: "Drop Tables",
            description: "Drop tables before create",
            type: "Check",
            default: true
        },
        "ddl.gen.dbms": {
            text: "DBMS",
            description: "Select a DBMS where generated DDL to be executed",
            type: "Dropdown",
            options: [
                { value: "mysql",  text: "MySQL" },
                { value: "oracle", text: "Oracle" }
            ],
            default: "mysql"
        },
        "ddl.gen.useTab": {
            text: "Use Tab",
            description: "Use Tab for indentation instead of spaces.",
            type: "Check",
            default: false
        },
        "ddl.gen.indentSpaces": {
            text: "Indent Spaces",
            description: "Number of spaces for indentation.",
            type: "Number",
            default: 4
        },
        "ddl.gen.tablespace_data": {
            text: "Table Space for DATA",
            description: "Table Space name for tables DATA.",
            type: "String",
            default: ""
        },
        "ddl.gen.tablespace_index": {
            text: "Table Space for INDEX",
            description: "Table Space name for idexes.",
            type: "String",
            default: ""
        }
    };

    function getId() {
        return preferenceId;
    }

    function getGenOptions() {
        return {
            fileExtension    : PreferenceManager.get("ddl.gen.fileExtension"),
            quoteIdentifiers : PreferenceManager.get("ddl.gen.quoteIdentifiers"),
            dropTable        : PreferenceManager.get("ddl.gen.dropTable"),
            dbms             : PreferenceManager.get("ddl.gen.dbms"),
            useTab           : PreferenceManager.get("ddl.gen.useTab"),
            indentSpaces     : PreferenceManager.get("ddl.gen.indentSpaces"),
			tablespaceData   : PreferenceManager.get("ddl.gen.tablespace_data"),
			tablespaceIndex  : PreferenceManager.get("ddl.gen.tablespace_index")
        };
    }

    AppInit.htmlReady(function () {
        PreferenceManager.register(preferenceId, "DDL", ddlPreferences);
    });

    exports.getId         = getId;
    exports.getGenOptions = getGenOptions;

});
