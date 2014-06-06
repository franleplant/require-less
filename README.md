require-less
============

**Work In Progress**

Browserify transform to `require('file.less')`


### Whats different about this Browserify less transform?

The rest of Css and Less Browserify transforms point
to appending the CSS into the head as a Style element.


This transform will generate a single separate file `compiled.css` that will
contain the compiled content of all the `.less` files and their dependencies.


So

`index.js`

```javascript
require('./style.less')
```

will generate a separate bundle file `compiled.css`
```css
/* style.less compiled styles */
```


It works with a combinations of js `require` and less `@import`






## Test it!

```bash

cd path/to/repo/root
npm test

```


## API

### `rl = require_less(options)`

It will return a transform function set properly, ready to be used by browserify

```javascript
browserify(browserify_opts)
	.transform(rl);
```


#### `options.pipe`

This attribute provides an interface to deal with the css stream as you will regularly do with `read_stream.pipe(transform_stream);`.
The pipe array will be executed in order in the following way:
`css_stream.pipe(pipe[0]).pipe(pipe[1])....pipe(pipe[n]);`

Example
```javascript
var gulp = require('gulp');
var source = require('vinyl-source-stream');


var rl = require('require-less')({
		pipe: [
			source('bundle.css'), 
			gulp.dest('./test')
		]
	});
```


In the preciding example the `vinyl-source-stream` library is being used to turn 
the regular stream to something gulp can handle and then just runing a very 
common and regular gulp task. This shows that with this pipe attribute you will 
be able to do what you regularly will do with your css stream, so it should have
 no cap to the things you can accomplish.



#### `options.cb`

Provide a callback that will be executed at the end of the stream transform process.



## Thanks to

The following are links to sources of inspiration and conflict solving when I was
working on this Transform. I have copied pieces of code from them so they are 
contributors.

- https://github.com/plus3network/gulp-less/
- https://github.com/wilson428/node-lessify
- https://github.com/davidguttman/cssify