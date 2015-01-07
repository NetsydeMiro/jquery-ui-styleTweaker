---
layout: default
---

Attach StyleTweaker to a container to fill it with controls with which you can adjust an html element.

{% include jsLoadWrap.html snippet='samples/default.js' %}
{% include jsSampleWrap.html snippet='samples/default.js' %}
{% include samples/default.html %}

By default, StyleTweaker lists all calculated CSS properties of the target element.  

## Specifying CSS properties

To focus on only properties of interest you can specify them via regular expression.

{% include jsSampleWrap.html snippet='samples/specify_properties_regex.js' %}
{% include jsLoadWrap.html snippet='samples/specify_properties_regex.js' %}
{% include samples/specify_properties.html %}

If more control is required, a predicate function can also be used.  The following would list all font related properties, excluding webkit specific extensions.

{% include jsSampleWrap.html snippet='samples/specify_properties_predicate.js' %}

## Change Event

Custom change event processing can be accomplished by hooking into styleTweaker's change event. 

{% include jsSampleWrap.html snippet='samples/custom_change_constructor.js' %}
{% include jsLoadWrap.html snippet='samples/custom_change_constructor.js' %}
{% include samples/custom_change.html %}

An existing StyleTweaker instance's change event can be tapped by using jQuery's ```bind``` formalism.

{% include jsSampleWrap.html snippet='samples/custom_change_bind.js' %}

## Customizing Tweaker HTML

It's easy to customize the html used by tweaker by passing in string options.  Property name and value are autofilled into ${property} and ${value} placeholders.

{% include jsLoadWrap.html snippet='samples/custom_html.js' %}
{% include jsSampleWrap.html snippet='samples/custom_html.js' %}
{% include samples/custom_html.html %}

The default HTML used by StyleTweaker is: 

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

The following overrides StyleTweaker's default input rendering for color properties, and uses the excellent [Spectrum plugin](https://bgrins.github.io/spectrum/).

{% include jsLoadWrap.html snippet='samples/custom_controls.js' %}
{% include jsSampleWrap.html snippet='samples/custom_controls.js' %}
{% include samples/custom_controls.html %}

The data argument passed to the ```inputcreated``` handler is: 

{% highlight javascript %}

  data: {
    tweaker,            // the styleTweaker instance
    $parentControl,     // the input's jQuery wrapped container
    $input,             // jQuery wrapped input
    cssPropertyType,  
    cssPropertyName,
    cssPropertyValue,
    cssPropertyOptions  // discrete property's possible values or
  }                     // scalar property's possible units

{% endhighlight %}

## More On StyleTweaker

Code [lives here](https://github.com/NetsydeMiro/jquery-ui-styleTweaker).

Tests [run here]({{site.baseurl}}/tests/).

Builds [execute here](https://travis-ci.org/NetsydeMiro/jquery-ui-styleTweaker).

