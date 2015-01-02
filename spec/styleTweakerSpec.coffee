describe 'styleTweaker', -> 

  $div = null

  beforeEach -> 
    $div = $('<div id="target"></div>').appendTo('body')

  afterEach -> 
    $div.remove()

  describe '#constructor', -> 

    it 'requires no options', -> 
      nobomb = -> $div.styleTweaker()
      expect(nobomb).not.toThrow()

    it 'creates a control for each css property', -> 
      cssProperties = $.netsyde.styleTweaker.prototype._getCssPropertyNames($div[0])
      $div.styleTweaker {targetSelector: '#target'}
      expect($div.children('.tweaker-control').length).toEqual cssProperties.length
      
    it 'can specify properties via a string', -> 
      $div.styleTweaker {targetSelector: '#target', propertyFilter: 'border-top-color'}
      expect($div.children('.tweaker-control').length).toEqual 1
      expect($div.children('.tweak-border-top-color').length).toEqual 1

    it 'can specify properties via a regex string', -> 
      $div.styleTweaker {targetSelector: '#target', propertyFilter: 'border-top*'}
      expect($div.children('.tweaker-control').length).toEqual 5
      expect($div.children('.tweak-border-top-color').length).toEqual 1
      expect($div.children('.tweak-border-top-width').length).toEqual 1
      expect($div.children('.tweak-border-top-style').length).toEqual 1
      expect($div.children('.tweak-border-top-right-radius').length).toEqual 1
      expect($div.children('.tweak-border-top-left-radius').length).toEqual 1

    it 'can specify properties via a string predicate', -> 
      $div.styleTweaker 
        propertyFilter: (cssPropName) -> cssPropName.match 'border-top.*rad*'

      expect($div.children('.tweaker-control').length).toEqual 2
      expect($div.children('.tweak-border-top-right-radius').length).toEqual 1
      expect($div.children('.tweak-border-top-left-radius').length).toEqual 1

  describe '#style()', -> 
    tweakerInstance = null

    beforeEach -> 
      $div.css('border', 'solid 10px red').styleTweaker(targetSelector: '#target')
      tweakerInstance = $div.styleTweaker('instance')

    it 'gets the style', -> 
      expect($div.styleTweaker('style', 'border-bottom-width')).toEqual '10px'
      expect(tweakerInstance.style('border-bottom-width')).toEqual '10px'

    it 'sets the style', -> 
      $div.styleTweaker('style', 'border-bottom-width', '20px')
      expect($div.css('border-bottom-width')).toEqual '20px'
      tweakerInstance.style('border-bottom-width', '30px')
      expect($div.css('border-bottom-width')).toEqual '30px'

  describe 'control initialization', -> 
    beforeEach -> 
      $div.css('border', 'solid 10px red').styleTweaker(targetSelector: '#target')

    it 'initializes inputs ', -> 
      input = $div.children('.tweak-border-top-width').children('input')
      expect(input.val()).toEqual '10px'

    it 'initializes select dropdowns', -> 
      select = $div.children('.tweak-border-top-style').children('select')
      expect(select.val()).toEqual 'solid'

    it 'initializes select dropdown options', -> 
      $options = $div.children('.tweak-clear').children('select').children('option')
      options = $options.toArray().map((val, i) -> val.text).sort()
      expect(options).toEqual ['both', 'inherit', 'initial', 'left', 'none', 'right']

  describe 'control interactions', -> 
    beforeEach -> 
      $div.css('border', 'solid 10px red').styleTweaker(targetSelector: '#target')

    it 'changes styles when inputs changed', -> 
      expect($div.css('border-top-width')).toEqual '10px'

      input = $div.children('.tweak-border-top-width').children('input')
      input.val('20px').change()
      expect($div.css('border-bottom-width')).toEqual '10px'
      expect($div.css('border-top-width')).toEqual '20px'

    it 'changes styles when selects changed', -> 
      expect($div.css('border-top-style')).toEqual 'solid'

      select = $div.children('.tweak-border-top-style').children('select')
      select.val('dashed').change()
      expect($div.css('border-bottom-style')).toEqual 'solid'
      expect($div.css('border-top-style')).toEqual 'dashed'


  describe 'event processing', -> 
    spy = null

    beforeEach -> 
      spy = jasmine.createSpy('spy')

    it 'can hook to change callback via constructor', -> 
      $div.styleTweaker(targetSelector: '#target', change: spy)
      input = $div.children('.tweak-border-top-width').children('input')
      input.val('20px').change()
      expect(spy.calls.count()).toEqual 1

    it 'can hook to change event via bind', -> 
      $div.styleTweaker().bind('styletweakerchange', spy)
      select = $div.children('.tweak-border-top-style').children('select')
      select.val('dashed').change()
      expect(spy.calls.count()).toEqual 1

    it 'receives correct arguments via callback', -> 
      $div.styleTweaker(targetSelector: '#target', change: spy)
      input = $div.children('.tweak-border-top-width').children('input')
      input.val('20px').change()
      args = spy.calls.argsFor(0)
      expect(args[1]).toEqual {property: 'border-top-width', value: '20px'}

    it 'receives correct arguments via event', -> 
      $div.styleTweaker().bind('styletweakerchange', spy)
      select = $div.children('.tweak-border-top-style').children('select')
      select.val('dashed').change()
      args = spy.calls.argsFor(0)
      expect(args[1]).toEqual {property: 'border-top-style', value: 'dashed'}

    it 'can cancel change via callback', -> 
      spy = -> false
      $div.css('border', 'solid 10px red').styleTweaker(targetSelector: '#target', change: spy)
      input = $div.children('.tweak-border-top-width').children('input')
      input.val('20px').change()
      expect($div.css('border-top-width')).toEqual '10px'

    it 'can cancel change via event', -> 
      spy = -> false
      $div.css('border', 'solid 10px red').styleTweaker(targetSelector: '#target').
        bind('styletweakerchange', spy)
      input = $div.children('.tweak-border-top-width').children('input')
      input.val('20px').change()
      expect($div.css('border-top-width')).toEqual '10px'

  describe '#_getCssPropertyNames()', -> 
    fnc = $.netsyde.styleTweaker.prototype._getCssPropertyNames

    it 'returns many css property names (varies from browser to browser)', -> 
      propertyNames = fnc($div[0])
      expect(propertyNames.length).toBeGreaterThan 50

    it 'returns some known css property names', -> 
      propertyNames = fnc($div[0])
      expect(propertyNames).toContain 'border-top-width'
      expect(propertyNames).toContain 'border-top-style'
      expect(propertyNames).toContain 'border-top-color'

    it 'omits css property values', -> 
      # Note that this test always passes in the console under grunt for some reason.
      # It does fail as expected in the browser when implementation changed however.  
      # Probably something with how phantomJs handles DOM.  
      # TODO: investigate
      propertyNames = fnc($div[0])
      expect(propertyNames).not.toContain 'none'
      expect(propertyNames).not.toContain 'collapse'
      expect(propertyNames).not.toContain 'auto'
      expect(propertyNames).not.toContain '0px'

    it 'returns properties in alphabetical order', -> 
      propertyNames = fnc($div[0])
      sortedPropertyNames = propertyNames.slice().sort()
      expect(propertyNames).toEqual sortedPropertyNames

  describe '#_getJsPropertyName()', -> 
    fnc = $.netsyde.styleTweaker.prototype._getJsPropertyName

    it 'camelCases css property names', -> 
      expect(fnc 'border-top-color').toEqual 'borderTopColor'

  describe '#_getCssPropertyValues()', -> 
    fnc = $.netsyde.styleTweaker.prototype._getCssPropertyValues

    beforeEach -> 
      $div.css('border', 'solid 10px red')

    it 'has correct number of elements', -> 
      propertyValues = fnc($div[0], ['border-top-color', 'border-bottom-width'])
      expect(Object.keys(propertyValues).length).toBe 2

    it 'has correct values', -> 
      propertyValues = fnc($div[0], ['border-top-color', 'border-bottom-width'])
      expect(propertyValues['border-top-color']).toEqual 'rgb(255, 0, 0)'
      expect(propertyValues['border-bottom-width']).toEqual '10px'

