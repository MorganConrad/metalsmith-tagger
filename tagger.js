
module.exports = tagger;

 const defaults = {
   handle: "tags",
   delimiter : ',',
   cleanupFn: function(s) { return s; },
   YAML : {},
};


function tagger(options) {
   options = normalize(options);

   return function(files, metalsmith, done) {

      try {
         var { map, count } = buildTagsMap(files, metalsmith, options);
         var array = mapToSortedArray(map, options);
         var file = files[options.path] || { handles: [] };
         file = Object.assign(file,
                              options.YAML,
                              {
                                 path: options.path,
                                 contents: Buffer.from(options.contentString || "")
                              });
         file[options.handle] = { map, array, count };
         file.handles.push(options.handle);

         if (options.postProcess)
            options.postProcess(file, options, files, metalsmith);

         files[options.path] = file;

         done();
      }

      catch (err) {
         done(err);
      }
   }
};


function parseAndCleanTags(tagData, options) {
   tagData = tagData || [];
   if (!Array.isArray(tagData))
      tagData = tagData.split(options.delimiter);

   return tagData.map(function(tag) {
      return options.cleanupFn(tag.trim());
   });
}


function buildTagsMap(files, metalsmith, options) {
   var map = {};
   var count = 0;

   for (var filePath in files) {
      var fileData = files[filePath];

      if (fileData && options.fileFilter(filePath, fileData, metalsmith)) {
         var cleanTagsData = parseAndCleanTags(fileData[options.handle], options);
         if (cleanTagsData.length) {
            count += cleanTagsData.length;
            fileData[options.cleanHandle] = cleanTagsData;

            cleanTagsData.forEach(function(tag) {
               if (map[tag])
                  map[tag].push(filePath);
               else
                  map[tag] = [filePath];
            });
         }
      }
   }

   return { map, count };
};



function mapToSortedArray(tagsMap, options) {
   var tagArray = Object.keys(tagsMap).map(function(key) {
      return {
               id: key,
               files: tagsMap[key],
               count: tagsMap[key].length,
             };
   });
   tagArray.sort(function(a,b) { return b.count - a.count; });

   return tagArray;
}


/**
 * Normalize an `options` dictionary.
 *
 * @param {Object} options
 */

function normalize(inOptions){
   var options = Object.assign({}, defaults, inOptions || { });
   options.fileFilter = fileFilter(options.fileFilter);
   options.cleanHandle = options.cleanHandle || options.handle;
   options.path = options.path || options.handle + "_cloud.html";
   return options;
};


/* calculate file filter function */
function fileFilter(filter) {
   filter = filter || "";
   if (typeof filter === 'string')
      filter = new RegExp(filter);  // fall thru

   if (filter instanceof RegExp)
      return function(filePath) { return filter.test(filePath); }
   else   // must be a function itself
      return filter;

}
