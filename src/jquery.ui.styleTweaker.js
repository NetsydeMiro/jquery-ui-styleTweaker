$.widget('netsyde.styleTweaker', {

  options: {
    targetSelector: 'body',
    propertyFilter: '.*',

    html: {
      control:  "<div class='tweaker-control tweak-${property}'></div>", 
      label:    "<label for='tweak-${property}'>${property}</label>", 
      textInput:     "<input id='tweak-${property}' type='text' value='${value}' >", 
      selectInput:   "<select id='tweak-${property}'></select>", 
      selectOption:   "<option value='${value}'>${value}</option>"  
    },

    // can override creation of inputs:
    // cssPropertyType can be: bool|color|scalar|discrete|other
    // discreteOptions will be array of acceptable discrete options 
    // eg. ['left', 'right', 'both']
    // input must be jQuery wrapped input with a val() getter/setter and change() event hook
    // TODO: enable so that user can supply function, but defer to default if a paramter isn't of interest
    // (primarily cssPropertyType & Name I believe, but could also check for values and options
    createInput: function(cssPropertyType, cssPropertyName, cssPropertyValue, options){
      var input;

      switch (cssPropertyType){
        case 'scalar': 
        case 'color': 
        case 'dimension': 
        case 'other': 
          input = this._createTextInput(cssPropertyName, cssPropertyValue);
          break;
        case 'discrete': 
          input = this._createSelectInput(cssPropertyName, cssPropertyValue, options);
          break;
      }

      return input;
    }, 
  }, 

  _create: function() {

    var panel = this.element.addClass('tweaker-panel');
    this.target = $(this.options.targetSelector);

    var propertyPredicate = this._getPropertyPredicate(this.options.propertyFilter);

    var properties = this._getCssPropertyNames(this.target[0]).filter(propertyPredicate);
    var values = this._getCssPropertyValues(this.target[0], properties);
    
    var propIndex, propertyType, propertyName, propertyValue, control, inputId, label, input, propertyOptions = null;

    for (propIndex in properties){

      propertyName = properties[propIndex];
      propertyValue = values[propertyName];
      propertyType = this._cssPropertyInfo.propertyType(propertyName);

      control = this._createControl(propertyName).appendTo(panel);
      control.append(this._createLabel(propertyName));

      switch (propertyType){
        case 'discrete':
          propertyOptions = this._cssPropertyInfo.discreteOptions(propertyName);
          break;
        case 'scalar':
          propertyOptions = this._cssPropertyInfo.scalarUnits(propertyName);
          break;
      }

      input = this.options.createInput.call(this, propertyType, propertyName, propertyValue, propertyOptions);

      // TODO: trigger events here, and check if they're cancelled
      input.change(this._getChangeHandler(this, propertyName, $(input)));

      control.append(input);
    }
  }, 

  _getChangeHandler: function(tweaker, propertyName, $input){
    return function(){ tweaker.style(propertyName, $input.val());};
  },

  _createSelectInput: function(property, value, options){
    var select = $(this._fillFormatString(this.options.html.selectInput, {property: property, value: value}));
    for (var i in options)
      select.append($(this._fillFormatString(this.options.html.selectOption, {value: options[i]})));

    select.val(value);

    return select;
  }, 

  _createTextInput: function(property, value){
    return $(this._fillFormatString(this.options.html.textInput, {property: property, value: value}));
  },

  // public accessor for getting/setting styles of target
  style: function(cssPropertyName, propertyValue){
    //getter
    if (!propertyValue)
      return this.target.css(cssPropertyName);
    //setter
    else
      this.target.css(cssPropertyName, propertyValue);
  }, 

  _getPropertyPredicate: function(propertyFilter){
    var fnc;

    switch ($.type(propertyFilter)){
      case 'string': 
        fnc = function(cssPropertyName){
          return cssPropertyName.match(propertyFilter);
        };
        break;
      case 'function': 
        fnc = propertyFilter;
        break;
      default: 
        throw 'option targetSelector must be a regex string or string predicate function';
    }

    return fnc;
  }, 

  _createPanel: function(){
    return $(this.options.html.panel);
  }, 

  _createControl: function(property){
    return $(this._fillFormatString(this.options.html.control, {property: property}));
  }, 

  _createLabel: function (property) {
    return $(this._fillFormatString(this.options.html.label, {property: property}));
  }, 

  _getCssPropertyNames: function(element){
    var computedStyles = document.defaultView.getComputedStyle(element);

    var cssPropertyNames = Object.keys(computedStyles).
      filter(function(key){return !isNaN(parseInt(key));}).
      map(function(key){return computedStyles[key];});

    return cssPropertyNames.sort();
  }, 

  _getJsPropertyName: _getJsPropertyName = function(cssPropertyName){
    return cssPropertyName.replace(/\-(.)/g, function(match, p1){return p1.toUpperCase();});
  }, 

  _getCssPropertyValues: function(element, cssPropertyNames){
    var computedStyles = document.defaultView.getComputedStyle(element);
    var propertyValues = {};

    // css property values are stored by their JS property name
    cssPropertyNames.forEach(function(name){
      propertyValues[name] = computedStyles[_getJsPropertyName(name)];
    });

    return propertyValues;
  },

  _fillFormatString: function(formatString, params){
    var filled = formatString;
    for(var paramName in params)
      filled = filled.replace(new RegExp('\\${' + paramName + '}', 'g'), params[paramName]);

    return filled;
  }, 

  _cssPropertyInfo: new CssPropertyInfo()

});
