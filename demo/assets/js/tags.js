/* Server side JS to show/hide certain tags, based on the query */

/*
  Shows/hides tags.
  Returns String describing what it did
 */
function showTags(enclosingClass, query, attr_prefix) {
   var queryMap = parseQuery(query || window.location.search);
   attr_prefix = attr_prefix || "data-";

   var elements = document.getElementsByClassName(enclosingClass);

   Object.keys(queryMap).forEach(function(key) {
      var value = queryMap[key];
      if (value) {
         withCommas = ',' + value + ',';

         for (var i=0; i<elements.length; i++) {
            var attrValue = "," + (elements[i].getAttribute(attr_prefix+key) || "") + ",";
            if (attrValue.indexOf(withCommas) < 0)  // attr not present
               elements[i].style.display = 'none';
         }
      }
   });
}


function parseQuery(inQuery) {
   var parsed = {};
   if (inQuery.length > 1) {
      var pairs = inQuery.substring(1).split("&");
      for (var i=0;i<pairs.length;i++) {
         var split = pairs[i].split("=");
         var value = (split.length > 1) ? decodeURI(split[1]) : "";
         parsed[split[0]] = value;
      }
   }

   return parsed;
}


function onLoadShowTags(enclosingClass, attr_prefix, query) {
   query = query || window.location.search;
   showTags(enclosingClass, query, attr_prefix);
   if (query) { // add a little bit to h1 for our demo
      var h1 = document.getElementsByTagName('h1');
      if (h1.length)
         h1[0].insertAdjacentHTML('beforeEnd', " where " + decodeURIComponent(query.substring(1)));
   }
}
