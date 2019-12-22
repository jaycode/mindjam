# MindJam

Jamming with multiple minds through Muse 2 headband!

## Development

MindJam uses `browserify` and `watchify` node modules to update and track node code into javascripts. Install them globally in your computer with the following commands:

```
npm install -g browserify watchify
```

Prior to developing the code, run the following code:

```
watchify main.js -o bundle.js -v
```

Any update to `main.js` will be merged with any imported modules over to `bundle.js`. Once the `bundle.js` is ready for production, run the following code to minify and obscure the code:

```
browserify main.js | uglifyjs > bundle.js
```

