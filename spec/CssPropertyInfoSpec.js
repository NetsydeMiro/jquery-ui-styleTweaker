(function() {
  describe('CssPropertyInfo', function() {
    it('bombs if not used as constructor', function() {
      var bomb;
      bomb = function() {
        var wrong;
        return wrong = CssPropertyInfo();
      };
      return expect(bomb).toThrow();
    });
    it('works when used as constructor', function() {
      var fine;
      fine = function() {
        var right;
        return right = new CssPropertyInfo();
      };
      return expect(fine).not.toThrow();
    });
    return describe('methods', function() {
      var propInfo;
      propInfo = null;
      beforeEach(function() {
        return propInfo = new CssPropertyInfo();
      });
      describe('#propertyType()', function() {
        it('correctly classifies string specified discrete property', function() {
          return expect(propInfo.propertyType('clear')).toEqual('discrete');
        });
        it('correctly classifies regex specified discrete property', function() {
          return expect(propInfo.propertyType('border-top-style')).toEqual('discrete');
        });
        it('correctly classifies string specified bool property', function() {
          return expect(propInfo.propertyType('accelerator')).toEqual('bool');
        });
        it('correctly classifies regex specified scalar property', function() {
          return expect(propInfo.propertyType('border-top-width')).toEqual('scalar');
        });
        return it('correctly classifies regex specified color property', function() {
          return expect(propInfo.propertyType('border-top-color')).toEqual('color');
        });
      });
      describe('#discreteOptions()', function() {
        it('returns string specified options', function() {
          var options;
          options = propInfo.discreteOptions('clear');
          options.sort();
          return expect(options).toEqual(['both', 'inherit', 'initial', 'left', 'none', 'right']);
        });
        return it('returns regex specified options', function() {
          var options;
          options = propInfo.discreteOptions('background-clip');
          options.sort();
          return expect(options).toEqual(['border-box', 'content-box', 'inherit', 'initial', 'padding-box']);
        });
      });
      return describe('#scalarUnits()', function() {
        return it('returns regex specified options', function() {
          var units;
          units = propInfo.scalarUnits('border-left-width');
          units.sort();
          return expect(units).toEqual(['%', 'em', 'px']);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=CssPropertyInfoSpec.js.map
