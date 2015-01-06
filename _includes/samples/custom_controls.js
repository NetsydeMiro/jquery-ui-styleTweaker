$('#tweaker-custom-controls').styleTweaker({
  targetSelector: '#target-custom-controls', 
  propertyFilter: '^(?!-webkit).*color$',
  inputcreated: function(e, data){
    if (data.cssPropertyType == 'color'){
      data.$input.spectrum().change(function(e,color){
        data.tweaker.style(data.cssPropertyName, color.toRgbString());
      });
    }
  }
});
