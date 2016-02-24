var TestMod = require('../index');
var expect = require('expect.js');
var fs = require('fs');
var path = require('path');

describe('cube-jade', function () {
  it('expect info', function () {
    expect(TestMod.type).to.be('template');
    expect(TestMod.ext).to.be('.jade');
  });
  it('expect processor jade file fine', function (done) {
    require = function (mod) {
      if (mod === 'jade_runtime') {
        return {
          escape: function (str) {
            return str;
          }
        };
      }
      return {};
    };
    var file = '/test.jade';
    var source = fs.readFileSync(path.join(__dirname, file)).toString();
    var data = {
      realPath: '/test.jade',
      code: source,
      source: source
    };
    var cube = {
      config: {
        release: false,
        moduleWrap: true,
        compress: true,
        root: __dirname
      },
      wrapTemplate: function (file, code, require) {
        return 'Cube("' + file + '",' + JSON.stringify(require) + ',function(module){' + code + ';return module.exports});';
      }
    };
    function Cube(mod, requires, cb) {
      expect(mod).to.be('/test.jade');
      expect(requires).to.eql(['jade_runtime']);
      var tpl = cb({});
      expect(tpl({name: 'fishbar'})).to.match(/<div>fishbar<\/div>/);
      done();
    }
    var processor = new TestMod(cube);
    processor.process(data, function (err, res) {
      expect(err).to.be(null);
      expect(res).have.keys(['source', 'code']);
      expect(res.source).match(/#\{name\}/);
      var code = cube.wrapTemplate(file, res.code, ['jade_runtime']);
      eval(code);
    });
  });

  it ('expect processor jade file fine without compress', function (done) {
    var file = '/test.jade';
    var source = fs.readFileSync(path.join(__dirname, file)).toString();
    var data = {
      realPath: '/test.jade',
      code: source,
      source: source
    };
    var cube = {
      config: {
        release: false,
        moduleWrap: true,
        compress: true,
        root: __dirname
      },
      wrapTemplate: function (file, code, require) {
        return 'Cube("' + file + '",' + JSON.stringify(require) + ',function(module){' + code + ';return module.exports});';
      }
    };
    function Cube(mod, requires, cb) {
      expect(mod).to.be('/test.jade');
      expect(requires).to.eql(['jade_runtime']);
      var tpl = cb({});
      expect(tpl({name: 'fishbar'})).to.match(/<div>fishbar<\/div>/);
      done();
    }
    var processor = new TestMod(cube);
    processor.process(data, function (err, res) {
      expect(err).to.be(null);
      expect(res).have.keys(['source', 'code']);
      expect(res.source).match(/#\{name\}/);
      var code = cube.wrapTemplate(file, res.code, ['jade_runtime']);
      eval(code);
    });
  });

  it ('expect processor error jade file, return error', function (done) {
    var file = '/test_err.jade'
    var source = fs.readFileSync(path.join(__dirname, file)).toString();
    var data = {
      realPath: file,
      code: source,
      source: source
    };
    var cube = {
      config: {
        release: false,
        moduleWrap: true,
        compress: true,
        root: __dirname
      },
      wrapTemplate: function (file, code, require) {
        return 'Cube("' + file + '",' + JSON.stringify(require) + ',function(module){' + code + ';return module.exports});';
      }
    };
    var processor = new TestMod(cube);
    processor.process(data, function (err, res) {
      expect(err).to.be.ok();
      expect(err.code).to.be('Jade_Parse_Error');
      done();
    });
  });
});