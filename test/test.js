var test = require('tape');
var tagger = require('../tagger.js');

// setup - need to recreate these each time
function createFiles() {
   return {
      "file1.md" : {
         tags: "foo, bar1, baz1",
         altTagsDelimColon: "foo: bar1: baz1",
         altTagsArray: ["foo", "bar1", "baz1"],
         title: "title of file1.md"
      },
      "file2.html" : {
         tags: "foo, bar2, baz2",
         altTagsDelimColon: "foo: bar2: baz2",
         altTagsArray: ["foo", "bar2", "baz2"],
         title: "title of file2.html"
      },
      "file3-no-tags" : {
         title: "title of file3-no-tags"
      }
   }
};

// mock done()and metalsmith
function done(err) { if (err) throw err; }
var mockMetalsmith = {}

function basicTest(t, file, tag) {
   tag = tag || 'tags';
   t.equals(file[tag].map.foo.length, 2);
   t.equals(file[tag].map.bar1.length, 1);
   t.equals(file[tag].array[0].count, 2);
   t.equals(file[tag].array[4].count, 1);
   t.equals(file[tag].count, 6);
}


test('defaults', function(t) {
   var files = createFiles();
   tagger() (files, mockMetalsmith, done);

   basicTest(t, files['tags_cloud.html']);

   t.deepEquals(files['file1.md'].tags, ['foo', 'bar1', 'baz1']);
   t.end();
});

test('altTagsDelimColon', function(t) {
   var files = createFiles();
   tagger({handle: 'altTagsDelimColon', delimiter: ':'}) (files, mockMetalsmith, done);
   basicTest(t, files['altTagsDelimColon_cloud.html'], 'altTagsDelimColon');
   t.end();
});

test('altTagsArray', function(t) {
   var files = createFiles();
   tagger({
      handle: 'altTagsArray'}) (files, mockMetalsmith, done);
   basicTest(t, files['altTagsArray_cloud.html'], 'altTagsArray');
   t.end();
});

test('alternative Paths & cleanHandle', function(t) {
   var files = createFiles();
   tagger( { path: "alt_xref", cleanHandle : "cleanHandle" } )
      (files, mockMetalsmith, done);
   basicTest(t, files['alt_xref']);
   t.deepEquals(files['file1.md'].cleanHandle, ['foo', 'bar1', 'baz1']);

   t.end();
});

test(' add YAML and contentString', function(t) {
   var files = createFiles();
   tagger( { contentString: "Hello World",
             YAML: { YAML : "xref_YAML" ,
                     layout: "xref_layout.ms" },
           } )
      (files, mockMetalsmith, done);
   var tagFile = files['tags_cloud.html'];
   basicTest(t, tagFile);
   t.equals(tagFile.YAML, 'xref_YAML');
   t.equals(tagFile.layout, 'xref_layout.ms');
   t.equals(tagFile.contents.toString(), "Hello World");

   t.end();
})

test('cleanupFn && explicit path', function(t) {
   var files = createFiles();
   var cleanupFn = function(s) { return s.toUpperCase(); };
   tagger( { cleanupFn: cleanupFn, path : "altPath" }) (files, mockMetalsmith, done);
   t.equals(files.altPath.tags.map.FOO.length, 2);
   t.equals(files.altPath.tags.map.BAZ2.length, 1);
   t.end();
});


test('twice', function(t) {
   var files = createFiles();
   tagger({ YAML : { y1: 1 }}) (files, mockMetalsmith, done);
   tagger({YAML : { y1: 2, y3 : 3},  handle: 'altTagsArray', path: 'tags_cloud.html', contentString:""}) (files, mockMetalsmith, done);
   var tagFile = files['tags_cloud.html'];
   // console.dir(tagFile, {depth: 99});
   basicTest(t, tagFile);
   basicTest(t, tagFile, 'altTagsArray');
   t.equal(tagFile.handles.length, 2);
   t.end();
});

test('postProcess', function(t) {
   var files = createFiles();
   tagger({ postProcess: rateTag }) (files, mockMetalsmith, done);
   var tagFile = files['tags_cloud.html'];
   // console.dir(tagFile, {depth: 99});
   basicTest(t, tagFile);
   t.equals(tagFile.tags.array[0].rating, 1);
   t.equals(mockMetalsmith.setSomething, "hi");
   t.end();
})


function rateTag(file, options, files, metalsmith) {
   var xref = file[options.handle];
   var topRating = options.topRating || 4;
   xref.array.forEach(function (x) {
      x.rating = Math.floor((x.count * topRating) / xref.count);  // should be 1-topRating
   });
   metalsmith.setSomething = "hi";
}


test('filefilter', function(t) {
   var files = createFiles();
   tagger( { fileFilter: '.*html' }) (files, mockMetalsmith, done);
   // now only one tag for foo
   t.equals(files['tags_cloud.html'].tags.map.foo.length, 1);
   t.end();
})
