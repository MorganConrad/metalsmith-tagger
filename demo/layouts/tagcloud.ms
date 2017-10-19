<!DOCTYPE html>
<html lang="en">

<head>
</head>

<body>

   <header class="mainheader">
   </header>

   <main>
   <h1>Tag Cloud</h1>


   <h2>Authors</h2>
   <br><br>
   <div>
      <span><a href="/posts.html">All</a></span>
      {{#author}}
         {{#array}}
          <span><a href="/posts.html?author={{id}}">{{id}} ( {{count}} )</a></span>
         {{/array}}
      {{/author}}
   </div>

   <h2>Albums</h2>
   <br><br>
   <div>
      <span><a href="/posts.html">All</a></span>
      {{#album}}
         {{#array}}
          <span><a href="/posts.html?album={{id}}">{{id}} ( {{count}} )</a></span>
         {{/array}}
      {{/album}}
   </div>
   <br><br><br>
</main>

<footer id="footer">
</footer>
</body>
</html>
