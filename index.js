'use strict';

var path = require('path');
var jade = require('jade');

function JadeProcessor(cube) {
  this.cube = cube;
}

JadeProcessor.type = 'template';
JadeProcessor.ext = '.jade';

JadeProcessor.prototype.process = function (data, callback) {
  var code = data.code;
  var file = data.realPath;
  var resFun;
  try {
    resFun = jade.compileClient(code, {filename: file});
  } catch (e) {
    e.code = 'Jade_Parse_Error';
    e.file = file;
    // e.line =
    // e.message = '\n File:' + file + e.message;
    return callback(e);
  }

  code = resFun.toString();
  data.code = 'var jade = require("jade_runtime");\n' + code +
         '\nmodule.exports = template;\n';
  callback(null, data);
};

module.exports = JadeProcessor;
