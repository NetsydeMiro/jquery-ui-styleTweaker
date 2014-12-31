$.widget('netsyde.styleTweaker', {

  // default options
  options: {
    targetSelector: 'body',
    propertyFilter: '.*',

    html: {
      control:  "<div class='tweaker-control tweak-${property}'></div>", 
      label:    "<label for='tweak-${property}'>${property}</label>", 
      text:     "<input id='tweak-${property}' type='text' value='${value}' >", 
      select:   "<select id='tweak-${property}'></select>", 
      option:   "<option value='${value}'>${value}</option>"  
    },

    inputBuilders: {

      get: function(property) {
        var specificMatch = this[property], 
            generalMatch = null, 
            key; 

        for (key in this){
          if (property.match(new RegExp(key)) !== null){
            generalMatch =  this[key];
            break;
          }
        }

        if (specificMatch !== null && generalMatch !== null)
          return $.extend(true, {}, generalMatch, specificMatch);
        else if (specificMatch !== null)
          return specificMatch;
        else if (generalMatch !== null)
          return generalMatch;
        else
          return null;
      }, 

      standardActivate: standardActivate =  function(input, changeHandler, activateArgs){
                                              $(input).change(function(){
                                                changeHandler($(input).val());
                                              });
                                            }, 

      standardText: standardText = 
      {
        create:   function(property, value, createArgs){
                    return $(this._formatHtml(this.options.html.text, {property: property, value: value}));
                  }, 
        activate: standardActivate
      },

      standardSelect: standardSelect = 
      {
        create:   function(property, value, createArgs){
                    var select = $(this._formatHtml(this.options.html.select, {property: property, value: value}));
                    for(var optionIndex in createArgs.options){
                      $(this._formatHtml(this.options.html.option, {value: createArgs.options[optionIndex]})).appendTo(select);
                    }
                    select.find("option[value='" + value + "']").attr("selected", "selected");
                    return select;
                  },
        activate: standardActivate
      }, 

      makeSelect: makeSelect = function(){ 
        var argsArray = $.makeArray(arguments);
        return $.extend({}, standardSelect, 
            {createArgs: {options: argsArray.concat(['initial', 'inherit'])}});
      }, 

      'align-content': makeSelect('stretch', 'center', 'flex-start', 'flex-end',
          'space-between', 'space-around'), 

      'align-(items|self)': makeSelect('stretch', 'center', 'flex-start', 'flex-end', 'baseline'), 

      'alignment-baseline': makeSelect('auto', 'baseline', 'use-script', 
          'before-edge', 'text-before-edge', 'after-edge', 'text-after-edge', 
          'central', 'middle', 'ideographic', 'alphabetic', 'hanging', 'mathematical'), 

      'background-attachment': makeSelect('scroll', 'fixed', 'local'), 

      'background-repeat': makeSelect('repeat', 'repeat-x', 'repeat-y', 'no-repeat'),

      'background-(clip|origin)': makeSelect('border-box', 'padding-box', 'content-box'), 

      'border-collapse': makeSelect('separate', 'collapse'), 

      'border-image-repeat': makeSelect('stretch', 'repeat', 'round', 'space', 
          'initial', 'inherit'), 

      'border.*style': makeSelect('none', 'hidden', 'dotted', 'dashed', 'solid', 
          'double', 'groove', 'ridge', 'inset', 'outset'), 

      'caption-side': makeSelect('top', 'bottom'), 

      'clear': makeSelect('none', 'left', 'right', 'both')
    }
  },

  _create: function() {

    var panel = this.element.addClass('tweaker-panel');
    this.target = $(this.options.targetSelector);

    this.propertyFilterFunction = this._getPropertyFilterFunction(this.options.propertyFilter);

    var properties = this._getProperties(this.target[0]),
        propIndex, propName, propValue, 
        control, inputId, label, input;

    for (propIndex in properties){

      property = properties[propIndex][0];
      value = properties[propIndex][1];

      control = this._createControl(property).appendTo(panel);
      control.append(this._createLabel(property));

      var builder = (customBuilder = this.options.inputBuilders.get(property)) ? 
        customBuilder : this.options.inputBuilders.standardText; 

        input = builder.create.call(this, property, value, builder.createArgs).appendTo(control);
        builder.activate.call(this, input, this._standardChangeHandler(this.target[0], property), builder.activateArgs);
    }
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

  _getPropertyFilterFunction: function(propertyFilter){
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
    return $(this._formatHtml(this.options.html.control, {property: property}));
  }, 

  _createLabel: function (property) {
    return $(this._formatHtml(this.options.html.label, {property: property}));
  }, 

  _standardChangeHandler: function(target, property){
      return function(value){
        $(target).css(property, value); 
        this._trigger('change', null, {property: property, value: value});
      }.bind(this);
  }, 

  _getCssPropertyNames: function(element){
    var computedStyles = document.defaultView.getComputedStyle(element);

    var cssPropertyNames = Object.keys(computedStyles).
      filter(function(key){return !isNaN(parseInt(key));}).
      map(function(key){return computedStyles[key];});

    return cssPropertyNames.sort();
  }, 

  _getJsPropertyName: __getJsPropertyName = function(cssPropertyName){
    return cssPropertyName.replace(/\-(.)/g, function(match, p1){return p1.toUpperCase();});
  }, 

  _getCssPropertyValues: function(element, cssPropertyNames){
    var computedStyles = document.defaultView.getComputedStyle(element);
    var propertyValues = {};

    // css property values are stored by their JS property name
    cssPropertyNames.forEach(function(name){
      propertyValues[name] = computedStyles[__getJsPropertyName(name)];
    });

    return propertyValues;
  },

  // deprecate
  _getProperties: function(element){
    var properties = [],
        propertyBag = document.defaultView.getComputedStyle(element), 
        key, cssPropertyName, jsPropertyName;

    for (key in propertyBag){
      if (!isNaN(parseInt(key))){
        // numeric keys have cssPropertyNames as values
        cssPropertyName = propertyBag[key];
        
        if (this.propertyFilterFunction(cssPropertyName)){
          // jsPropertyName keys have the actual property values
          jsPropertyName = this._jsPropertyName(cssPropertyName);
          // we want to format our properties as 
          // [[property1, value1], [property2, value2], ...]
          // so that we can render in alphabetical order
          properties.push([cssPropertyName, propertyBag[jsPropertyName]]);
        }
      }
    }

    properties.sort(function(a,b){return a[0] < b[0] ? -1 : 1;});
    return properties;
  }, 

  _formatHtml: function(html, params){
    for(var paramName in params)
      html = html.replace(new RegExp('\\${' + paramName + '}', 'g'), params[paramName]);

    return html;
  },

  // deprecate with above
  _jsPropertyName: function(cssPropertyName){
    return cssPropertyName.replace(/\-(.)/g, function(match, p1){return p1.toUpperCase();});
  }

});
