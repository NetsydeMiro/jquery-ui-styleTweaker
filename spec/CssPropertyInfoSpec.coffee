describe 'CssPropertyInfo', ->

  it 'bombs if not used as constructor', -> 
    bomb = -> wrong = CssPropertyInfo()
    expect(bomb).toThrow()

  it 'works when used as constructor', -> 
    fine = -> right = new CssPropertyInfo()
    expect(fine).not.toThrow()

  describe 'methods', -> 
    propInfo = null

    beforeEach -> 
      propInfo = new CssPropertyInfo()

    describe '#propertyType()', -> 

      it 'correctly classifies string specified discrete property', -> 
        expect(propInfo.propertyType('clear')).toEqual 'discrete'

      it 'correctly classifies regex specified discrete property', -> 
        # 'border.*style'
        expect(propInfo.propertyType('border-top-style')).toEqual 'discrete'

      it 'correctly classifies string specified bool property', -> 
        expect(propInfo.propertyType('accelerator')).toEqual 'bool'

      it 'correctly classifies regex specified scalar property', -> 
        # '.#width'
        expect(propInfo.propertyType('border-top-width')).toEqual 'scalar'

      it 'correctly classifies regex specified color property', -> 
        # '.*color'
        expect(propInfo.propertyType('border-top-color')).toEqual 'color'

    describe '#discreteOptions()', -> 

      it 'returns string specified options', -> 
        options = propInfo.discreteOptions('clear')
        options.sort()
        expect(options).toEqual ['both', 'inherit', 'initial', 'left', 'none', 'right' ]

      it 'returns regex specified options', -> 
        # 'background-(clip|origin)
        options = propInfo.discreteOptions('background-clip')
        options.sort()
        expect(options).toEqual ['border-box', 'content-box', 'inherit', 'initial', 'padding-box']

    describe '#scalarUnits()', -> 

      it 'returns regex specified options', -> 
        # '.*width'
        units = propInfo.scalarUnits('border-left-width')
        units.sort()
        expect(units).toEqual ['%', 'em', 'px']

