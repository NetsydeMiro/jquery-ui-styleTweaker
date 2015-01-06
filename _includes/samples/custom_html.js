$('#tweaker-custom-html').styleTweaker({
  targetSelector: '#target-custom-html', 
  propertyFilter: '^opacity$',
  html: {
    label: "<label for='tweak-${property}'>Contrast</label>", 
    textInput: "<input type='range' min='0' max='1' step='0.1' \
      id='tweak-${property}' value='${value}' >"
  }
});
