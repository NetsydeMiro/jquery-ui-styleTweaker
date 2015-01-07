(function() {
  describe('styleTweaker', function() {
    var $div;
    $div = null;
    beforeEach(function() {
      return $div = $('<div id="target"></div>').appendTo('body');
    });
    afterEach(function() {
      return $div.remove();
    });
    describe('#constructor', function() {
      it('requires no options', function() {
        var nobomb;
        nobomb = function() {
          return $div.styleTweaker();
        };
        return expect(nobomb).not.toThrow();
      });
      it('creates a control for each css property', function() {
        var cssProperties;
        cssProperties = $.netsyde.styleTweaker.prototype._getCssPropertyNames($div[0]);
        $div.styleTweaker({
          targetSelector: '#target'
        });
        return expect($div.children('.tweaker-control').length).toEqual(cssProperties.length);
      });
      it('can specify properties via a string', function() {
        $div.styleTweaker({
          targetSelector: '#target',
          propertyFilter: 'border-top-color'
        });
        expect($div.children('.tweaker-control').length).toEqual(1);
        return expect($div.children('.tweak-border-top-color').length).toEqual(1);
      });
      it('can specify properties via a regex string', function() {
        $div.styleTweaker({
          targetSelector: '#target',
          propertyFilter: 'border-top*'
        });
        expect($div.children('.tweaker-control').length).toEqual(5);
        expect($div.children('.tweak-border-top-color').length).toEqual(1);
        expect($div.children('.tweak-border-top-width').length).toEqual(1);
        expect($div.children('.tweak-border-top-style').length).toEqual(1);
        expect($div.children('.tweak-border-top-right-radius').length).toEqual(1);
        return expect($div.children('.tweak-border-top-left-radius').length).toEqual(1);
      });
      return it('can specify properties via a string predicate', function() {
        $div.styleTweaker({
          propertyFilter: function(cssPropName) {
            return cssPropName.match('border-top.*rad*');
          }
        });
        expect($div.children('.tweaker-control').length).toEqual(2);
        expect($div.children('.tweak-border-top-right-radius').length).toEqual(1);
        return expect($div.children('.tweak-border-top-left-radius').length).toEqual(1);
      });
    });
    describe('#style()', function() {
      var tweakerInstance;
      tweakerInstance = null;
      beforeEach(function() {
        $div.css('border', 'solid 10px red').styleTweaker({
          targetSelector: '#target'
        });
        return tweakerInstance = $div.styleTweaker('instance');
      });
      it('gets the style', function() {
        expect($div.styleTweaker('style', 'border-bottom-width')).toEqual('10px');
        return expect(tweakerInstance.style('border-bottom-width')).toEqual('10px');
      });
      return it('sets the style', function() {
        $div.styleTweaker('style', 'border-bottom-width', '20px');
        expect($div.css('border-bottom-width')).toEqual('20px');
        tweakerInstance.style('border-bottom-width', '30px');
        return expect($div.css('border-bottom-width')).toEqual('30px');
      });
    });
    describe('#refreshInput()', function() {
      var tweakerInstance;
      tweakerInstance = null;
      beforeEach(function() {
        $div.css('border', 'solid 10px red').styleTweaker({
          targetSelector: '#target'
        });
        return tweakerInstance = $div.styleTweaker('instance');
      });
      return it('refreshes the input', function() {
        $div.css('border-bottom-width', '20px');
        expect($div.find('.tweak-border-bottom-width input').val()).toEqual('10px');
        tweakerInstance.refreshInput('border-bottom-width');
        return expect($div.find('.tweak-border-bottom-width input').val()).toEqual('20px');
      });
    });
    describe('control initialization', function() {
      beforeEach(function() {
        return $div.css('border', 'solid 10px red').styleTweaker({
          targetSelector: '#target'
        });
      });
      it('initializes inputs ', function() {
        var input;
        input = $div.children('.tweak-border-top-width').children('input');
        return expect(input.val()).toEqual('10px');
      });
      it('initializes select dropdowns', function() {
        var select;
        select = $div.children('.tweak-border-top-style').children('select');
        return expect(select.val()).toEqual('solid');
      });
      return it('initializes select dropdown options', function() {
        var $options, options;
        $options = $div.children('.tweak-clear').children('select').children('option');
        options = $options.toArray().map(function(val, i) {
          return val.text;
        }).sort();
        return expect(options).toEqual(['both', 'inherit', 'initial', 'left', 'none', 'right']);
      });
    });
    describe('control interactions', function() {
      beforeEach(function() {
        return $div.css('border', 'solid 10px red').styleTweaker({
          targetSelector: '#target'
        });
      });
      it('changes styles when inputs changed', function() {
        var input;
        expect($div.css('border-top-width')).toEqual('10px');
        input = $div.children('.tweak-border-top-width').children('input');
        input.val('20px').change();
        expect($div.css('border-bottom-width')).toEqual('10px');
        return expect($div.css('border-top-width')).toEqual('20px');
      });
      return it('changes styles when selects changed', function() {
        var select;
        expect($div.css('border-top-style')).toEqual('solid');
        select = $div.children('.tweak-border-top-style').children('select');
        select.val('dashed').change();
        expect($div.css('border-bottom-style')).toEqual('solid');
        return expect($div.css('border-top-style')).toEqual('dashed');
      });
    });
    describe('event processing', function() {
      var spy;
      spy = null;
      beforeEach(function() {
        return spy = jasmine.createSpy('spy');
      });
      describe('change event', function() {
        it('can hook to change callback via constructor', function() {
          var input;
          $div.styleTweaker({
            targetSelector: '#target',
            change: spy
          });
          input = $div.children('.tweak-border-top-width').children('input');
          input.val('20px').change();
          return expect(spy.calls.count()).toEqual(1);
        });
        it('can hook to change event via bind', function() {
          var select;
          $div.styleTweaker().bind('styletweakerchange', spy);
          select = $div.children('.tweak-border-top-style').children('select');
          select.val('dashed').change();
          return expect(spy.calls.count()).toEqual(1);
        });
        it('receives correct arguments via callback', function() {
          var call, data, input, obj;
          $div.styleTweaker({
            targetSelector: '#target',
            change: spy
          });
          input = $div.children('.tweak-border-top-width').children('input');
          input.val('20px').change();
          call = spy.calls.mostRecent();
          obj = call.object;
          data = call.args[1];
          expect(obj).toBe($div[0]);
          expect(data.tweaker).toBe($div.styleTweaker('instance'));
          expect(data.cssPropertyName).toEqual('border-top-width');
          return expect(data.cssPropertyValue).toEqual('20px');
        });
        it('receives correct arguments via event', function() {
          var call, data, obj, select;
          $div.styleTweaker().bind('styletweakerchange', spy);
          select = $div.children('.tweak-border-top-style').children('select');
          select.val('dashed').change();
          call = spy.calls.mostRecent();
          obj = call.object;
          data = call.args[1];
          expect(obj).toBe($div[0]);
          expect(data.tweaker).toBe($div.styleTweaker('instance'));
          expect(data.cssPropertyName).toEqual('border-top-style');
          return expect(data.cssPropertyValue).toEqual('dashed');
        });
        it('can cancel change via callback', function() {
          var input;
          spy = function() {
            return false;
          };
          $div.css('border', 'solid 10px red').styleTweaker({
            targetSelector: '#target',
            change: spy
          });
          input = $div.children('.tweak-border-top-width').children('input');
          input.val('20px').change();
          return expect($div.css('border-top-width')).toEqual('10px');
        });
        return it('can cancel change via event', function() {
          var input;
          spy = function() {
            return false;
          };
          $div.css('border', 'solid 10px red').styleTweaker({
            targetSelector: '#target'
          }).bind('styletweakerchange', spy);
          input = $div.children('.tweak-border-top-width').children('input');
          input.val('20px').change();
          return expect($div.css('border-top-width')).toEqual('10px');
        });
      });
      return describe('input created event', function() {
        it('can hook to input created callback via constructor', function() {
          $div.styleTweaker({
            targetSelector: '#target'
          }, {
            propertyFilter: 'border.*color',
            inputcreated: spy
          });
          return expect(spy.calls.count()).toEqual(4);
        });
        return it('receives correct arguments via callback', function() {
          var call, data;
          $div.css('border-style', 'dashed').styleTweaker({
            targetSelector: '#target'
          }, {
            propertyFilter: 'border-top-style',
            inputcreated: spy
          });
          expect(spy.calls.count()).toEqual(1);
          call = spy.calls.mostRecent();
          data = call.args[1];
          expect(call.object).toBe($div[0]);
          expect(data['tweaker']).toBe($div.styleTweaker('instance'));
          expect(data['cssPropertyType']).toEqual('discrete');
          expect(data['cssPropertyName']).toEqual('border-top-style');
          expect(data['cssPropertyValue']).toEqual('dashed');
          return expect(data['cssPropertyOptions']).toEqual(['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit']);
        });
      });
    });
    describe('#_getCssPropertyNames()', function() {
      var fnc;
      fnc = $.netsyde.styleTweaker.prototype._getCssPropertyNames;
      it('returns many css property names (varies from browser to browser)', function() {
        var propertyNames;
        propertyNames = fnc($div[0]);
        return expect(propertyNames.length).toBeGreaterThan(50);
      });
      it('returns some known css property names', function() {
        var propertyNames;
        propertyNames = fnc($div[0]);
        expect(propertyNames).toContain('border-top-width');
        expect(propertyNames).toContain('border-top-style');
        return expect(propertyNames).toContain('border-top-color');
      });
      it('omits css property values', function() {
        var propertyNames;
        propertyNames = fnc($div[0]);
        expect(propertyNames).not.toContain('none');
        expect(propertyNames).not.toContain('collapse');
        expect(propertyNames).not.toContain('auto');
        return expect(propertyNames).not.toContain('0px');
      });
      return it('returns properties in alphabetical order', function() {
        var propertyNames, sortedPropertyNames;
        propertyNames = fnc($div[0]);
        sortedPropertyNames = propertyNames.slice().sort();
        return expect(propertyNames).toEqual(sortedPropertyNames);
      });
    });
    describe('#_getJsPropertyName()', function() {
      var fnc;
      fnc = $.netsyde.styleTweaker.prototype._getJsPropertyName;
      return it('camelCases css property names', function() {
        return expect(fnc('border-top-color')).toEqual('borderTopColor');
      });
    });
    return describe('#_getCssPropertyValues()', function() {
      var fnc;
      fnc = $.netsyde.styleTweaker.prototype._getCssPropertyValues;
      beforeEach(function() {
        return $div.css('border', 'solid 10px red');
      });
      it('has correct number of elements', function() {
        var propertyValues;
        propertyValues = fnc($div[0], ['border-top-color', 'border-bottom-width']);
        return expect(Object.keys(propertyValues).length).toBe(2);
      });
      return it('has correct values', function() {
        var propertyValues;
        propertyValues = fnc($div[0], ['border-top-color', 'border-bottom-width']);
        expect(propertyValues['border-top-color']).toEqual('rgb(255, 0, 0)');
        return expect(propertyValues['border-bottom-width']).toEqual('10px');
      });
    });
  });

}).call(this);

//# sourceMappingURL=styleTweakerSpec.js.map
