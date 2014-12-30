describe 'styleTweaker', -> 

  $div = null

  beforeEach -> 
    $div = $('<div></div>').appendTo('body')

  afterEach -> 
    $div.remove()

  describe '#constructor', -> 

    it 'requires no options', -> 
      nobomb = -> $div.styleTweaker()
      expect(nobomb).not.toThrow()

  describe '#_getCssPropertyNames', -> 
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

  describe '#_getJsPropertyName', -> 
    fnc = $.netsyde.styleTweaker.prototype._getJsPropertyName

    it 'camelCases css property names', -> 
      expect(fnc 'border-top-color').toEqual 'borderTopColor'


