// must be used as constructor, with new keyword
function CssPropertyInfo(){

  if ( !(this instanceof arguments.callee) ) 
     throw new Error("Constructor called as a function");

  // private data variable
  var _cssPropertyTypes = {

    bool: ['accelerator'], 

    // all these also have inherit & initial
    discrete: {
      'align-content': ['stretch', 'center', 'flex-start', 'flex-end', 
        'space-between', 'space-around'], 

      'align-(items|self)': ['stretch', 'center', 'flex-start', 'flex-end', 
        'baseline'], 

      'alignment-baseline': ['auto', 'baseline', 'use-script', 'before-edge', 
        'text-before-edge', 'after-edge', 'text-after-edge', 'central', 
        'middle', 'ideographic', 'alphabetic', 'hanging', 'mathematical'],

      'background-attachment': ['scroll', 'fixed', 'local'], 

      'background-repeat': ['repeat', 'repeat-x', 'repeat-y', 'no-repeat'], 

      'background-(clip|origin)': ['border-box', 'padding-box', 'content-box'], 

      'border-collapse': ['separate', 'collapse'], 

      'border-image-repeat': ['stretch', 'repeat', 'round', 'space'], 

      'border.*style': ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 
        'groove', 'ridge', 'inset', 'outset'], 

      'caption-side': ['top', 'bottom'], 

      'clear': ['none', 'left', 'right', 'both']
    }, 

    scalar: {
      '.*width' : ['px', 'em', '%'], 
      '.*height' : ['px', 'em', '%']
    }, 

    color: ['.*color']

    // others: 
  };

  // private helper functions
  function _doesObjectKeyMatch(obj, inString){
    return _doesArrayItemMatch(Object.keys(obj), inString);
  }

  function _doesArrayItemMatch(arr, inString){
    return arr.some(function(regex){return inString.match(regex);});
  }

  // NOTE: doesn't care whether or not there are multiple matches
  // Up to developer to ensure there are no conflicts
  this.discreteOptions = function(cssPropertyName){
    var matchingProperties = Object.keys(_cssPropertyTypes.discrete).
      filter(function(propRegex){return cssPropertyName.match(propRegex);});

    if (matchingProperties.length > 0)
      return _cssPropertyTypes.discrete[matchingProperties[0]].concat(['initial', 'inherit']);
    else 
      return [];
  };

  // NOTE: doesn't care whether or not there are multiple matches
  // Up to developer to ensure there are no conflicts
  this.scalarUnits = function(cssPropertyName){
    var matchingProperties = Object.keys(_cssPropertyTypes.scalar).
      filter(function(propRegex){return cssPropertyName.match(propRegex);});

    if (matchingProperties.length > 0)
      return _cssPropertyTypes.scalar[matchingProperties[0]];
    else 
      return [];
  };

  // NOTE: this method doesn't care whether or not there are multiple matches
  // Up to developer to ensure there are no data integrity conflicts
  this.propertyType = function(cssPropertyName){
    var propType;
    
    if (_doesObjectKeyMatch(_cssPropertyTypes.discrete, cssPropertyName))
      propType = 'discrete';
    else if (_doesObjectKeyMatch(_cssPropertyTypes.scalar, cssPropertyName))
      propType = 'scalar';
    else if (_doesArrayItemMatch(_cssPropertyTypes.bool, cssPropertyName))
      propType = 'bool';
    else if (_doesArrayItemMatch(_cssPropertyTypes.color, cssPropertyName))
      propType = 'color';
    else
      propType = 'other';

    return propType;
  };
}

