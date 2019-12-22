



```
browserify main.js -o bundle.js
```

```
watchify main.js -o bundle.js -v
```

For production:

```
browserify main.js | uglifyjs > bundle.js
```