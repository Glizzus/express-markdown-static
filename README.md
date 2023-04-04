# Express Markdown Static

Serve static files while also rendering Markdown.

## Installation

`npm install express-markdown-static`

## To use

Register the exported `markdownStatic` RequestHandler.

Parameters:

- baseDir (string) - the base directory to serve static files from

- options (object) - the options to pass to the middleware

    - options.extensions (string[]) - The extensions to be interpreted as markdown.
    Default: `['.md', 'markdown']`

    - options.extensionsRequired (bool) - If false, than files without extensions are interpreted as Markdown.
    Default: `true`

```
import markdownStatic from 'express-markdown-static'

app.get('/docs', markdownStatic('/documentation'))
```
