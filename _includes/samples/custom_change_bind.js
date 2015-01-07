$('#tweaker-custom-change').styleTweaker({
  targetSelector: '#target-custom-change', 
  propertyFilter: 'width'
}).bind('styletweakerchange', function(e, data){
  if (!window.confirm("Are you sure you want to change " + 
      data.cssPropertyName + " to " + 
      data.cssPropertyValue + "?"))
  {
    // reset changed input
    data.tweaker.refreshInput(data.cssPropertyName);
    // cancel event (could also use e.preventDefault())
    return false;
  }
});

