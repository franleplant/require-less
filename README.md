require-less
============

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

**Work In Progress**




Test it!

```bash

npm test

```