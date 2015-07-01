# Owl Carousel v1 Pseudo-Plugins

Enables the creation of plugins for [Owl Carousel v1](https://github.com/OwlFonk/OwlCarousel) by hooking into its event callbacks. May be used as a general guide for creating extensions for Javascript libraries that do not have plugin APIs.

## Authorship

Written by [Geoffrey Roberts](mailto:g.roberts@blackicemedia.com)

## License

MIT

## Features

* Allows Owl Carousel v1 to be extended in a modular fashion
* Supports reusable functions on a per-plugin basis

## Requirements

* jQuery
* Owl Carousel

## Installation

In the `<head>` of your page, after you set up your jQuery and Owl Carousel `<script>` items, add the following:

```html
<script type="text/javascript" src="owlcarousel-plugin.js"></script>
```

## Usage

To use this plugin architecture properly, you need to define your initial settings as an object, apply your plugins in turn to the settings, and then initialise Owl Carousel with those settings.

```javascript
var settings = {};			
PluginA.applyTo(settings);
PluginB.applyTo(settings);
// ...
PluginX.applyTo(settings);
$(".owl-carousel").owlCarousel(settings);
```

Each of the plugins here has been created by creating a new `OwlPlugins.plugin` object.

The definition of OwlPlugins.plugin is as follows:

```javascript
var plugin = new OwlPlugins.plugin(callbackMap, reusableFunctions);
```

`callbackMap` represents a map (as a Javascript object) of callbacks that map to Owl Carousel events, such as `afterInit`, `afterUpdate` and so on. A callback can be a function, a name of a reusable function (we'll get to that soon), or an array of a mix of the two.

`reusableFunctions` is a map (as a Javascript object) of names of reusable functions to said functions. Keep in mind that you can do nested maps as long as your maps are always Javascript objects, and you call them using dot-separated strings eg. `foo.bar.baz`.

### Example

Let's define a simple plugin. It will contain do several things:

* After the carousel is initialised:
  * it will turn the `#debug` element green and pad it out a bit.
  * it will set the text of `#debug` to the combined text in each visible item in the carousel.
* Every time the carousel moves:
  * it will set the text of `#debug` to the combined text in each visible item in the carousel.

```javascript
var MyOwlCarouselPlugin = new OwlPlugins.plugin({
	afterInit: [
		function(){
			$('#debug').css({
				backgroundColor: '#cfc',
				padding: '1em'
			});
		},
		'updateDebug'
	],
	afterMove: 'updateDebug'
}, {
	updateDebug: function(){
		$('#debug').text("");
		for (var i = 0; i < this.visibleItems.length; i++) {
			var index = this.visibleItems[i],
			activeItem = this.$userItems[index];
			$('#debug').append($(activeItem).text());
		}
	}
});
```

Note how we've used a reusable function in our definition.

Now, we can apply our new plugin to the Owl Carousel object.

```javascript
var settings = {};			
MyOwlCarouselPlugin.applyTo(settings);
$(".owl-carousel").owlCarousel(settings);
```

## Changelog

### v0.1.2

Fixed bug in variable naming

### v0.1.1

Added support for scoped reusables

### v0.1

Initial commit

## Caveats

Current implementation risks hitting the browser's Javascript stack depth limit if you add too many plugins.