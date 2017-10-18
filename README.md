[![Build Status](https://secure.travis-ci.org/MorganConrad/metalsmith-tagger.png)](http://travis-ci.org/MorganConrad/metalsmith-tagger)
[![License](http://img.shields.io/badge/license-MIT-A31F34.svg)](https://github.com/MorganConrad/metalsmith-tagger)
[![NPM Downloads](http://img.shields.io/npm/dm/metalsmith-tagger.svg)](https://www.npmjs.org/package/metalsmith-tagger)
[![Known Vulnerabilities](https://snyk.io/test/github/morganconrad/metalsmith-tagger/badge.svg)](https://snyk.io/test/github/morganconrad/metalsmith-tagger)
[![Coverage Status](https://coveralls.io/repos/github/MorganConrad/metalsmith-tagger/badge.svg)](https://coveralls.io/github/MorganConrad/metalsmith-tagger)
# metalsmith-tagger
A [Metalsmith](http://www.metalsmith.io/) plugin to read tags for your posts, build a cross-reference,
and place these tags into your file object for later use by your templater.

Similar in goals to [metalsmith-tags](https://www.npmjs.com/package/metalsmith-tags), but,
instead of building many many static pages for the various tags and links to them, it builds
a single cross reference file, and places the tags within the file object for later use by your templater.

You must then use server side Javascript to show / hide relevant tags.  Demo included.

## Why?

Works with any template engine.  metalsmith-tags seemed pretty tied to handlebars.

You can have multiple tag classes, e.g. a normal "tag" and an "author" tag.

## In your pages:

```
---
title: This is page with tags
tags: tagged, page, metalsmith, plugin
orTags: [tagged, page, metalsmith, plugin]  // also accepts an array
---

Hello World...
```

### Usage

Javascript:  `use(tagger(options))`

CLI: You lose a few options since it can't support functions.

### Options

|Option | Default | Notes |
|:------|:--------|:------|
|handle       | "tags"           | YAML key in source that holds the tags |
|cleanupFn    | null             | function to run on tag names after `trim()`, default = `function(s) { return s; }` |
|cleanHandle  | handle           | where to put the cleaned up tag info |
|fileFilter   | null             | see below |
|path         | handle + "_cloud.html" | filename for the xref file,
"." means don't |
|YAML         | { }              | additional YAML for the xref file |
|contentString| JSON.stringify() | you must have contentString for layout() to work... |


**options.filter** determines which files will be included
 - if missing, include all files.
 - if a string or Regex, only include matching filePaths.
 - if a user-provided-function, include the file when `filter(filePath, data, metalsmith)` returns true.  
 _e.g._ If you want to use [multimatch](https://www.npmjs.com/package/multimatch), pass something like `function(filePath) { return multimatch([filePath], ["blogs/**", ...])[0] };`


### Notes, Todos, and Caveats
