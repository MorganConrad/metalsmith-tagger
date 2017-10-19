[![Build Status](https://secure.travis-ci.org/MorganConrad/metalsmith-tagger.png)](http://travis-ci.org/MorganConrad/metalsmith-tagger)
[![License](http://img.shields.io/badge/license-MIT-A31F34.svg)](https://github.com/MorganConrad/metalsmith-tagger)
[![NPM Downloads](http://img.shields.io/npm/dm/metalsmith-tagger.svg)](https://www.npmjs.org/package/metalsmith-tagger)
[![Known Vulnerabilities](https://snyk.io/test/github/morganconrad/metalsmith-tagger/badge.svg)](https://snyk.io/test/github/morganconrad/metalsmith-tagger)
[![Coverage Status](https://coveralls.io/repos/github/MorganConrad/metalsmith-tagger/badge.svg)](https://coveralls.io/github/MorganConrad/metalsmith-tagger)
# metalsmith-tagger
A [Metalsmith](http://www.metalsmith.io/) plugin to read tags for your posts, clean them up, place them back into your file object, and build a cross-reference file, for later use by your templater in creating a "tag-cloud".

Similar in goals to [metalsmith-tags](https://www.npmjs.com/package/metalsmith-tags), but,
instead of building many many static pages for the various tags and links to them, it builds
a single cross reference file, and places the tags within the file object.  You must followup with your preferred templater.

A typical followup would be to use server side Javascript to show / hide relevant tags.  Demo included.
If you wish, you could use the cross reference to create your own static pages.

## Why?

Works with any template engine.  metalsmith-tags seemed pretty tied to handlebars.

You can cross reference multiple "tags", e.g. "tag" and "author", by using tagger twice.
Your server side JavaScript could show/hide multiple tags.  See demo.

### In your pages:

```
---
title: This is page with tags
tags: tagged, page, metalsmith, plugin
authors: ["Issac Newton", "Niels Bohr"]  // also accepts an array
---

Hello World...
```

### In your `build.js`

```
.use(tagger())        // creates cross-ref tags_cloud.html
.use(tagger({
   handle: "authors"  // creates authors_cloud.html
   }))
```


### Options

|Option | Default | Notes |
|:------|:--------|:------|
|handle        | "tags"                 | YAML key in source that holds the tags |
|cleanupFn     | `(tag) => tag`         | function to run on tag names after `trim()`, default does nothing |
|cleanHandle   | handle                 | where to put the cleaned up tag info |
|path          | handle + "_cloud.html" | filename for the xref file |
|YAML          | { }                    | additional YAML for the xref file (e.g. `{ layout: xxx.ms }` ) |
|delimiter     | ","                    | delimiter to split tags
|contentString | ""                     | used for the file's contentString Buffer |
|fileFilter    | null                   | <a href="#fileFilter">see options.fileFilter below</a> |
|postProcess   | function() { }         | <a href="#postProcess">post processing, see below</a>


<h4 id="contentString">options.fileFilter</h4>
determines which files will be included
 - if missing, include all files.
 - if a string or Regex, only include matching filePaths.
 - if a user-provided-function, include the file when `filter(filePath, data, metalsmith)` returns true.  
 _e.g._ If you want to use [multimatch](https://www.npmjs.com/package/multimatch), pass something like `function(filePath) { return multimatch([filePath], ["blogs/**", ...])[0] };`

<h4 id="postProcess">options.postProcess</h4>
If present, when all done you may do your own tweaking and post processing, by providing a function
```
options.postProcess(file, options, files, metalsmith);
```


### An annotated Cross-Reference File Example
We had a bunch of posts, with "author" and "album" information, about Beatles songs.

```
{
   handles: [ 'author', 'album' ],  // what we cross referenced
   layout: 'someLayout.ms',
   path: 'somePath.html',
   contents: Buffer [...],
   author: {      // cross referenced by author
      map: {      // author -> post
         Lennon: [ 'posts/Baby Youre a Rich Man.html', 'posts/Because.html' ],
         McCartney: [ 'posts/Baby Youre a Rich Man.html','posts/All My Loving.html' ],
         Berry: [ 'posts/Roll Over Beethoven.html' ],
         Harrison: [ 'posts/Something.html' ]
      },
      array: [     // sorted by count.  Needed cause some template engines don't handle maps
         { id: 'Lennon', files: [ 'posts/Baby Youre a Rich Man.html', 'posts/Because.html' ], count: 2 },
         { id: 'McCartney', files: [ 'posts/Baby Youre a Rich Man.html','posts/All My Loving.html' ],count: 2 },
         { id: 'Berry', files: [ 'posts/Roll Over Beethoven.html' ], count: 1 },
         { id: 'Harrison', files: [ 'posts/Something.html' ], count: 1 }
         ],
      count: 6     // total count of author tags
   },
   album: {        // cross referenced by author
      map: {       // **album** -> post
         'Magical Mystery Tour': [ 'posts/Baby Youre a Rich Man.html' ],
         'With the Beatles': [ 'posts/All My Loving.html', 'posts/Roll Over Beethoven.html' ],
         'Meet the Beatles!': [ 'posts/All My Loving.html' ],
         'Abbey Road': [ 'posts/Because.html', 'posts/Something.html' ],
         'The Beatles 2nd Album': [ 'posts/Roll Over Beethoven.html' ]
      },
      array: [     // sorted by count
         { id: 'With the Beatles', files: [ 'posts/All My Loving.html', 'posts/Roll Over Beethoven.html' ], count: 2 },
         { id: 'Abbey Road', files: [ 'posts/Because.html', 'posts/Something.html' ], count: 2 },
         { id: 'Magical Mystery Tour', files: [ 'posts/Baby Youre a Rich Man.html' ], count: 1 },
         { id: 'Meet the Beatles!', files: [ 'posts/All My Loving.html' ], count: 1 },
         { id: 'The Beatles 2nd Album', files: [ 'posts/Roll Over Beethoven.html' ], count: 1 }
      ],
      count: 7      // total count of album tags
   }
}
```


### Notes, Todos, and Caveats

In the example above, the original files would have their tags (options.handle) property replaced by a nice cleaned up **array**, e.g.

`tags: [ 'foo', 'bar1', 'baz1' ],`

If you don't want to overwrite the original tags, set `options.cleanHandle` and the array goes there.
