require-less
============

Browserify transform to `require('file.less')`


### Whats different about this Browserify less transform?

The rest of Css and Less Browserify transforms point
to appending the CSS into the head as a Style element.

I think that this approach is no good, and I was looking for
a transform that does not create a `<style>` tag dynamically
but to create a `compiled.css` bundle with all the `.less` files
being called throughout the Browserify modules and its dependencies.

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