
module.exports = tagger;

 const defaults = {
   handle: "tags",
   delimiter : ',',
   cleanupFn: function(s) { return s; },
   //path : "tagger.html",
   YAML : {},
};


function tagger(options) {
   options = normalize(options);

   return function(files, metalsmith, done) {

      function buildTagsMap(files) {
         var tagsMap = {};

         for (var filePath in files) {
            var fileData = files[filePath];

            if (fileData && options.fileFilter(filePath, fileData, metalsmith)) {
               var cleanTagsData = parseAndCleanTags(fileData[options.handle], options);
               if (cleanTagsData.length) {
                  fileData[options.cleanHandle] = cleanTagsData;

                  cleanTagsData.forEach(function(tag) {
                     if (tagsMap[tag])
                        tagsMap[tag].push(filePath);
                     else
                        tagsMap[tag] = [filePath];
                  });
               }
            }
         }
         return tagsMap;
      }



      try {
         var tagsMap = buildTagsMap(files);
         var tagsArray = mapToSortedArray(tagsMap, options);
         var contentString = (options.contentString == null) ?  // note ==
                               JSON.stringify(tagsMap, null, 2) :
                               options.contentString;

         var tagFile = Object.assign({},
                              options.YAML,
                              {
                                 path: options.path,
                                 tagsMap: tagsMap,
                                 tagsArray: tagsArray,
                                 contents: Buffer.from(contentString)
                              });

         if (options.path != ".") {
            files[options.path] = tagFile;
            metalsmith.metadata()[options.path] = tagFile;
         }
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
