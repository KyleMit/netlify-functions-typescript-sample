# Repro of TS Function Error

> TypeError: Cannot destructure property 'inputs' of '(intermediate value)' as it is undefined.

## Solution

Update `netlify.toml` with:

```ini
[functions]
  directory = "functions"
```

or remove the trailing slash

```diff
  [dev]
-   functions = "functions/"
+   functions = "functions"
```

## Steps to Repro

1. Run `netlify dev`
2. Navigate to `http://localhost:8888/.netlify/functions/hello`

## Versions

```bash
$ netlify --version
netlify-cli/9.8.3 win32-x64 node-v16.14.0

$ node --version
v16.14.0

$ tsc --version
Version 4.5.5
```

## Netlify Dev Output

```bash
kylemit@kylemit-xps-17 MINGW64 ~/Documents/code/samples/netlify-functions-typescript-sample (main)
$ netlify dev
◈ Netlify Dev ◈
◈ Ignored general context env var: LANG (defined in process)
◈ No app server detected. Using simple static server
◈ Unable to determine public folder to serve files from. Using current working directory
◈ Setup a netlify.toml file with a [dev] section to specify your dev server settings.
◈ See docs at: https://cli.netlify.com/netlify-dev#project-detection
◈ Running static server from "netlify-functions-typescript-sample"
Request from ::1: GET /.netlify/functions/hello
TypeError: Cannot destructure property 'inputs' of '(intermediate value)' as it is undefined.
    at buildFunction (C:\Users\kylemit\AppData\Roaming\nvm\v16.14.0\node_modules\netlify-cli\src\lib\functions\runtimes\js\builders\zisi.js:39:5)
    at NetlifyFunction.build (C:\Users\kylemit\AppData\Roaming\nvm\v16.14.0\node_modules\netlify-cli\src\lib\functions\netlify-function.js:88:52)
    at FunctionsRegistry.buildFunctionAndWatchFiles (C:\Users\kylemit\AppData\Roaming\nvm\v16.14.0\node_modules\netlify-cli\src\lib\functions\registry.js:72:38)
TypeError: Cannot destructure property 'inputs' of '(intermediate value)' as it is undefined.
    at buildFunction (C:\Users\kylemit\AppData\Roaming\nvm\v16.14.0\node_modules\netlify-cli\src\lib\functions\runtimes\js\builders\zisi.js:39:5)
    at NetlifyFunction.build (C:\Users\kylemit\AppData\Roaming\nvm\v16.14.0\node_modules\netlify-cli\src\lib\functions\netlify-function.js:88:52)
    at FunctionsRegistry.buildFunctionAndWatchFiles (C:\Users\kylemit\AppData\Roaming\nvm\v16.14.0\node_modules\netlify-cli\src\lib\functions\registry.js:72:38)

C:\Users\kylemit\AppData\Roaming\nvm\v16.14.0\node_modules\netlify-cli\node_modules\netlify-redirector\lib\redirects.js:116
      throw ex;
      ^
abort({}) at Error:
    at jsStackTrace (C:\Users\kylemit\AppData\Roaming\nvm\v16.14.0\node_modules\netlify-cli\node_modules\netlify-redirector\lib\redirects.js:1070:13)
    at stackTrace (C:\Users\kylemit\AppData\Roaming\nvm\v16.14.0\node_modules\netlify-cli\node_modules\netlify-redirector\lib\redirects.js:1087:12)
    at process.abort (C:\Users\kylemit\AppData\Roaming\nvm\v16.14.0\node_modules\netlify-cli\node_modules\netlify-redirector\lib\redirects.js:8502:44)
    at process.emit (node:events:520:28)
    at process.emit (C:\Users\kylemit\AppData\Roaming\nvm\v16.14.0\node_modules\netlify-cli\node_modules\source-map-support\source-map-support.js:516:21)    at emit (node:internal/process/promises:133:20)
    at processPromiseRejections (node:internal/process/promises:260:27)
    at processTicksAndRejections (node:internal/process/task_queues:97:32)
(Use `node --trace-uncaught ...` to show where the exception was thrown)
```

## Thrown Line - zisi.js:39

```js
// If we have a function at `functions/my-func/index.js` and we pass
// that path to `zipFunction`, it will lack the context of the whole
// functions directory and will infer the name of the function to be
// `index`, not `my-func`. Instead, we need to pass the directory of
// the function. The exception is when the function is a file at the
// root of the functions directory (e.g. `functions/my-func.js`). In
// this case, we use `mainFile` as the function path of `zipFunction`.
const entryPath = functionDirectory === directory ? func.mainFile : functionDirectory
const {
  inputs,
  path: functionPath,
  schedule,
} = await memoizedBuild({
  cache,
  cacheKey: `zisi-${entryPath}`,
  command: () => zipFunction(entryPath, targetDirectory, zipOptions),
})
```
