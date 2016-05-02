/*
 * Copyright (c) 2014 MKLab. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, regexp: true */
/*global define, $, _, window, app, type, document, java7 */

define(function (require, exports, module) {
    "use strict";

    var Repository     = app.getModule("core/Repository"),
        ProjectManager = app.getModule("engine/ProjectManager"),
        Engine         = app.getModule("engine/Engine"),
        FileSystem     = app.getModule("filesystem/FileSystem"),
        FileUtils      = app.getModule("file/FileUtils"),
        Async          = app.getModule("utils/Async"),
        ERD            = app.getModule("erd/ERD");

    var CodeGenUtils = require("CodeGenUtils");

    /**
     * DDL Generator
     * @constructor
     *
     * @param {type.ERDDataModel} baseModel
     * @param {string} basePath generated files and directories to be placed
     */
    function DDLGenerator(baseModel, basePath) {
        /** @member {type.Model} */
        this.baseModel = baseModel;

        /** @member {string} */
        this.basePath = basePath;
    }

    /**
     * Return Indent String based on options
     * @param {Object} options
     * @return {string}
     */
    DDLGenerator.prototype.getIndentString = function (options) {
        if (options.useTab) {
            return "\t";
        } else {
            var i, len, indent = [];
            for (i = 0, len = options.indentSpaces; i < len; i++) {
                indent.push(" ");
            }
            return indent.join("");
        }
    };

    /**
     * Generate codes from a given element
     * @param {type.Model} elem
     * @param {string} path
     * @param {Object} options
     * @return {$.Promise}
     */
    DDLGenerator.prototype.generate = function (elem, path, options) {
        var result = new $.Deferred(),
            self = this,
            fullPath,
            directory,
            codeWriter,
            file;

        // Package (a directory with __init__.py)
        if (elem instanceof type.UMLPackage) {
            fullPath = path + "/" + elem.name;
            directory = FileSystem.getDirectoryForPath(fullPath);
            directory.create(function (err, stat) {
                if (!err) {
                    file = FileSystem.getFileForPath(fullPath + "/__init__.py");
                    FileUtils.writeText(file, "", true)
                        .done(function () {
                            Async.doSequentially(
                                elem.ownedElements,
                                function (child) {
                                    return self.generate(child, fullPath, options);
                                },
                                false
                            ).then(result.resolve, result.reject);
                        })
                        .fail(function (err) {
                            result.reject(err);
                        });
                } else {
                    result.reject(err);
                }
            });

        // Class
        } else if (elem instanceof type.UMLClass || elem instanceof type.UMLInterface) {
            fullPath = path + "/" + elem.name + ".py";
            codeWriter = new CodeGenUtils.CodeWriter(this.getIndentString(options));
            codeWriter.writeLine(options.installPath);
            codeWriter.writeLine("#-*- coding: utf-8 -*-");
            codeWriter.writeLine();
            this.writeClass(codeWriter, elem, options);
            file = FileSystem.getFileForPath(fullPath);
            FileUtils.writeText(file, codeWriter.getData(), true).then(result.resolve, result.reject);

        // Enum
        } else if (elem instanceof type.UMLEnumeration) {
            fullPath = path + "/" + elem.name + ".py";
            codeWriter = new CodeGenUtils.CodeWriter(this.getIndentString(options));
            codeWriter.writeLine(options.installPath);
            codeWriter.writeLine("#-*- coding: utf-8 -*-");
            codeWriter.writeLine();
            this.writeEnum(codeWriter, elem, options);
            file = FileSystem.getFileForPath(fullPath);
            FileUtils.writeText(file, codeWriter.getData(), true).then(result.resolve, result.reject);

        // Others (Nothing generated.)
        } else {
            result.resolve();
        }
        return result.promise();
    };


    /**
     * Generate
     * @param {type.Model} baseModel
     * @param {string} basePath
     * @param {Object} options
     */
    function generate(baseModel, basePath, options) {
        var result = new $.Deferred(),
            directory,
            fullPath;
        var generator = new DDLGenerator(baseModel, basePath);
        fullPath = basePath + "/" + baseModel.name;
        directory = FileSystem.getDirectoryForPath(fullPath);
        directory.create(function (err, stat) {
            if (!err) {
                Async.doSequentially(
                    baseModel.ownedElements,
                    function (child) {
                        return generator.generate(child, fullPath, options);
                    },
                    false
                ).then(result.resolve, result.reject);
            } else {
                result.reject(err);
            }
        });
        return result.promise();
    }

    exports.generate = generate;

});
