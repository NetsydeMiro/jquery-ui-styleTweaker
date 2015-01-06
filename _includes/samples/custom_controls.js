$('#tweaker-custom-controls').styleTweaker({
  targetSelector: '#target-custom-controls', 
  propertyFilter: '.*color',
  createInput: function(type, name, value, options, container){
    if (type == 'color'){
      var textInput = this._createTextInput(type, name, value, options);
      textInput.spectrum({appendTo: container});
      return textInput;
    }
    else
      return this._createInput(type, name, value, options);  
  }
});
