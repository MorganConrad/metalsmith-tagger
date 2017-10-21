<!DOCTYPE html>
<html lang="en">

<head>
</head>

<body>

   <header class="mainheader">
      <link rel="stylesheet" href="assets/css/tags.css">
   </header>

   <main>
   <h1>Tag Cloud</h1>

   Click on an author or album...
   <br><br>

   <h2>Authors</h2>
   <div class="tags tag-cloud">
      <span><a href="posts.html">All</a></span>
      {{#author}}
         {{#array}}
          <span><a href="posts.html?author={{id}}">{{id}} ( {{count}} )</a></span>
         {{/array}}
      {{/author}}
   </div>
   <br><br><br>
   <h2>Albums</h2>
   <br>
   <div class="tags tag-cloud">
      <span><a href="posts.html">All</a></span>
      {{#album}}
         {{#array}}
          <span><a href="posts.html?album={{id}}">{{id}} ( {{count}} )</a></span>
         {{/array}}
      {{/album}}
   </div>
   <br><br><br>
</main>

<footer id="footer">
</footer>
</body>
</html>
