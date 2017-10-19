var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var collections = require('metalsmith-collections');
var excerpts = require('metalsmith-excerpts');
var cpR = require('metalsmith-cp-r');
var tagger = require('../tagger.js');  // TODO
var inspect = require('metalsmith-inspect');

var ms = metalsmith(__dirname)
  .metadata({
    site: {
      name: 'Demo of Tagger',
      description: "Tagger Demo Website"
    }
  })
  .source('src')
  .destination('dist')
   .use(collections({
     projects: {
        pattern: 'projects/*.md',
        sortBy: 'date',
        reverse: true
     },
   }))
   .use(markdown())
   .use(excerpts())
   .use(collections({
      posts: {
        pattern: 'posts/**.html',
        sortBy: 'publishDate',
        reverse: true
     }
   }))
   .use(tagger( {
      handle: "author",
      YAML : { layout: "tagcloud.ms" },
      path : "index.html",
   }))
   .use(tagger( {
      handle: "album",
      path : "index.html",
   }))
   //.use(inspect({ printfn : function(x) { console.dir(x, {depth:99}) } , exclude: ['next','previous', 'stat']}))
   .use(layouts({
             engine: 'mustache',
             directory: 'layouts',
             default: 'page.ms',
             partials: "layouts/partials"
         }))
  .use(cpR()); // end of constructor


  ms.build(function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(root + ' built!');
    }
  });
