var TestMod = require('../index');
var expect = require('expect.js');

describe('cube-jade', function () {
  it('expect info', function () {
    expect(TestMod.info.type).to.be('template');
    expect(TestMod.info.ext).to.be('.jade');
  });
  it ('expect processor jade file fine', function (done) {
    require = function (mod) {
      if (mod === 'jade-runtime') {
        return {
          escape: function (str) {
            return str;
          }
        };
      }
      return {};
    };
    var options = {
      release: false,
      moduleWrap: true,
      compress: true,
      qpath: '/test.jade',
      root: __dirname
    };
    var cube = {
      config: options,
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
    processor.process('/test.jade', options, function (err, res) {
      expect(err).to.be(null);
      expect(res).have.keys(['source', 'code', 'wraped']);
      expect(res.source).match(/#\{name\}/);
      eval(res.wraped);
    });
  });

  it ('expect processor jade file fine without compress', function (done) {
    require = function (mod) {
      if (mod === 'jade-runtime') {
        return {
          escape: function (str) {
            return str;
          }
        };
      }
      return {};
    };
    var options = {
      release: false,
      moduleWrap: true,
      compress: false,
      qpath: '/test.jade',
      root: __dirname
    };
    var cube = {
      config: options,
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
    processor.process('/test.jade', options, function (err, res) {
      expect(err).to.be(null);
      expect(res).have.keys(['source', 'code', 'wraped']);
      expect(res.source).match(/#\{name\}/);
      eval(res.wraped);
    });
  });

  it ('expect processor error jade file, return error', function (done) {
    require = function () {
      return {};
    };
    var options = {
      release: false,
      moduleWrap: true,
      compress: true,
      qpath: '/test_err.jade',
      root: __dirname
    };
    var cube = {
      config: options,
      wrapTemplate: function (file, code, require) {
        return 'Cube("' + file + '",' + JSON.stringify(require) + ',function(module){' + code + ';return module.exports});';
      }
    };
    var processor = new TestMod(cube);
    processor.process('/test_err.jade', options, function (err, res) {
      expect(err).to.be.ok();
      expect(err.code).to.be('Jade_Parse_Error');
      done();
    });
  });
});