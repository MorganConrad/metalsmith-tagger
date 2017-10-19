<!DOCTYPE html>
<html lang="en">

<head>
</head>

<body>

   <header class="mainheader">
   </header>

   <main>

      <div class="tags">Tags:
      <span><a href="/posts.html">all</a></span>
      {{#tags}}
         <span><a href="/posts.html?tag={{.}}">{{.}}</a></span>
      {{/tags}}
      </div>

      <article id="article">
         <h1>{{title}}</h1>
         <div>By {{author}}</div>

         <div>
            {{{ contents }}}
         </div>
      </article>

   </main>

   <footer id="footer">
   </footer>
</body>

</html>
