/*
 * Copyright (c) 2014-2018 MKLab. All rights reserved.
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

const ddlGenerator = require('./ddl-generator')

function getGenOptions () {
  return {
    fileExtension: app.preferences.get('ddl.gen.fileExtension'),
    quoteIdentifiers: app.preferences.get('ddl.gen.quoteIdentifiers'),
    dropTable: app.preferences.get('ddl.gen.dropTable'),
    dbms: app.preferences.get('ddl.gen.dbms'),
    useTab: app.preferences.get('ddl.gen.useTab'),
    indentSpaces: app.preferences.get('ddl.gen.indentSpaces')
  }
}

/**
 * Command Handler for DDL Generation
 *
 * @param {Element} base
 * @param {string} path
 * @param {Object} options
 */
function _handleGenerate (base, path, options) {
  // If options is not passed, get from preference
  options = options || getGenOptions()
  // If base is not assigned, popup ElementPicker
  if (!base) {
    app.elementPickerDialog.showDialog('Select a data model to generate DDL', null, type.ERDDataModel).then(function ({buttonId, returnValue}) {
      if (buttonId === 'ok') {
        base = returnValue
        // If path is not assigned, popup Save Dialog to save a file
        if (!path) {
          var file = app.dialogs.showSaveDialog('Save DDL As...', null, null)
          if (file && file.length > 0) {
            path = file
            ddlGenerator.generate(base, path, options)
          }
        } else {
          ddlGenerator.generate(base, path, options)
        }
      }
    })
  } else {
    // If path is not assigned, popup Save Dialog to save a file
    if (!path) {
      var file = app.dialogs.showSaveDialog('Save DDL As...', null, null)
      if (file && file.length > 0) {
        path = file
        ddlGenerator.generate(base, path, options)
      }
    } else {
      ddlGenerator.generate(base, path, options)
    }
  }
}

/**
* Popup PreferenceDialog with DDL Preference Schema
*/
function _handleConfigure () {
  app.commands.execute('application:preferences', 'ddl')
}

function init () {
  app.commands.register('ddl:generate', _handleGenerate)
  app.commands.register('ddl:configure', _handleConfigure)
}

exports.init = init
