<!DOCTYPE html>
<html lang="en">

<head>
</head>

<body>

   <header class="mainheader">
      <link rel="stylesheet" href="/assets/css/tags.css">
   </header>

   <main>

      <div class="tags">Albums:
      <span><a href="/posts.html">all</a></span>
      {{#album}}
          <span><a href="/posts.html?album={{.}}">{{.}}</a></span>
      {{/album}}
      </div>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <div class="tags authors">Authors:
      <span><a href="/posts.html">all</a></span>
      {{#author}}
         <span><a href="/posts.html?author={{.}}">{{.}}</a></span>
      {{/author}}
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
