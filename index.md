---
layout: default
---

Attach StyleTweaker to a container to fill it with controls with which you can adjust an html element.

{% include jsLoadWrap.html snippet='samples/default.js' %}
{% include jsSampleWrap.html snippet='samples/default.js' %}
{% include samples/default.html %}

## Specifying CSS properties

By default, StyleTweaker lists all calculated CSS properties of the target element.  

{% include samples/specify_properties.html %}

To focus users on properties of interest you can specify them via regular expression or a predicate function.

### Regular Expression

{% include jsLoadWrap.html snippet='samples/specify_properties_regex.js' %}
{% include jsSampleWrap.html snippet='samples/specify_properties_regex.js' %}
{% include samples/specify_properties_regex.html %}

### Predicate Function

{% include jsLoadWrap.html snippet='samples/specify_properties_predicate.js' %}
{% include jsSampleWrap.html snippet='samples/specify_properties_predicate.js' %}
{% include samples/specify_properties_predicate.html %}

## Customizing Tweaker HTML

It's easy to customize the html used by tweaker by passing in string options.  Property name and value are autofilled into ${property} and ${value} placeholders.

{% include jsLoadWrap.html snippet='samples/custom_html.js' %}
{% include jsSampleWrap.html snippet='samples/custom_html.js' %}
{% include samples/custom_html.html %}

Default html is: 

{% highlight javascript %}

  html: {
    control:      "<div class='tweaker-control tweak-${property}'></div>", 
    label:        "<label for='tweak-${property}'>${property}</label>", 
    textInput:    "<input id='tweak-${property}' type='text' value='${value}' >", 
    selectInput:  "<select id='tweak-${property}'></select>", 
    selectOption: "<option value='${value}'>${value}</option>"  
  }

{% endhighlight %}

## Customizing Controls

For more fine-grained customization, you can hook into the ```inputcreated``` event to tinker with 
the jQuery control that was created.

{% include jsLoadWrap.html snippet='samples/custom_controls.js' %}
{% include jsSampleWrap.html snippet='samples/custom_controls.js' %}
{% include samples/custom_controls.html %}

The data argument passed to the event is: 

{% highlight javascript %}

  data: {
    tweaker,            // the styleTweaker instance
    $parentControl,     // the input's jQuery wrapped container
    $input,             // jQuery wrapped input
    cssPropertyType,  
    cssPropertyName,
    cssPropertyValue,
    cssPropertyOptions  // discrete property's possible values or
                        // scalar property's possible units
  }

{% endhighlight %}
