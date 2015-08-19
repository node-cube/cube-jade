var path = require('path');
var jade = require('jade');
var fs = require('fs');
var ug = require('uglify-js');

function JadeProcessor(cube) {
  this.cube = cube;
}

JadeProcessor.info = {
  type: 'template',
  ext: '.jade'
};

JadeProcessor.prototype = {
  process: function (file, options, callback) {
    var code;
    var res = {};
    var root = options.root;
    var fpath = path.join(root, file);
    var resFun;
    var flagHtml = false;
    if (/\.html$/.test(options.qpath)) {
      flagHtml = true;
      options.compress = false;
    }
    code = fs.readFileSync(fpath, 'utf8').toString();
    res.source = code;
    try {
      resFun = (flagHtml ? jade.compile : jade.compileClient)(code, {filename: fpath});
    } catch (e) {
      e.message += '\n file:' + file;
      return callback(e);
    }

    code = resFun.toString();

    if (options.compress) {
      code = ug.minify(code, {fromString: true}).code;
    }

    if (options.moduleWrap) {
      var wraped = 'var jade = require("jade_runtime");' + code +
         ';module.exports = template;';
      res.wraped = this.cube.wrapTemplate(options.qpath, wraped, ['jade_runtime']);
    }

    if (flagHtml) {
      res.code = resFun({});
    } else {
      res.code = code;
    }
    callback(null, res);
  }
};


module.exports = JadeProcessor;