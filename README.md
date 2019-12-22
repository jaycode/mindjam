# MindJam

Jamming with multiple minds through Muse 2 headband!

## Development

MindJam uses `browserify` and `watchify` node modules to update and track node code into javascripts. Install them globally in your computer with the following commands:

```
npm install -g browserify watchify
```

Prior to developing the code, run the following code:

```
browserify main.js -o bundle.js
```

```
watchify main.js -o bundle.js -v
```

And once the `bundle.js` is ready for production, run the following code to minify and obscure the code:

```
browserify main.js | uglifyjs > bundle.js
```

