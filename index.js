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
    code = fs.readFileSync(fpath, 'utf8').toString();
    res.source = code;
    try {
      var resFun = jade.compileClient(code, {filename: fpath});
      code = resFun.toString();
    } catch (e) {
      e.message += '\n file:' + file;
      return callback(e);
    }
    if (options.compress) {
      code = ug.minify(code, {fromString: true}).code;
    }
    if (options.moduleWrap) {
      var wraped = 'var jade = require("jade_runtime");' + code +
         ';module.exports = template;';
      res.wraped = this.cube.wrapTemplate(options.qpath, wraped, ['jade_runtime']);
    }
    res.code = code;

    callback(null, res);
  }
};


module.exports = JadeProcessor;