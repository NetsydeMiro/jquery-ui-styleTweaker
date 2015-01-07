$('#tweaker-specify-properties').styleTweaker({
  targetSelector: '#target-specify-properties', 
  propertyFilter: function(property){
    return property.indexOf('font') >= 0 && 
      property.indexOf('webkit') == -1;
  }
});
