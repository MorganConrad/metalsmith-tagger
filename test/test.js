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

var mockMetalsmith = {
   _metadata: {},
   metadata: function() { return this._metadata; }
}

function basicTest(t, file, foo, bar1) {
   foo = foo || 'foo';
   bar1 = bar1 || 'bar1';
   t.equals(file.tagsMap[foo].length, 2);
   t.equals(file.tagsMap[bar1].length, 1);
   t.equals(file.tagsArray[0].count, 2);
   t.equals(file.tagsArray[4].count, 1);
}


test('defaults', function(t) {
   var files = createFiles();
   tagger() (files, mockMetalsmith, done);

   basicTest(t, files['tags_cloud.html']);
   t.deepEquals(files['tags_cloud.html'], mockMetalsmith._metadata['tags_cloud.html']);

   t.deepEquals(files['file1.md'].tags, ['foo', 'bar1', 'baz1']);
   t.end();
});

test('altTagsDelimColon', function(t) {
   var files = createFiles();
   tagger({handle: 'altTagsDelimColon', delimiter: ':'}) (files, mockMetalsmith, done);
   basicTest(t, files['altTagsDelimColon_cloud.html']);
   t.end();
});

test('altTagsArray', function(t) {
   var files = createFiles();
   tagger({handle: 'altTagsArray', delimiter: 'xxx'}) (files, mockMetalsmith, done);
   basicTest(t, files['altTagsArray_cloud.html']);
   t.end();
});

test('alternative Paths & cleanHandle', function(t) {
   var files = createFiles();
   tagger( { path: "alt_xref", cleanHandle : "cleanHandle" } )
      (files, mockMetalsmith, done);
   basicTest(t, files['alt_xref']);
   t.deepEquals(files['alt_xref'], mockMetalsmith._metadata['alt_xref']);
   t.deepEquals(files['file1.md'].cleanHandle, ['foo', 'bar1', 'baz1']);

   t.end();
});

test(' add YAML', function(t) {
   var files = createFiles();
   tagger( { YAML: { YAML : "xref_YAML" ,
                     layout: "xref_layout.ms" },
           } )
      (files, mockMetalsmith, done);
   basicTest(t, files['tags_cloud.html']);

   t.equals(files['tags_cloud.html'].YAML, 'xref_YAML');
   t.equals(files['tags_cloud.html'].layout, 'xref_layout.ms');
   t.end();
})

test('cleanupFn && explicit path', function(t) {
   var files = createFiles();
   var cleanupFn = function(s) { return s.toUpperCase(); };
   tagger( { cleanupFn: cleanupFn, path : "altPath" }) (files, mockMetalsmith, done);
   basicTest(t, files['altPath'], 'FOO', 'BAZ2');
   t.end();
});

test('filefilter & contentString', function(t) {
   var files = createFiles();
   tagger( { fileFilter: '.*html', contentString: "Hello World" }) (files, mockMetalsmith, done);
   // now only one tag for foo
   t.equals(files['tags_cloud.html'].tagsMap.foo.length, 1);
   t.equals(files['tags_cloud.html'].contents.toString(), "Hello World");
   t.end();
})

test('do nada', function(t) {
   var files = createFiles();
   tagger( { path : "." }) (files, mockMetalsmith, done);
   t.false(files['tags_cloud.html']);
   t.end();
})
